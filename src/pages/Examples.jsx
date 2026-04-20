import React, { useState } from 'react';
import XudtLogoLoader from '../components/XudtLogoLoader';

const COMPONENT_SOURCE = `import React, { useEffect, useState } from "react";

// Session-level Set of symbols known to 404. String-only, tiny memory
// footprint, automatically cleared on reload. Successful logos are
// deduplicated by the browser's HTTP cache; we do not track them here.
const missingSymbols = new Set();

// Normalize symbols so varying casing / whitespace / leading dots from
// different data sources all resolve to the same logo URL and cache key.
const normalizeSymbol = (s) =>
  String(s || "")
    .trim()
    .replace(/^\\./, "")
    .replace(/[\\s/]+/g, "-")
    .toLowerCase();

const XudtLogoLoader = ({ symbol, sizeStyle }) => {
  const normalized = normalizeSymbol(symbol);
  const [loadFailed, setLoadFailed] = useState(() =>
    missingSymbols.has(normalized)
  );

  const handleLoadError = () => {
    missingSymbols.add(normalized);
    setLoadFailed(true);
  };

  useEffect(() => {
    setLoadFailed(missingSymbols.has(normalizeSymbol(symbol)));
  }, [symbol]);

  const initial = (symbol && symbol.charAt(0).toUpperCase()) || "?";

  return (
    <div>
      {loadFailed ? (
        <div className={\`\${sizeStyle || "h-40 w-40 text-[96px]"} rounded-full bg-[#378ACA] text-white font-bold flex items-center place-content-center\`}>
          {initial}
        </div>
      ) : (
        <img
          className={\`\${sizeStyle || "h-40 w-40"}\`}
          src={\`https://xudtlogos.cc/logos/\${normalized}-logo.png\`}
          alt={\`xudt-\${normalized}-logo\`}
          loading="lazy"
          decoding="async"
          onError={handleLoadError}
        />
      )}
    </div>
  );
};

export default XudtLogoLoader;`;

const BASIC_USAGE = `import XudtLogoLoader from "./XudtLogoLoader";

export default function TokenRow({ symbol, name }) {
  return (
    <div className="flex items-center gap-3">
      <XudtLogoLoader symbol={symbol} sizeStyle="h-10 w-10 text-lg" />
      <span>{name}</span>
    </div>
  );
}`;

const LIST_USAGE = `import XudtLogoLoader from "./XudtLogoLoader";

const tokens = [
  { symbol: "ckb", name: "CKB" },
  { symbol: "rusd", name: "RUSD" },
  { symbol: "seal", name: "Seal" },
];

export default function TokenGrid() {
  return (
    <div className="flex flex-wrap gap-4 place-content-center">
      {tokens.map((t) => (
        <div key={t.symbol} className="flex flex-col items-center gap-2">
          <XudtLogoLoader symbol={t.symbol} sizeStyle="h-16 w-16 text-2xl" />
          <span>{t.name}</span>
        </div>
      ))}
    </div>
  );
}`;

const DOB_USAGE = `import XudtLogoLoader from "./XudtLogoLoader";

// DOBs (Digital Objects) use the same component — pass the DOB cluster
// name as the symbol. Logos resolve from https://xudtlogos.cc/logos/{symbol}-logo.png.
export default function DobPreview() {
  return (
    <div className="flex flex-wrap gap-4 place-content-center">
      <XudtLogoLoader symbol="Nervape 3D" sizeStyle="h-20 w-20 text-3xl" />
      <XudtLogoLoader symbol="Nervape / B-Boat" sizeStyle="h-20 w-20 text-3xl" />
      <XudtLogoLoader symbol="拯救民主" sizeStyle="h-20 w-20 text-3xl" />
    </div>
  );
}`;

const CopyableCode = ({ code, language = 'jsx' }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // clipboard may be unavailable (insecure context); silently ignore
        }
    };

    return (
        <div className='relative group'>
            <button
                onClick={handleCopy}
                className='absolute top-2 right-2 text-xs px-2 py-1 rounded bg-color-main text-white opacity-80 hover:opacity-100 transition-opacity'
                aria-label='Copy code'
            >
                {copied ? 'Copied!' : 'Copy'}
            </button>
            <pre className='bg-[#1e1e1e] text-[#d4d4d4] text-xs md:text-sm rounded-md p-4 overflow-x-auto border border-[#333]'>
                <code className={`language-${language}`}>{code}</code>
            </pre>
        </div>
    );
};

