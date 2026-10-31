// Image inspection used by both the PR check and the submission bot.
import sharp from 'sharp';
import { SPEC } from './rules.mjs';

export async function inspectRaster(buf) {
  const meta = await sharp(buf).metadata();
  const { width, height, format, hasAlpha } = meta;
  let transparentCorners = false;
  if (hasAlpha) {
    const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const a = (x, y) => data[(y * info.width + x) * info.channels + 3];
    const w = info.width - 1;
    const h = info.height - 1;
    transparentCorners = [a(0, 0), a(w, 0), a(0, h), a(w, h)].every((v) => v < 16);
  }
  return { width, height, format, hasAlpha: !!hasAlpha, transparentCorners, kb: Math.round(buf.length / 1024) };
}

// Checks a file that is (or will be) stored as {slug}-logo.png.
export function checkPng(info) {
  const errors = [];
  const warnings = [];
  if (info.format !== 'png') errors.push(`File content is ${String(info.format).toUpperCase()}, not PNG. Export it as a real PNG.`);
  const diff = Math.abs(info.width - info.height);
  if (diff > 2) errors.push(`Image must be square; it is ${info.width}×${info.height}px.`);
  else if (diff > 0) warnings.push(`Image is almost square (${info.width}×${info.height}px).`);
  if (Math.min(info.width, info.height) < SPEC.minPx) errors.push(`Image is ${info.width}px; the minimum is ${SPEC.minPx}px.`);
  if (Math.max(info.width, info.height) > SPEC.maxPx) warnings.push(`Image is ${info.width}px; the recommended maximum is ${SPEC.maxPx}px.`);
  if (info.kb > SPEC.maxPngKb) errors.push(`PNG is ${info.kb} KB; the maximum is ${SPEC.maxPngKb} KB.`);
  if (!info.hasAlpha) warnings.push('PNG has no transparency channel; the background should be transparent.');
  else if (!info.transparentCorners) warnings.push('Corners are not transparent; check that the background is transparent.');
  return { errors, warnings };
}

const SVG_DANGER = [
  [/<script[\s>]/i, '<script> elements'],
  [/\son[a-z]+\s*=/i, 'inline event handlers (onload=, onclick=, …)'],
  [/javascript:/i, 'javascript: URLs'],
  [/<foreignObject[\s>]/i, '<foreignObject> elements'],
  [/<!ENTITY/i, 'XML entity declarations'],
  [/<(iframe|embed|object)[\s>]/i, 'embedded documents'],
  [/(xlink:)?href\s*=\s*["']\s*(https?:|\/\/|data:text)/i, 'references to external resources'],
];

export function checkSvg(text, bytes) {
  const errors = [];
  const warnings = [];
  const kb = Math.max(1, Math.round(bytes / 1024));
  if (!/<svg[\s>]/i.test(text)) errors.push('File is not an SVG document.');
  for (const [re, what] of SVG_DANGER) if (re.test(text)) errors.push(`SVG contains ${what}, which is not allowed.`);
  if (kb > SPEC.maxSvgKb) errors.push(`SVG is ${kb} KB; the maximum is ${SPEC.maxSvgKb} KB. Minify it (e.g. with SVGO).`);
  const vb = /viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(text);
  if (vb && Math.abs(Number(vb[1]) - Number(vb[2])) > 0.5) warnings.push(`SVG viewBox is not square (${vb[1]}×${vb[2]}).`);
  return { errors, warnings, kb };
}

// Turns any decodable image into a spec-compliant PNG: square (transparent
// padding), at most targetPx, optimised. Used only for new submissions.
export async function normalizeToPng(buf) {
  const meta = await sharp(buf).metadata();
  const side = Math.max(meta.width, meta.height);
  const target = Math.min(side, SPEC.targetPx);
  const out = await sharp(buf)
    .ensureAlpha()
    .resize(target, target, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
  return { buf: out, resized: side !== target || meta.width !== meta.height, from: `${meta.width}×${meta.height}`, to: `${target}×${target}` };
}

export async function makeThumb(buf) {
  return sharp(buf)
    .resize(SPEC.thumbPx, SPEC.thumbPx, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
}
