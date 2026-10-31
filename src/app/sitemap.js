import { getAllLogos, pagePath, SITE_URL } from '@/lib/logos';

export const dynamic = 'force-static';

export default function sitemap() {
  const pages = ['', '/tools', '/examples', '/faq', '/about'].map((p) => ({ url: `${SITE_URL}${p}` }));
  const logos = getAllLogos().map((l) => ({ url: `${SITE_URL}${pagePath(l.slug)}` }));
  return [...pages, ...logos];
}
