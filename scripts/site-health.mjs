// Checks that every logo in the repository is served correctly by the live site.
//
//   node scripts/site-health.mjs [--base https://xudtlogos.cc] [--wait-for-deploy] [--out report.md]
//
// --wait-for-deploy polls until the live token_list.json matches the repository
// (up to 10 minutes) before checking, for use right after a merge.
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

const { values: args } = parseArgs({
  options: {
    base: { type: 'string', default: 'https://xudtlogos.cc' },
    'wait-for-deploy': { type: 'boolean', default: false },
    out: { type: 'string' },
  },
});

const ROOT = process.cwd();
const enc = (p) => p.split('/').map(encodeURIComponent).join('/');
const url = (p) => `${args.base}/${enc(p)}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(p, method = 'GET') {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url(p), { method, redirect: 'follow', signal: AbortSignal.timeout(20000) });
      return res;
    } catch (e) {
      if (attempt >= 3) return { ok: false, status: 0, headers: new Headers(), error: e.message };
      await sleep(2000 * attempt);
    }
  }
}

const localTokens = fs.readFileSync(path.join(ROOT, 'public/tokens/token_list.json'), 'utf8');
const sameTokens = async () => {
  const res = await get('tokens/token_list.json');
  if (!res.ok) return false;
  try {
    return JSON.stringify(await res.json()) === JSON.stringify(JSON.parse(localTokens));
  } catch {
    return false;
  }
};

if (args['wait-for-deploy']) {
  const deadline = Date.now() + 10 * 60 * 1000;
  while (!(await sameTokens()) && Date.now() < deadline) await sleep(30000);
}

const files = [];
for (const f of fs.readdirSync(path.join(ROOT, 'public/logos'))) if (/-logo\.(png|svg)$/.test(f)) files.push(`logos/${f}`);
for (const f of fs.readdirSync(path.join(ROOT, 'public/logos/thumbs'))) if (f.endsWith('.png')) files.push(`logos/thumbs/${f}`);
files.push('tokens/token_list.json', 'llms.txt');

const failures = [];
const queue = [...files];
await Promise.all(
  Array.from({ length: 8 }, async () => {
    while (queue.length) {
      const p = queue.shift();
      const res = await get(p, 'HEAD');
      const type = res.headers.get('content-type') || '';
      const wantImage = p.startsWith('logos/');
      if (!res.ok) failures.push(`\`/${p}\` returned ${res.status || res.error}`);
      else if (wantImage && !type.startsWith('image/')) failures.push(`\`/${p}\` is served as \`${type}\`, not an image`);
    }
  })
);
if (!(await sameTokens())) failures.push('Live `/tokens/token_list.json` differs from the repository.');

const ok = failures.length === 0;
const report = ok
  ? `All ${files.length} files are served correctly by ${args.base}.`
  : [`${failures.length} of ${files.length} checks failed on ${args.base}:`, '', ...failures.sort().map((f) => `- ${f}`)].join('\n');
if (args.out) fs.writeFileSync(args.out, report);
console.log(report);
process.exitCode = ok ? 0 : 1;
