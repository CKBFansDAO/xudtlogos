// Reports logos that do not meet the README "Logo Specifications".
// Usage: npm run check:logos [-- --strict]   (--strict exits 1 on any issue)
import fs from 'node:fs';
import path from 'node:path';
import { imageSize } from 'image-size';

const LOGO_DIR = path.join(process.cwd(), 'public', 'logos');
const SPEC = { minPx: 128, maxPx: 512, maxPngKb: 500, maxSvgKb: 50 };
const strict = process.argv.includes('--strict');

const rows = [];
const noted = [];
for (const f of fs.readdirSync(LOGO_DIR).sort()) {
  const file = path.join(LOGO_DIR, f);
  const kb = Math.round(fs.statSync(file).size / 1024);
  const issues = [];
  const notes = [];
  if (/-logo\.png$/.test(f)) {
    const { width: w, height: h, type } = imageSize(fs.readFileSync(file));
    if (type !== 'png') issues.push(`${type.toUpperCase()} data with .png name`);
    if (w !== h) issues.push(`not square ${w}x${h}`);
    if (w < SPEC.minPx) issues.push(`${w}px < ${SPEC.minPx}px`);
    if (w > SPEC.maxPx) notes.push(`${w}px > ${SPEC.maxPx}px (note)`);
    if (kb > SPEC.maxPngKb) issues.push(`${kb}KB > ${SPEC.maxPngKb}KB`);
  } else if (/-logo\.svg$/.test(f)) {
    if (kb > SPEC.maxSvgKb) issues.push(`${kb}KB > ${SPEC.maxSvgKb}KB`);
  } else continue;
  if (issues.length) rows.push(`${f.padEnd(48)} ${[...issues, ...notes].join(', ')}`);
  else if (notes.length) noted.push(`${f.padEnd(48)} ${notes.join(', ')}`);
}
console.log(rows.length ? rows.join('\n') : 'All logos meet the specification.');
if (noted.length) console.log(`\nNotes (allowed, but larger than recommended):\n${noted.join('\n')}`);
console.log(`\n${rows.length} file(s) with issues, ${noted.length} with notes.`);
if (strict && rows.length) process.exit(1);
