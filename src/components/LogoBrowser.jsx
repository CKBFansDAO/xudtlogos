'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import LogoImg from './LogoImg';
import CopyButton from './CopyButton';
import { pagePath, pngUrl, SUBMIT_URL } from '@/lib/links';

const TYPES = [
  { key: 'all', label: 'All' },
  { key: 'xudt', label: 'xUDT tokens' },
  { key: 'other', label: 'DOB & others' },
];

const SORTS = [
  { key: 'featured', label: 'Featured' },
  { key: 'az', label: 'Name A–Z' },
];

function readParams() {
  if (typeof window === 'undefined') return {};
  const p = new URLSearchParams(window.location.search);
  return { q: p.get('q') || '', type: p.get('type') || 'all', svg: p.get('svg') === '1', sort: p.get('sort') || 'featured' };
}

function FilterButton({ active, onClick, children, count }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full items-center justify-between gap-3 whitespace-nowrap rounded-md px-2.5 py-1.5 text-left text-sm transition-colors ${
        active ? 'bg-wash font-semibold text-brand' : 'text-ink hover:bg-wash'
      }`}
    >
      <span>{children}</span>
      {count != null && <span className="font-mono text-xs font-normal text-sub">{count}</span>}
    </button>
  );
}

export default function LogoBrowser({ logos }) {
  const [q, setQ] = useState('');
  const [type, setType] = useState('all');
  const [svgOnly, setSvgOnly] = useState(false);
  const [sort, setSort] = useState('featured');
  const inputRef = useRef(null);
  const ready = useRef(false);

  // Restore filters from the URL so searches can be shared and survive "back".
  useEffect(() => {
    const p = readParams();
    setQ(p.q);
    if (TYPES.some((t) => t.key === p.type)) setType(p.type);
    setSvgOnly(p.svg);
    if (SORTS.some((s) => s.key === p.sort)) setSort(p.sort);
    ready.current = true;
  }, []);

  useEffect(() => {
    if (!ready.current) return;
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (type !== 'all') p.set('type', type);
    if (svgOnly) p.set('svg', '1');
    if (sort !== 'featured') p.set('sort', sort);
    const qs = p.toString();
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
  }, [q, type, svgOnly, sort]);

  // "/" or Cmd/Ctrl+K focuses search.
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;
      if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const counts = useMemo(
    () => ({
      all: logos.length,
      xudt: logos.filter((l) => l.type === 'xudt').length,
      other: logos.filter((l) => l.type === 'other').length,
      svg: logos.filter((l) => l.hasSvg).length,
    }),
    [logos]
  );

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = logos.filter(
      (l) =>
        (type === 'all' || l.type === type) &&
        (!svgOnly || l.hasSvg) &&
        (!needle ||
          l.name.toLowerCase().includes(needle) ||
          l.slug.toLowerCase().includes(needle) ||
          (l.symbol || '').toLowerCase().includes(needle))
    );
    if (sort === 'az') return [...list].sort((a, b) => a.name.localeCompare(b.name, 'en'));
    return list;
  }, [logos, q, type, svgOnly, sort]);

  return (
    <div className="grid border-t border-line md:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="flex flex-wrap gap-x-8 gap-y-4 border-b border-line px-4 py-5 sm:px-6 md:flex-col md:flex-nowrap md:border-b-0 md:border-r md:px-0 md:py-6 md:pr-5">
        <div className="min-w-[160px] flex-1 md:flex-none">
          <div className="eyebrow mb-2 px-2.5">Type</div>
          <div className="flex flex-col gap-0.5">
            {TYPES.map((t) => (
              <FilterButton key={t.key} active={type === t.key} onClick={() => setType(t.key)} count={counts[t.key]}>
                {t.label}
              </FilterButton>
            ))}
          </div>
        </div>
        <div className="min-w-[160px] flex-1 md:flex-none">
          <div className="eyebrow mb-2 px-2.5">Format</div>
          <FilterButton active={svgOnly} onClick={() => setSvgOnly((v) => !v)} count={counts.svg}>
            SVG available
          </FilterButton>
        </div>
        <div className="min-w-[160px] flex-1 md:flex-none">
          <div className="eyebrow mb-2 px-2.5">Sort</div>
          <div className="flex flex-col gap-0.5">
            {SORTS.map((s) => (
              <FilterButton key={s.key} active={sort === s.key} onClick={() => setSort(s.key)}>
                {s.label}
              </FilterButton>
            ))}
          </div>
        </div>
      </aside>

      <div className="min-w-0 py-5 md:py-6 md:pl-6">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <label htmlFor="logo-search" className="sr-only">Search logos</label>
          <div className="relative min-w-[200px] flex-1">
            <svg aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sub" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="7" cy="7" r="5" />
              <path d="m11 11 4 4" />
            </svg>
            <input
              ref={inputRef}
              id="logo-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && setQ('')}
              placeholder="Search by name or symbol, e.g. RUSD, Nervape"
              autoComplete="off"
              className="w-full rounded-lg border border-line bg-white py-2.5 pl-9 pr-12 text-sm text-ink placeholder:text-sub focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
            <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-b-2 border-line px-1.5 text-[11px] text-sub sm:block">/</kbd>
          </div>
          <span className="font-mono text-xs text-sub" aria-live="polite">
            {results.length} / {logos.length} logos
          </span>
        </div>

        {results.length ? (
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {results.map((l, i) => (
              <li key={l.slug} className="group relative bg-white">
                <Link
                  href={pagePath(l.slug)}
                  className="flex h-full flex-col items-center gap-2.5 px-3 pb-4 pt-6 text-center transition-colors hover:bg-wash focus-visible:bg-wash focus-visible:outline-none"
                >
                  <LogoImg slug={l.slug} preview={l.preview} alt={`${l.name} logo`} className="h-14 w-14 object-contain" eager={i < 15} />
                  <span className="text-sm font-semibold leading-tight">{l.name}</span>
                  <span className="max-w-full truncate font-mono text-[11px] text-sub">{l.slug}</span>
                </Link>
                <span className={`pointer-events-none absolute left-2 top-2 font-mono text-[10px] ${l.hasSvg ? 'text-brand' : 'text-sub'}`}>
                  {l.hasSvg ? 'PNG+SVG' : 'PNG'}
                </span>
                <CopyButton
                  value={pngUrl(l.slug)}
                  label="Copy URL"
                  title={`Copy ${pngUrl(l.slug)}`}
                  className="absolute right-2 top-2 px-1.5 py-0.5 text-[10px] opacity-0 focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:hidden"
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
            <p className="font-semibold">No logo matches “{q}”.</p>
            <p className="max-w-md text-sm text-sub">
              If the asset is yours, submit its logo with the form. It takes a minute and needs no git.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <button type="button" onClick={() => { setQ(''); setType('all'); setSvgOnly(false); }} className="btn-ghost">
                Clear filters
              </button>
              <a href={SUBMIT_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">Submit a logo</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
