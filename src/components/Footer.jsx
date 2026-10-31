import Link from 'next/link';
import { REPO_URL } from '@/lib/links';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-wash">
      <div className="container-page flex flex-col gap-6 py-8 text-sm text-sub md:flex-row md:items-start md:justify-between">
        <div className="flex max-w-md flex-col gap-2">
          <span className="font-bold text-ink">xudtlogos</span>
          <p>Open source logo registry for xUDT tokens and DOB collections on CKB. Built and maintained by the CKBFans community.</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-2 sm:grid-cols-3">
          <Link href="/" className="hover:text-ink">All logos</Link>
          <Link href="/tools" className="hover:text-ink">Tools</Link>
          <Link href="/examples" className="hover:text-ink">Examples</Link>
          <Link href="/faq" className="hover:text-ink">FAQ</Link>
          <Link href="/about" className="hover:text-ink">About</Link>
          <a href="/llms.txt" className="hover:text-ink">llms.txt</a>
          <a href="/tokens/token_list.json" className="hover:text-ink">token_list.json</a>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="hover:text-ink">GitHub ↗</a>
        </nav>
      </div>
      <div className="container-page border-t border-line py-4 text-xs text-sub">
        Copyright © 2024–{new Date().getFullYear()} xudtlogos.cc · MIT License
      </div>
    </footer>
  );
}
