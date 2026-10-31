// Validates the files changed by a pull request.
//
//   node scripts/check-pr.mjs --base <dir> --head <dir> --files <files.json>
//        [--labels a,b] [--raw <url prefix for previews>] [--out report.md] [--json result.json]
//
// <files.json> is the GitHub "list pull request files" response
// ([{ filename, status, previous_filename }]). The script only reads files;
// it never runs anything from the PR, so it is safe under pull_request_target.
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { inspectRaster, checkPng, checkSvg } from './lib/image.mjs';
import { validateToken } from './lib/tokens.mjs';
import { renderReport } from './lib/report.mjs';
import { LOGO_FILE, THUMB_FILE, XUDTS_JSON, TOKEN_LIST_JSON, SPEC, normalizeSymbol, UNSAFE_SLUG } from './lib/rules.mjs';

const { values: args } = parseArgs({
  options: {
    base: { type: 'string' },
    head: { type: 'string' },
    files: { type: 'string' },
    labels: { type: 'string', default: '' },
    raw: { type: 'string', default: '' },
    out: { type: 'string' },
    json: { type: 'string' },
  },
});

const labels = new Set(args.labels.split(',').map((s) => s.trim()).filter(Boolean));
const ALLOW_REMOVAL = labels.has('allow-logo-removal');
const changed = JSON.parse(fs.readFileSync(args.files, 'utf8'));
const read = (root, p) => {
  try {
    const full = path.join(root, p);
    // Never follow symlinks from an untrusted checkout.
    if (fs.lstatSync(full).isSymbolicLink()) return null;
    if (!path.resolve(full).startsWith(path.resolve(root) + path.sep)) return null;
    return fs.readFileSync(full);
  } catch {
    return null;
  }
};
const exists = (root, p) => fs.existsSync(path.join(root, p));
const rawUrl = (p) => (args.raw ? args.raw + p.split('/').map(encodeURIComponent).join('/') : '');
const readJson = (root, p) => {
  const b = read(root, p);
  if (!b) return { value: null };
  try {
    return { value: JSON.parse(b.toString('utf8')) };
  } catch (e) {
    return { error: e.message };
  }
};

const rows = [];
const preexisting = [];
const outLabels = new Set();
let touchesLogos = false;
let touchesCode = false;

function slugProblems(slug) {
  const e = [];
  if (slug !== normalizeSymbol(slug)) e.push(`File name must be normalised: use \`${normalizeSymbol(slug)}-logo.*\` (lowercase, spaces and "/" become "-").`);
  if (UNSAFE_SLUG.test(slug)) e.push('File name contains characters that are not allowed in URLs.');
  return e;
}

