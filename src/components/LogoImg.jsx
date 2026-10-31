'use client';

import { useState } from 'react';

// Shows the small generated preview and falls back to the original PNG
// if the preview is missing (e.g. sharp was unavailable at build time).
export default function LogoImg({ slug, preview, alt = '', className = '', eager = false }) {
  const [src, setSrc] = useState(preview || `/logos/${slug}-logo.png`);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => {
        const full = `/logos/${slug}-logo.png`;
        if (src !== full) setSrc(full);
      }}
    />
  );
}
