// File name of the small preview generated for a logo by
// scripts/generate-previews.mjs. Kept ASCII-only so it is safe in any URL.
export const previewName = (slug) =>
  encodeURIComponent(slug).replace(/[%'()*!~]/g, '_') + '.png';
