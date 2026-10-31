// Turns a "Submit or update a logo" issue into repository changes.
//
//   node scripts/process-submission.mjs --event <issue event JSON> --out <result.json>
//
// Writes the logo/thumbnail/metadata files into the working tree and a result
// file the workflow uses to open the pull request and comment on the issue.
// Issue content is untrusted: it is only parsed and downloaded as data.
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { parseIssueForm, attachmentUrl } from './lib/issue-form.mjs';
import { inspectRaster, checkPng, checkSvg, normalizeToPng, makeThumb } from './lib/image.mjs';
import { KNOWN_UDT_SCRIPTS, scriptHash, isHex, typeScriptExistsOnChain, liveCellExists } from './lib/ckb.mjs';
import { validateToken, emptyLinks } from './lib/tokens.mjs';
import { renderReport } from './lib/report.mjs';
import { normalizeSymbol, logoUrl, UNSAFE_SLUG, XUDTS_JSON, TOKEN_LIST_JSON, SPEC } from './lib/rules.mjs';

const { values: args } = parseArgs({ options: { event: { type: 'string' }, out: { type: 'string' }, raw: { type: 'string', default: '' }, offline: { type: 'boolean', default: false } } });
const event = JSON.parse(fs.readFileSync(args.event, 'utf8'));
const issue = event.issue;
const form = parseIssueForm(issue.body);
const ROOT = process.cwd();
const MAX_DOWNLOAD = 5 * 1024 * 1024;

const errors = [];
const warnings = [];
const notes = [];
const rows = [];
const changedFiles = [];

const isXudt = form.asset_type === 'xUDT token';
const isReplace = form.request === 'Replace an existing logo';
const name = (form.name || '').trim();
const symbol = (form.symbol || '').trim();
if (!name) errors.push('"Display name" is required.');
if (isXudt && !symbol) errors.push('"Token symbol" is required for xUDT tokens.');

const slug = normalizeSymbol(form.logo_key || (isXudt ? symbol : name));
if (!slug) errors.push('Could not work out a logo file name. Fill in the symbol or display name.');
else if (UNSAFE_SLUG.test(slug)) errors.push(`The logo file name "${slug}" contains characters that are not allowed. Set "Logo file name (advanced)".`);

if (!attachmentUrl(form.png)) errors.push('"Logo image": drag the image file into the box so it is uploaded to GitHub. Links to other websites are not accepted.');
if (form.svg && !attachmentUrl(form.svg)) errors.push('"SVG version": drag the SVG file into the box so it is uploaded to GitHub.');
if (isXudt) {
  if (!/^\d+$/.test(String(form.decimals || '').trim()) || Number(form.decimals) > 255) errors.push('"Decimals" must be a whole number, e.g. 8.');
  if (!form.custom_script && !form.type_args) errors.push('Fill in "xUDT type script args" (or "Custom type script" for non-standard tokens).');
  if (form.type_args && !form.custom_script && (!isHex(form.type_args.trim().toLowerCase()) || form.type_args.trim() === '0x')) errors.push('"xUDT type script args" must be a 0x… hex string.');
  if (form.custom_script) {
    try {
      JSON.parse(form.custom_script);
    } catch (e) {
      errors.push(`"Custom type script" is not valid JSON (${e.message}).`);
    }
  }
}
for (const f of ['website', 'twitter', 'telegram', 'discord', 'github']) {
  if (form[f] && !/^https:\/\/\S+$/.test(form[f].trim())) errors.push(`"${f}" must be a full https:// link.`);
}

const pngPath = `public/logos/${slug}-logo.png`;
const svgPath = `public/logos/${slug}-logo.svg`;
const thumbPath = `public/logos/thumbs/${slug}.png`;
const exists = (p) => fs.existsSync(path.join(ROOT, p));

if (slug && !UNSAFE_SLUG.test(slug)) {
  if (!isReplace && exists(pngPath)) errors.push(`A logo named \`${slug}\` already exists (https://xudtlogos.cc/${encodeURIComponent(slug)}). Choose "Replace an existing logo" if you want to update it, or set a different file name.`);
  if (isReplace && !exists(pngPath)) errors.push(`There is no existing logo named \`${slug}\` to replace. Choose "Add a new logo".`);
}

