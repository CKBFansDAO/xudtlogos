import Link from 'next/link';
import { notFound } from 'next/navigation';
import LogoStage from '@/components/LogoStage';
import LogoImg from '@/components/LogoImg';
import CodeBlock from '@/components/CodeBlock';
import CopyButton from '@/components/CopyButton';
import { getAllLogos, getLogo, pagePath, pngUrl, svgUrl, SPEC } from '@/lib/logos';
import { DONATION_ADDRESS, FORK_URL, ISSUES_URL } from '@/lib/links';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllLogos().map((l) => ({ xudt: l.slug }));
}

function decode(v) {
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

const displayName = (l) => (l.symbol && l.symbol !== l.name ? `${l.name} (${l.symbol})` : l.name);

export async function generateMetadata({ params }) {
  const { xudt } = await params;
  const logo = getLogo(decode(xudt));
  if (!logo) return {};
  const title = `${displayName(logo)} PNG and SVG Logo Download`;
  const description = `Download the ${displayName(logo)} logo as a transparent PNG${
    logo.hasSvg ? ' and vector SVG' : ''
  }. Permanent URL: ${pngUrl(logo.slug)}`;
  return {
    title,
    description,
    alternates: { canonical: pagePath(logo.slug) },
    openGraph: { title, description, images: logo.hasPng ? [{ url: pngUrl(logo.slug) }] : [] },
  };
}

function FileCard({ kind, url, fileName, details, ok }) {
  const path = url.replace('https://xudtlogos.cc', '');
  return (
    <div className="card flex min-w-0 flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold">{kind === 'png' ? 'PNG · raster, transparent' : 'SVG · vector'}</div>
          <div className="mt-0.5 font-mono text-xs text-sub">{details}</div>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${ok ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>
          {ok ? 'Meets spec' : 'Check spec'}
        </span>
      </div>
      <div className="flex min-w-0 items-center gap-2 rounded-md bg-wash px-2.5 py-2">
        <code className="min-w-0 flex-1 truncate font-mono text-xs" title={url}>{url}</code>
        <CopyButton value={url} label="Copy URL" />
      </div>
      <div className="flex flex-wrap gap-2">
        <a href={path} download={fileName} className="btn-primary">Download {kind.toUpperCase()}</a>
        <a href={path} target="_blank" rel="noopener noreferrer" className="btn-ghost">Open ↗</a>
      </div>
    </div>
  );
}

function MetaRow({ label, value, mono = true }) {
  if (value == null || value === '') return null;
  return (
    <div className="grid grid-cols-1 gap-1 border-t border-line py-2.5 first:border-t-0 sm:grid-cols-[140px_minmax(0,1fr)_auto] sm:items-center sm:gap-3">
      <dt className="text-xs text-sub">{label}</dt>
      <dd className={`min-w-0 break-all text-sm ${mono ? 'font-mono text-[12.5px]' : ''}`}>{String(value)}</dd>
      {mono && String(value).startsWith('0x') ? <CopyButton value={String(value)} /> : <span />}
    </div>
  );
}

export default async function LogoPage({ params }) {
  const { xudt } = await params;
  const logo = getLogo(decode(xudt));
  if (!logo) notFound();

  const all = getAllLogos();
  const idx = all.findIndex((l) => l.slug === logo.slug);
  const related = [...all.slice(idx + 1), ...all.slice(0, idx)].filter((l) => l.type === logo.type).slice(0, 6);
  const pngIssues = logo.issues.filter((i) => !i.startsWith('SVG'));
  const svgIssues = logo.issues.filter((i) => i.startsWith('SVG'));
  const meta = logo.meta;
  const links = Object.entries(meta?.extensions?.links || {}).filter(([, v]) => v);

  const reactSnippet = `<XudtLogoLoader symbol="${logo.slug}" sizeStyle="h-10 w-10 text-lg" />`;
  const htmlSnippet = `<img src="${pngUrl(logo.slug)}"\n     alt="${logo.name} logo" width="40" height="40" loading="lazy" />`;

  return (
    <div className="container-page py-8 md:py-10">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-sub">
        <Link href="/" className="hover:text-brand">All logos</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{logo.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-12">
        <LogoStage src={`/logos/${logo.slug}-logo.${logo.hasPng ? 'png' : 'svg'}`} alt={`${logo.name} logo`} />

        <div className="flex min-w-0 flex-col gap-6">
          <div>
            <div className="eyebrow mb-2">{logo.type === 'xudt' ? 'xUDT token' : 'DOB / other asset'}</div>
            <h1 className="text-[clamp(24px,3vw,34px)] font-bold leading-tight tracking-tight">
              {displayName(logo)} PNG and SVG Logo Download
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {logo.hasPng && (
              <FileCard
                kind="png"
                url={pngUrl(logo.slug)}
                fileName={`xudt-${logo.slug}-logo.png`}
                details={`${logo.width} × ${logo.height}px · ${logo.pngKb} KB`}
                ok={pngIssues.length === 0}
              />
            )}
            {logo.hasSvg ? (
              <FileCard
                kind="svg"
                url={svgUrl(logo.slug)}
                fileName={`xudt-${logo.slug}-logo.svg`}
                details={`Vector · ${logo.svgKb} KB`}
                ok={svgIssues.length === 0}
              />
            ) : (
              <div className="card flex flex-col justify-center gap-2 border-dashed p-4 text-sm text-sub">
                <span className="font-semibold text-ink">No SVG yet</span>
                <span>Have a vector version? Add <code className="inline-code">{logo.slug}-logo.svg</code> with a pull request.</span>
              </div>
            )}
          </div>

          <div className={`rounded-lg border px-4 py-3 text-sm ${logo.issues.length ? 'border-amber-200 bg-amber-50/60' : logo.notes.length ? 'border-line bg-wash' : 'border-emerald-200 bg-emerald-50/60'}`}>
            {logo.issues.length === 0 && logo.notes.length === 0 && (
              <span>✓ Meets the <a className="font-semibold text-brand" href="https://github.com/CKBFansDAO/xudtlogos#logo-specifications" target="_blank" rel="noopener noreferrer">logo specification</a> ({SPEC.minPx}–{SPEC.maxPx}px square, PNG ≤ {SPEC.maxPngKb} KB).</span>
            )}
            {(logo.issues.length > 0 || logo.notes.length > 0) && (
              <div className="flex flex-col gap-1">
                <span className="font-semibold">Specification check</span>
                <ul className="list-inside list-disc text-sub">
                  {logo.issues.map((i) => <li key={i}>{i}</li>)}
                  {logo.notes.map((i) => <li key={i}>{i}</li>)}
                </ul>
                <span className="text-xs text-sub">The logo still works at its URL. Owners can send an optimised file with a pull request.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2" aria-labelledby="use-heading">
        <div className="lg:col-span-2">
          <h2 id="use-heading" className="text-xl font-bold">Use this logo</h2>
          <p className="mt-1 text-sm text-sub">
            Always use the canonical URL without query strings so browsers can cache it. See <Link href="/examples" className="font-semibold text-brand">Examples</Link> for the full component.
          </p>
        </div>
        <CodeBlock label="React (XudtLogoLoader)" code={reactSnippet} />
        <CodeBlock label="HTML" code={htmlSnippet} />
      </section>

      {meta && (
        <section className="mt-12" aria-labelledby="meta-heading">
          <h2 id="meta-heading" className="text-xl font-bold">Token information</h2>
          <p className="mt-1 text-sm text-sub">From <a href="/tokens/token_list.json" className="font-semibold text-brand">token_list.json</a>.</p>
          <dl className="card mt-4 px-4 py-1">
            <MetaRow label="Name" value={meta.name} mono={false} />
            <MetaRow label="Symbol" value={meta.symbol} mono={false} />
            <MetaRow label="Decimals" value={meta.decimals} />
            <MetaRow label="Type hash" value={meta.typeHash} />
            <MetaRow label="Code hash" value={meta.typeScript?.codeHash} />
            <MetaRow label="Hash type" value={meta.typeScript?.hashType} />
            <MetaRow label="Args" value={meta.typeScript?.args} />
            <MetaRow label="Cell dep tx" value={meta.typeCellDep?.outPoint?.txHash} />
          </dl>
          {links.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {links.map(([k, v]) => (
                <a key={k} href={v} target="_blank" rel="noopener noreferrer" className="btn-ghost px-3 py-1.5 text-xs capitalize">{k} ↗</a>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="mt-12 grid gap-6 rounded-xl bg-wash p-5 md:grid-cols-2 md:p-6" aria-labelledby="contrib-heading">
        <div className="flex flex-col gap-3">
          <h2 id="contrib-heading" className="text-lg font-bold">Update or report this logo</h2>
          <p className="text-sm leading-relaxed text-sub">
            Logos are added and changed through pull requests on GitHub. If you own this brand and the logo is wrong, open a pull request with the new file, or an issue if you cannot.
          </p>
          <div className="flex flex-wrap gap-2">
            <a className="btn-primary" href={FORK_URL} target="_blank" rel="noopener noreferrer">Fork &amp; submit a PR</a>
            <a className="btn-ghost" href={ISSUES_URL} target="_blank" rel="noopener noreferrer">Open an issue</a>
            <Link className="btn-ghost" href="/tools">Open Tools</Link>
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-3">
          <h2 className="text-lg font-bold">Support the project</h2>
          <p className="text-sm text-sub">Donations in CKB help keep xudtlogos running.</p>
          <div className="flex min-w-0 items-center gap-2 rounded-md border border-line bg-white px-2.5 py-2">
            <code className="min-w-0 flex-1 break-all font-mono text-[11.5px]">{DONATION_ADDRESS}</code>
            <CopyButton value={DONATION_ADDRESS} label="Copy" />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-12" aria-labelledby="more-heading">
          <h2 id="more-heading" className="mb-4 text-lg font-bold">More {logo.type === 'xudt' ? 'xUDT' : 'DOB'} logos</h2>
          <ul className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-6">
            {related.map((l) => (
              <li key={l.slug} className="bg-white">
                <Link href={pagePath(l.slug)} className="flex flex-col items-center gap-2 px-2 py-4 text-center text-xs font-semibold hover:bg-wash">
                  <LogoImg slug={l.slug} preview={l.preview} className="h-10 w-10 object-contain" />
                  <span className="line-clamp-2">{l.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
