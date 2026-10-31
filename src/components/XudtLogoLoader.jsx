'use client';

// Same component that the Examples page publishes for DApps (see
// src/app/examples), using site-relative URLs because it runs on xudtlogos.cc.
import { useEffect, useState } from 'react';
import { normalizeSymbol } from '@/lib/links';

const missingSymbols = new Set();

export default function XudtLogoLoader({ symbol, sizeStyle }) {
  const normalized = normalizeSymbol(symbol);
  const [loadFailed, setLoadFailed] = useState(() => missingSymbols.has(normalized));

  useEffect(() => {
    setLoadFailed(missingSymbols.has(normalizeSymbol(symbol)));
  }, [symbol]);

  const handleLoadError = () => {
    missingSymbols.add(normalized);
    setLoadFailed(true);
  };

  const initial = (symbol && symbol.charAt(0).toUpperCase()) || '?';

  return (
    <div>
      {loadFailed ? (
        <div className={`${sizeStyle || 'h-40 w-40 text-[96px]'} flex items-center justify-center rounded-full bg-brand font-bold text-white`}>
          {initial}
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={sizeStyle || 'h-40 w-40'}
          src={`/logos/${normalized}-logo.png`}
          alt={`xudt-${normalized}-logo`}
          loading="lazy"
          decoding="async"
          onError={handleLoadError}
        />
      )}
    </div>
  );
}
