'use client';

import { useState } from 'react';

const BACKGROUNDS = [
  { key: 'checker', label: 'Transparent', className: 'checker' },
  { key: 'light', label: 'Light', className: 'bg-white' },
  { key: 'dark', label: 'Dark', className: 'bg-ink' },
];

export default function LogoStage({ src, alt }) {
  const [bg, setBg] = useState('checker');
  const current = BACKGROUNDS.find((b) => b.key === bg);

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className={`grid aspect-square w-full max-w-full place-items-center rounded-xl border border-line ${current.className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="h-[62%] w-[62%] object-contain" decoding="async" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Preview background" className="inline-flex rounded-lg border border-line p-0.5 text-xs">
          {BACKGROUNDS.map((b) => (
            <button
              key={b.key}
              type="button"
              aria-pressed={bg === b.key}
              onClick={() => setBg(b.key)}
              className={`rounded-md px-2.5 py-1 ${bg === b.key ? 'bg-ink text-white' : 'text-sub hover:text-ink'}`}
            >
              {b.label}
            </button>
          ))}
        </div>
        <div className="flex items-end gap-3" aria-label="Small size previews">
          {[32, 24, 16].map((s) => (
            <figure key={s} className="flex flex-col items-center gap-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" width={s} height={s} className="object-contain" style={{ width: s, height: s }} />
              <figcaption className="font-mono text-[10px] text-sub">{s}px</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
