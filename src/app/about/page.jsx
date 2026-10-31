import Link from 'next/link';
import { REPO_URL } from '@/lib/links';

export const metadata = {
  title: 'About',
  description: 'xudtlogos is an open source, community maintained logo registry for xUDT assets and DOB collections on CKB.',
};

const SOLUTION = [
  ['Unified logo management', 'One place where xUDT project owners upload and manage their token logos according to a shared specification.'],
  ['Open source collaboration', 'Community members and project owners add and maintain logos through public pull requests.'],
  ['Automatic deployment', 'Once a logo is approved and merged, it is deployed to xudtlogos.cc and available to every DApp.'],
  ['Standardised files', 'A specification for size, format and quality keeps logos consistent across wallets and explorers.'],
];

const OUTCOMES = [
  'A single logo source for xUDT assets on CKB, making life easier for DApp developers and users.',
  'Closer cooperation between xUDT project owners and DApp developers, helping the CKB ecosystem grow.',
];

export default function AboutPage() {
  return (
    <div className="container-page grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex min-w-0 max-w-[68ch] flex-col gap-10">
        <header>
          <h1 className="mb-4 text-3xl font-bold tracking-tight">About xUDT Logos</h1>
          <p className="text-[16px] leading-relaxed text-sub">
            As more xUDT assets launch on CKB, every wallet, explorer and DApp needs to show their logos. There was no shared place to
            manage them, so each team collected logos on its own. xudtlogos is an open source project that gives the ecosystem one
            reliable source of logo files.
          </p>
        </header>
        <section>
          <h2 className="mb-4 text-lg font-bold">Our solution</h2>
          <dl className="grid gap-4 sm:grid-cols-2">
            {SOLUTION.map(([t, d]) => (
              <div key={t} className="card p-4">
                <dt className="mb-1 font-semibold">{t}</dt>
                <dd className="text-sm leading-relaxed text-sub">{d}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section>
          <h2 className="mb-4 text-lg font-bold">Expected outcomes</h2>
          <ul className="flex list-disc flex-col gap-2 pl-5 leading-relaxed text-sub">
            {OUTCOMES.map((o) => <li key={o}>{o}</li>)}
          </ul>
        </section>
        <p className="font-semibold">
          We look forward to the community&apos;s support and feedback. Let&apos;s work together for a healthy, thriving CKB ecosystem.
        </p>
      </div>
      <aside className="flex flex-col gap-3 self-start rounded-xl bg-wash p-5 text-sm">
        <span className="font-semibold">Get involved</span>
        <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">View on GitHub</a>
        <Link href="/tools" className="btn-ghost">Submit a logo</Link>
        <Link href="/faq" className="btn-ghost">Read the FAQ</Link>
      </aside>
    </div>
  );
}