async function download(field, label) {
  const url = attachmentUrl(form[field]);
  if (!url) {
    if (form[field]) errors.push(`${label}: attach the file by dragging it into the box. Only files uploaded to GitHub are accepted.`);
    return null;
  }
  const headers = url.startsWith('https://github.com/') && process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {};
  try {
    const res = await fetch(url, { headers, redirect: 'follow', signal: AbortSignal.timeout(30000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > MAX_DOWNLOAD) throw new Error('file is larger than 5 MB');
    return buf;
  } catch (e) {
    errors.push(`${label}: could not download the attachment (${e.message}).`);
    return null;
  }
}

const write = (p, data) => {
  fs.mkdirSync(path.dirname(path.join(ROOT, p)), { recursive: true });
  fs.writeFileSync(path.join(ROOT, p), data);
  changedFiles.push(p);
};

// ---- Logo image ------------------------------------------------------------
if (!errors.length) {
  const raw = await download('png', 'Logo image');
  if (raw) {
    let info;
    try {
      info = await inspectRaster(raw);
    } catch {
      errors.push('Logo image: the file is not a readable image. Upload a PNG, JPEG or WebP.');
    }
    if (info) {
      if (Math.min(info.width, info.height) < SPEC.minPx) {
        errors.push(`Logo image is ${info.width}×${info.height}px; it must be at least ${SPEC.minPx}px on each side.`);
      } else {
        const ratio = Math.max(info.width, info.height) / Math.min(info.width, info.height);
        if (ratio > 1.05) warnings.push(`The image was ${info.width}×${info.height}px and has been padded to a square with transparent space. Upload a square image if the result looks wrong.`);
        let out = await normalizeToPng(raw);
        let outInfo = await inspectRaster(out.buf);
        if (outInfo.kb > SPEC.maxPngKb) {
          const sharp = (await import('sharp')).default;
          out = { ...out, buf: await sharp(out.buf).png({ palette: true, quality: 90, compressionLevel: 9 }).toBuffer() };
          outInfo = await inspectRaster(out.buf);
        }
        const r = checkPng(outInfo);
        errors.push(...r.errors.map((e) => `Logo image: ${e}`));
        warnings.push(...r.warnings.filter((w) => !/recommended maximum/.test(w)).map((w) => `Logo image: ${w}`));
        if (info.format !== 'png' || out.resized) notes.push(`Converted ${String(info.format).toUpperCase()} ${info.width}×${info.height}px (${info.kb} KB) to PNG ${outInfo.width}×${outInfo.height}px (${outInfo.kb} KB).`);
        if (!r.errors.length) {
          write(pngPath, out.buf);
          write(thumbPath, await makeThumb(out.buf));
          rows.push({ file: pngPath, status: isReplace ? 'replaced' : 'added', details: `${outInfo.width}×${outInfo.height}px · ${outInfo.kb} KB`, errors: [], warnings: [] });
          rows.push({ file: thumbPath, status: 'generated', details: `${SPEC.thumbPx}×${SPEC.thumbPx}px thumbnail`, errors: [], warnings: [] });
        }
      }
    }
  }
}

// ---- Optional SVG ------------------------------------------------------------
if (!errors.length && form.svg) {
  const svg = await download('svg', 'SVG version');
  if (svg) {
    const r = checkSvg(svg.toString('utf8'), svg.length);
    errors.push(...r.errors.map((e) => `SVG: ${e}`));
    warnings.push(...r.warnings.map((w) => `SVG: ${w}`));
    if (!r.errors.length) {
      write(svgPath, svg);
      rows.push({ file: svgPath, status: 'added', details: `SVG · ${r.kb} KB`, errors: [], warnings: [] });
    }
  }
}

// ---- xUDT metadata ---------------------------------------------------------
let token = null;
if (!errors.length && isXudt) {
  const decimals = Number(form.decimals);

  let typeScript;
  let typeCellDep;
  if (form.custom_script) {
    try {
      const c = JSON.parse(form.custom_script);
      typeScript = c.typeScript;
      typeCellDep = c.typeCellDep;
    } catch {}
  } else {
    const args = form.type_args.trim().toLowerCase();
    const k = KNOWN_UDT_SCRIPTS.xudt;
    typeScript = { args, codeHash: k.codeHash, hashType: k.hashType };
    typeCellDep = k.cellDep;
  }

  if (!errors.length) {
    const links = emptyLinks();
    for (const [k, f] of [['official', 'website'], ['twitter', 'twitter'], ['telegram', 'telegram'], ['discord', 'discord'], ['github', 'github']]) links[k] = (form[f] || '').trim();
    token = {
      name,
      symbol,
      logo: logoUrl(slug),
      decimals,
      typeHash: scriptHash(typeScript),
      typeScript: { args: typeScript.args, codeHash: typeScript.codeHash, hashType: typeScript.hashType },
      typeCellDep,
      extensions: { links },
    };
    errors.push(...validateToken(token, { logoExists: (s) => s === slug || exists(`public/logos/${s}-logo.png`) }));
  }

  if (!errors.length && !args.offline) {
    const onChain = await typeScriptExistsOnChain(token.typeScript);
    if (onChain === false) errors.push(`No cells with this type script exist on CKB mainnet (type hash ${token.typeHash}). Check the args.`);
    else if (onChain === null) warnings.push('Could not reach a CKB node to confirm the token exists on mainnet. A maintainer should verify the type hash.');
    else notes.push(`Verified on CKB mainnet: type hash \`${token.typeHash}\`.`);
    const dep = await liveCellExists(token.typeCellDep.outPoint);
    if (dep === false) errors.push('The typeCellDep out point is not a live cell on mainnet.');
  }

  if (!errors.length) {
    const list = JSON.parse(fs.readFileSync(path.join(ROOT, TOKEN_LIST_JSON), 'utf8'));
    const i = list.tokens.findIndex((t) => String(t.typeHash).toLowerCase() === token.typeHash);
    const existingSlug = i >= 0 ? decodeURIComponent((/\/logos\/(.+)-logo\.png$/.exec(list.tokens[i].logo || '') || [])[1] || '') : null;
    if (i >= 0 && existingSlug !== slug) {
      // Never let a submission take over another asset's entry.
      errors.push(`This type script is already registered as "${list.tokens[i].symbol}" (logo \`${existingSlug}\`). If you own it, choose "Replace an existing logo" and set "Logo file name" to \`${existingSlug}\`.`);
    } else {
      if (i < 0) {
        const sameSymbol = list.tokens.find((t) => t.symbol.toLowerCase() === symbol.toLowerCase());
        if (sameSymbol) warnings.push(`Another token with the symbol "${sameSymbol.symbol}" already exists (type hash ${sameSymbol.typeHash}). Make sure this is not an impersonation.`);
        list.tokens.push(token);
      } else {
        list.tokens[i] = { ...list.tokens[i], ...token };
      }
      write(TOKEN_LIST_JSON, JSON.stringify(list, null, 4) + '\n');

      const xudts = JSON.parse(fs.readFileSync(path.join(ROOT, XUDTS_JSON), 'utf8'));
      xudts[slug] = { name, symbol };
      write(XUDTS_JSON, JSON.stringify(xudts, null, 4) + '\n');
      rows.push({ file: TOKEN_LIST_JSON, status: i >= 0 ? 'updated' : 'added', details: `${symbol} · decimals ${token.decimals} · type hash ${token.typeHash.slice(0, 10)}…`, errors: [], warnings: [] });
    }
  }
}

// ---- Result ------------------------------------------------------------------
const ok = errors.length === 0;
if (!ok) {
  // Leave the working tree untouched on failure.
  for (const f of new Set(changedFiles)) {
    try {
      fs.rmSync(path.join(ROOT, f));
    } catch {}
  }
}
const preview = (p) => (args.raw && /\.(png|svg)$/.test(p) ? args.raw + p.split('/').map(encodeURIComponent).join('/') : '');
const allRows = ok ? rows.map((r) => ({ ...r, preview: preview(r.file) })) : [];
const summaryRow = { file: `issue #${issue.number}`, status: 'submission', details: `${name || '?'}${symbol ? ` (${symbol})` : ''} → \`${slug}\``, errors, warnings };
const report = renderReport({
  title: 'Logo submission',
  rows: [summaryRow, ...allRows],
  footer: notes.length ? `### What the bot did\n\n${notes.map((n) => `- ${n}`).join('\n')}\n` : '',
});

const kind = isXudt ? 'xUDT' : form.asset_type === 'DOB / Spore cluster' ? 'DOB' : 'logo';
const result = {
  ok,
  slug,
  branch: `logo-submission/issue-${issue.number}`,
  title: `${isReplace ? 'Update' : 'Add'} ${name}${symbol && symbol !== name ? ` (${symbol})` : ''} ${kind} logo`,
  report: report.markdown,
  files: [...new Set(changedFiles)].filter(() => ok),
  replace: isReplace,
  labels: ['logo', ...(isXudt ? ['token-info'] : []), ...(isReplace ? ['changes-existing-logo'] : [])],
};
fs.writeFileSync(args.out, JSON.stringify(result, null, 2));
console.log(report.markdown);
