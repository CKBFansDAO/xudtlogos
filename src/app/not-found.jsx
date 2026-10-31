import Link from 'next/link';

export const metadata = { title: 'Logo not found' };

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
      <span className="font-mono text-sm text-sub">404</span>
      <h1 className="text-3xl font-bold">This logo is not here</h1>
      <p className="max-w-md text-sub">
        Search the full list, or use the Tools page to check the canonical file name for an asset.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Link href="/" className="btn-primary">Browse all logos</Link>
        <Link href="/tools" className="btn-ghost">Open Tools</Link>
      </div>
    </div>
  );
}
