// Generates small (160px) previews of every logo into public/previews/ so
// the listing pages never download multi-megabyte originals. Output is
// git-ignored and regenerated on `npm run dev` / `npm run build`.
// Originals in public/logos/ are never modified.
import fs from 'node:fs';
import path from 'node:path';
import { previewName } from '../src/lib/previewName.mjs';

const LOGO_DIR = path.join(process.cwd(), 'public', 'logos');
const OUT_DIR = path.join(process.cwd(), 'public', 'previews');
const SIZE = 160;

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.warn('[previews] sharp unavailable; pages will fall back to full-size logos.');
  process.exit(0);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
let made = 0;
let failed = 0;
for (const f of fs.readdirSync(LOGO_DIR)) {
  const m = /^(.+)-logo\.png$/.exec(f);
  if (!m) continue;
  const src = path.join(LOGO_DIR, f);
  const dest = path.join(OUT_DIR, previewName(m[1]));
  if (fs.existsSync(dest) && fs.statSync(dest).mtimeMs >= fs.statSync(src).mtimeMs) continue;
  try {
    await sharp(src)
      .resize(SIZE, SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9, palette: true, quality: 90 })
      .toFile(dest);
    made++;
  } catch (e) {
    failed++;
    console.warn(`[previews] ${f}: ${e.message}`);
  }
}
console.log(`[previews] ${made} generated${failed ? `, ${failed} failed` : ''}.`);
