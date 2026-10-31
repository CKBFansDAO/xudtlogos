import LogoBrowser from '@/components/LogoBrowser';
import { getAllLogos, toCard } from '@/lib/logos';

export default function HomePage() {
  const logos = getAllLogos();
  const cards = logos.map(toCard);
  const xudtCount = logos.filter((l) => l.type === 'xudt').length;
  const svgCount = logos.filter((l) => l.hasSvg).length;

  return (
    <>
      <section className="bg-gradient-to-b from-wash to-white">
        <div className="container-page grid items-end gap-8 py-10 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:py-14">
          <div>
            <h1 className="mb-3 text-[clamp(28px,4vw,42px)] font-bold leading-[1.08] tracking-tight">
              High quality xUDT &amp; DOB logos for CKB
            </h1>
            <p className="max-w-[54ch] text-[15px] leading-relaxed text-sub">
              Download transparent PNG and vector SVG logo files. Every logo has one permanent URL you can use in any DApp,
              wallet or explorer.
            </p>
            <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm">
              <div><dt className="eyebrow">Logos</dt><dd className="text-2xl font-bold tabular-nums">{logos.length}</dd></div>
              <div><dt className="eyebrow">xUDT tokens</dt><dd className="text-2xl font-bold tabular-nums">{xudtCount}</dd></div>
              <div><dt className="eyebrow">With SVG</dt><dd className="text-2xl font-bold tabular-nums">{svgCount}</dd></div>
            </dl>
          </div>
          <pre className="overflow-x-auto rounded-xl bg-ink p-4 text-[12.5px] leading-[1.8] text-[#CFE3F5]" aria-label="Logo URL format">
            <span className="text-[#6C8199]"># Every logo has a permanent URL</span>{'\n'}
            GET https://xudtlogos.cc/logos/<span className="text-[#7FC4FF]">{'{symbol}'}</span>-logo.png{'\n'}
            GET https://xudtlogos.cc/logos/<span className="text-[#7FC4FF]">{'{symbol}'}</span>-logo.svg{'\n'}
            <span className="text-[#6C8199]"># Token metadata for wallets and DApps</span>{'\n'}
            GET https://xudtlogos.cc/tokens/token_list.json
          </pre>
        </div>
      </section>
      <section className="container-page" aria-label="All logos">
        <LogoBrowser logos={cards} />
      </section>
    </>
  );
}
