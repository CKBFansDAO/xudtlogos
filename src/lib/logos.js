import fs from 'node:fs';
import path from 'node:path';
import { imageSize } from 'image-size';
import xudts from '@/assets/xudts.json';
import { previewName } from './previewName.mjs';

// Build-time only (used from Server Components / generateStaticParams).
// The single source of truth is the file system: every public/logos/{slug}-logo.png
// becomes an entry, so a contributor only has to add the image file.

const ROOT = process.cwd();
const LOGO_DIR = path.join(ROOT, 'public', 'logos');
const THUMB_DIR = path.join(LOGO_DIR, 'thumbs');
const TOKEN_LIST = path.join(ROOT, 'public', 'tokens', 'token_list.json');

import { SITE_URL, pagePath, pngUrl, svgUrl } from './links';

export { SITE_URL, pagePath, pngUrl, svgUrl };

// Spec from README "Logo Specifications".
export const SPEC = { minPx: 128, maxPx: 512, maxPngKb: 500, maxSvgKb: 50 };

function readImage(file) {
  try {
    const { width, height, type } = imageSize(fs.readFileSync(file));
    return { width, height, type };
  } catch {
    return null;
  }
}

function titleCase(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((w) => {
      if (/^\(.*\)$/.test(w)) return w.toUpperCase();
      if (/^[a-z]/.test(w)) return w.charAt(0).toUpperCase() + w.slice(1);
      return w;
    })
    .join(' ');
}

function loadTokenMeta() {
  try {
    const { tokens = [] } = JSON.parse(fs.readFileSync(TOKEN_LIST, 'utf8'));
    const map = {};
    for (const t of tokens) {
      const m = /\/logos\/(.+)-logo\.png$/.exec(t.logo || '');
      if (m) map[decodeURIComponent(m[1])] = t;
    }
    return map;
  } catch {
    return {};
  }
}

let cache;

export function getAllLogos() {
  if (cache) return cache;
  const files = fs.readdirSync(LOGO_DIR);
  const tokenMeta = loadTokenMeta();
  const registryOrder = Object.keys(xudts);
  const slugs = new Set();
  for (const f of files) {
    const m = /^(.+)-logo\.(png|svg)$/.exec(f);
    if (m) slugs.add(m[1]);
  }

  const entries = [...slugs].map((slug) => {
    const pngFile = path.join(LOGO_DIR, `${slug}-logo.png`);
    const svgFile = path.join(LOGO_DIR, `${slug}-logo.svg`);
    const hasPng = fs.existsSync(pngFile);
    const hasSvg = fs.existsSync(svgFile);
    const dims = hasPng ? readImage(pngFile) : null;
    const pngKb = hasPng ? Math.round(fs.statSync(pngFile).size / 1024) : null;
    const svgKb = hasSvg ? Math.max(1, Math.round(fs.statSync(svgFile).size / 1024)) : null;
    const reg = xudts[slug];
    const meta = tokenMeta[slug] || null;

    const issues = [];
    const notes = [];
    if (!hasPng) issues.push('PNG file is missing (PNG is required)');
    if (dims && dims.type !== 'png') issues.push(`File is ${dims.type.toUpperCase()} data with a .png name`);
    if (dims) {
      if (dims.width !== dims.height) issues.push(`Not square (${dims.width}×${dims.height})`);
      if (dims.width < SPEC.minPx) issues.push(`Smaller than ${SPEC.minPx}px`);
      if (dims.width > SPEC.maxPx) notes.push(`Larger than the ${SPEC.maxPx}px maximum; downscale before use`);
    }
    if (pngKb > SPEC.maxPngKb) issues.push(`PNG is ${pngKb} KB (max ${SPEC.maxPngKb} KB)`);
    if (svgKb > SPEC.maxSvgKb) issues.push(`SVG is ${svgKb} KB (max ${SPEC.maxSvgKb} KB)`);

    return {
      slug,
      name: reg?.name || meta?.name || titleCase(slug),
      symbol: reg?.symbol || meta?.symbol || null,
      type: reg ? 'xudt' : 'other',
      order: reg ? registryOrder.indexOf(slug) : Infinity,
      hasPng,
      hasSvg,
      width: dims?.width ?? null,
      height: dims?.height ?? null,
      pngKb,
      svgKb,
      hasThumb: fs.existsSync(path.join(THUMB_DIR, `${slug}.png`)),
      preview: `/previews/${previewName(slug)}`,
      issues,
      notes,
      meta,
    };
  });

  entries.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, 'en'));
  cache = entries;
  return entries;
}

export function getLogo(slug) {
  return getAllLogos().find((l) => l.slug === slug) || null;
}

// Paths are always the raw slug; the browser percent-encodes as needed.
export const pngPath = (slug) => `/logos/${slug}-logo.png`;
export const svgPath = (slug) => `/logos/${slug}-logo.svg`;

// Minimal, serialisable shape for the client-side browser.
export const toCard = (l) => ({
  slug: l.slug,
  name: l.name,
  symbol: l.symbol,
  type: l.type,
  hasSvg: l.hasSvg,
  width: l.width,
  ok: l.issues.length === 0,
  preview: l.preview,
});
