'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { REPO_URL } from '@/lib/links';

const NAV = [
  { name: 'Logos', href: '/' },
  { name: 'Tools', href: '/tools' },
  { name: 'Examples', href: '/examples' },
  { name: 'FAQ', href: '/faq' },
  { name: 'About', href: '/about' },
];

export default function TopNav() {
  const pathname = usePathname() || '/';
  const isActive = (href) =>
    href === '/' ? !['/tools', '/examples', '/faq', '/about'].some((p) => pathname.startsWith(p)) : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
      <div className="container-page flex h-14 items-center gap-4">
        <Link href="/" className="flex items-center gap-2 text-[17px] font-bold tracking-tight text-ink">
          <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-md bg-brand font-mono text-[11px] font-medium text-white">xu</span>
          xudtlogos
        </Link>
        <nav aria-label="Main" className="-mr-2 ml-auto flex items-center gap-1 overflow-x-auto text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`whitespace-nowrap rounded-md px-2.5 py-1.5 transition-colors ${
                isActive(item.href) ? 'bg-wash font-semibold text-brand' : 'text-sub hover:text-ink'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 hidden whitespace-nowrap rounded-md border border-line px-2.5 py-1 font-mono text-xs text-sub hover:border-brand hover:text-brand sm:inline-flex"
          >
            GitHub ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
