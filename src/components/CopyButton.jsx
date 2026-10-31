'use client';

import { useState } from 'react';

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export default function CopyButton({ value, label = 'Copy', copiedLabel = 'Copied', className = '', title }) {
  const [state, setState] = useState('idle');
  const onClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!value) return;
    const ok = await copyText(value);
    setState(ok ? 'copied' : 'failed');
    setTimeout(() => setState('idle'), 1500);
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!value}
      title={title || value}
      aria-live="polite"
      className={`inline-flex items-center gap-1 rounded-md border border-line bg-white px-2 py-1 text-xs font-medium text-sub transition-colors hover:border-brand hover:text-brand disabled:opacity-40 ${className}`}
    >
      {state === 'copied' ? `✓ ${copiedLabel}` : state === 'failed' ? 'Copy failed' : label}
    </button>
  );
}