for (const f of changed) {
  const file = f.filename;
  const status = f.status;
  const row = { file, status, errors: [], warnings: [], details: '' };
  const logo = LOGO_FILE.exec(file);
  const thumb = THUMB_FILE.exec(file);

  if (status === 'renamed' && f.previous_filename && (LOGO_FILE.test(f.previous_filename) || THUMB_FILE.test(f.previous_filename))) {
    touchesLogos = true;
    outLabels.add('changes-existing-logo');
    if (!ALLOW_REMOVAL) row.errors.push(`Renames \`${f.previous_filename}\`, which breaks its live URL. A maintainer must add the \`allow-logo-removal\` label to allow this.`);
  }

  if (logo || thumb) {
    touchesLogos = true;
    outLabels.add('logo');
    if (status === 'removed') {
      outLabels.add('changes-existing-logo');
      if (!ALLOW_REMOVAL) row.errors.push('Deletes a live logo that apps may be using. A maintainer must add the `allow-logo-removal` label to allow this.');
      rows.push(row);
      continue;
    }
    if (status === 'modified') {
      outLabels.add('changes-existing-logo');
      row.warnings.push('Replaces a logo that is already live. Confirm the request comes from the project owner.');
    }
    const buf = read(args.head, file);
    if (!buf) {
      row.errors.push('File could not be read.');
      rows.push(row);
      continue;
    }
    row.preview = rawUrl(file);
    if (logo) {
      row.errors.push(...slugProblems(logo[1]));
      if (logo[2] === 'png') {
        try {
          const info = await inspectRaster(buf);
          row.details = `${info.width}×${info.height}px · ${info.kb} KB · ${String(info.format).toUpperCase()}`;
          const r = checkPng(info);
          row.errors.push(...r.errors);
          row.warnings.push(...r.warnings);
        } catch {
          row.errors.push('File is not a readable image.');
        }
      } else {
        const r = checkSvg(buf.toString('utf8'), buf.length);
        row.details = `SVG · ${r.kb} KB`;
        row.errors.push(...r.errors);
        row.warnings.push(...r.warnings);
        if (!exists(args.head, `public/logos/${logo[1]}-logo.png`)) row.errors.push('An SVG needs a PNG with the same name; PNG is required.');
      }
    } else {
      try {
        const info = await inspectRaster(buf);
        row.details = `thumbnail · ${info.width}×${info.height}px · ${info.kb} KB`;
        if (info.format !== 'png') row.errors.push('Thumbnail must be a PNG.');
        if (info.width !== SPEC.thumbPx || info.height !== SPEC.thumbPx) row.warnings.push(`Thumbnails should be ${SPEC.thumbPx}×${SPEC.thumbPx}px.`);
        if (!exists(args.head, `public/logos/${thumb[1]}-logo.png`)) row.warnings.push('No full-size logo with the same name.');
      } catch {
        row.errors.push('File is not a readable image.');
      }
    }
    rows.push(row);
    continue;
  }

  if (file === XUDTS_JSON) {
    outLabels.add('token-info');
    const head = readJson(args.head, file);
    const base = readJson(args.base, file).value || {};
    if (head.error) row.errors.push(`Invalid JSON: ${head.error}`);
    else if (head.value) {
      const added = Object.keys(head.value).filter((k) => JSON.stringify(head.value[k]) !== JSON.stringify(base[k]));
      const removed = Object.keys(base).filter((k) => !(k in head.value));
      row.details = `${added.length} added/changed, ${removed.length} removed`;
      for (const k of added) {
        const v = head.value[k];
        row.errors.push(...slugProblems(k).map((e) => `key "${k}": ${e}`));
        if (!v || typeof v.name !== 'string' || typeof v.symbol !== 'string') row.errors.push(`"${k}" needs string "name" and "symbol".`);
        if (!exists(args.head, `public/logos/${k}-logo.png`)) row.errors.push(`"${k}" has no logo file public/logos/${k}-logo.png.`);
      }
      if (removed.length) row.warnings.push(`Removes ${removed.join(', ')} from the xUDT list (logos stay online).`);
    }
    rows.push(row);
    continue;
  }

  if (file === TOKEN_LIST_JSON) {
    outLabels.add('token-info');
    const head = readJson(args.head, file);
    const base = readJson(args.base, file).value?.tokens || [];
    if (head.error) row.errors.push(`Invalid JSON: ${head.error}`);
    else {
      const tokens = head.value?.tokens;
      if (!Array.isArray(tokens)) row.errors.push('File must contain a "tokens" array.');
      else {
        const baseByHash = new Map(base.map((t) => [String(t.typeHash).toLowerCase(), JSON.stringify(t)]));
        const headHashes = new Set();
        const logoExists = (slug) => exists(args.head, `public/logos/${slug}-logo.png`);
        const baseLogoExists = (slug) => exists(args.base, `public/logos/${slug}-logo.png`);
        let changedCount = 0;
        for (const t of tokens) {
          const h = String(t?.typeHash).toLowerCase();
          if (headHashes.has(h)) row.errors.push(`Duplicate typeHash ${h} (${t.symbol}).`);
          headHashes.add(h);
          const isNew = baseByHash.get(h) !== JSON.stringify(t);
          const errs = validateToken(t, { logoExists });
          if (isNew) {
            changedCount++;
            row.errors.push(...errs);
          } else {
            // Unchanged entry: only problems that also exist on the base branch are pre-existing.
            const before = new Set(validateToken(t, { logoExists: baseLogoExists }));
            for (const e of errs) (before.has(e) ? preexisting : row.errors).push(e);
          }
        }
        const removed = [...baseByHash.keys()].filter((h) => !headHashes.has(h));
        if (removed.length) {
          outLabels.add('changes-existing-logo');
          const msg = `Removes ${removed.length} token(s) from token_list.json, which wallets and DApps read.`;
          if (ALLOW_REMOVAL) row.warnings.push(msg);
          else row.errors.push(`${msg} A maintainer must add the \`allow-logo-removal\` label to allow this.`);
        }
        row.details = `${changedCount} added/changed, ${removed.length} removed`;
      }
    }
    rows.push(row);
    continue;
  }

  touchesCode = true;
}

if (touchesCode) outLabels.add('site-code');
if (touchesCode && touchesLogos) {
  rows.push({ file: '(pull request)', status: 'scope', errors: [], warnings: ['Mixes logo changes with site code. Consider separate pull requests so logos can be merged quickly.'] });
}

const title = touchesLogos || outLabels.has('token-info') ? 'Logo check' : 'Logo check (no logo or token files changed)';
const footer = rows.some((r) => r.status !== 'scope')
  ? [
      '### Reviewer checklist',
      '',
      'The bot cannot check these:',
      '- [ ] The submitter represents the project (e.g. linked from the official site or social account).',
      '- [ ] The logo matches the official brand and is not misleading.',
      outLabels.has('changes-existing-logo') && '- [ ] **This PR changes or removes a live logo.** The new file is intended to replace the old one for every app.',
      '',
      '<sub>Automated check · rules in `scripts/lib/rules.mjs` · run locally with `npm run check:logos`</sub>',
    ].filter((l) => l !== false).join('\n')
  : '';

const report = renderReport({ title, rows: rows.filter((r) => r.status !== 'scope' || r.warnings.length), preexisting: [...new Set(preexisting)], footer });
outLabels.add(report.ok ? 'checks-passed' : 'checks-failed');

if (args.out) fs.writeFileSync(args.out, report.markdown);
if (args.json) fs.writeFileSync(args.json, JSON.stringify({ ok: report.ok, labels: [...outLabels], errors: report.errors, warnings: report.warnings }, null, 2));
if (!args.out) console.log(report.markdown);
process.exitCode = report.ok ? 0 : 1;