const ExampleCard = ({ title, description, preview, code }) => (
    <div className='flex flex-col gap-4 border border-[#e5e5e5] rounded-lg p-5 bg-white'>
        <div className='flex flex-col gap-1'>
            <span className='title text-lg text-color-maintext'>{title}</span>
            {description && <span className='text-sm text-color-maintext opacity-75'>{description}</span>}
        </div>
        <div className='flex flex-col md:flex-row gap-5'>
            <div className='md:w-1/3 flex items-center justify-center p-4 rounded-md bg-[#f7f7f7] border border-[#eee] min-h-[160px]'>
                {preview}
            </div>
            <div className='md:w-2/3'>
                <CopyableCode code={code} />
            </div>
        </div>
    </div>
);

const Examples = () => {
    return (
        <div className='w-full flex flex-col py-14 gap-10 text-base text-color-maintext'>
            <div className='flex flex-col gap-2'>
                <span className='text-2xl title'>XudtLogoLoader Examples</span>
                <span className='text-sm opacity-75'>
                    Live previews paired with copy-paste-ready code. Drop the component into your DApp and start displaying xUDT / DOB logos from <span className='title'>xudtlogos.cc</span> in seconds.
                </span>
            </div>

            <div className='flex flex-col gap-3'>
                <span className='title text-lg'>1. The component</span>
                <span className='text-sm opacity-75'>
                    Create <code className='px-1 py-0.5 bg-[#f0f0f0] rounded'>XudtLogoLoader.jsx</code> and paste the following. Caching is handled inside the component — no extra modules or configuration required.
                </span>
                <CopyableCode code={COMPONENT_SOURCE} />
            </div>

            <div className='flex flex-col gap-5'>
                <span className='title text-lg'>2. Usage examples</span>

                <ExampleCard
                    title='Basic usage — display an xUDT logo'
                    description='Pass the token symbol as a prop. The component handles fallback automatically when a logo is missing.'
                    preview={
                        <div className='flex items-center gap-3'>
                            <XudtLogoLoader symbol='ckb' sizeStyle='h-10 w-10 text-lg' />
                            <span>CKB</span>
                        </div>
                    }
                    code={BASIC_USAGE}
                />

                <ExampleCard
                    title='Token list — render many logos in a grid'
                    description='Identical usage at scale. The browser HTTP cache deduplicates repeated URLs; no per-component setup.'
                    preview={
                        <div className='flex flex-wrap gap-4 place-content-center'>
                            {[
                                { symbol: 'ckb', name: 'CKB' },
                                { symbol: 'rusd', name: 'RUSD' },
                                { symbol: 'seal', name: 'Seal' },
                            ].map((t) => (
                                <div key={t.symbol} className='flex flex-col items-center gap-2'>
                                    <XudtLogoLoader symbol={t.symbol} sizeStyle='h-16 w-16 text-2xl' />
                                    <span className='text-sm'>{t.name}</span>
                                </div>
                            ))}
                        </div>
                    }
                    code={LIST_USAGE}
                />

                <ExampleCard
                    title='DOB (Digital Object) logos'
                    description='The same component works for DOB clusters. Pass the cluster identifier as the symbol prop.'
                    preview={
                        <div className='flex flex-wrap gap-4 place-content-center'>
                            <XudtLogoLoader symbol='Nervape 3D' sizeStyle='h-20 w-20 text-3xl' />
                            <XudtLogoLoader symbol="Nervape / B-Boat" sizeStyle="h-20 w-20 text-3xl" />
                            <XudtLogoLoader symbol="拯救民主" sizeStyle="h-20 w-20 text-3xl" />
                        </div>
                    }
                    code={DOB_USAGE}
                />

                <ExampleCard
                    title='Missing logo — graceful fallback'
                    description='Symbols without an uploaded logo render a colored initial-letter bubble. 404s are deduplicated for the rest of the session.'
                    preview={
                        <div className='flex items-center gap-3'>
                            <XudtLogoLoader symbol='definitely-not-a-real-token' sizeStyle='h-16 w-16 text-2xl' />
                            <span className='text-sm'>Fallback bubble</span>
                        </div>
                    }
                    code={`<XudtLogoLoader
  symbol="definitely-not-a-real-token"
  sizeStyle="h-16 w-16 text-2xl"
/>`}
                />
            </div>

            <div className='flex flex-col gap-3 text-sm opacity-75'>
                <span className='title text-base opacity-100'>Notes</span>
                <ul className='list-disc list-inside flex flex-col gap-1'>
                    <li>Styles in the examples use <span className='title'>Tailwind CSS</span>; adapt them to your project's styling solution.</li>
                    <li>Always use the canonical URL <code className='px-1 py-0.5 bg-[#f0f0f0] rounded'>https://xudtlogos.cc/logos/&#123;symbol&#125;-logo.png</code> — do not append cache-busting query strings.</li>
                    <li>See the <span className='title'>FAQ</span> page for the caching strategy behind the component.</li>
                </ul>
            </div>
        </div>
    );
};

export default Examples;
