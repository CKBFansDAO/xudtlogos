import Script from 'next/script';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-sans/700.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './globals.css';
import TopNav from '@/components/TopNav';
import Footer from '@/components/Footer';
import { SITE_URL } from '@/lib/logos';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'xUDT Logos — High quality CKB xUDT & DOB logos',
    template: '%s | xUDT Logos',
  },
  description:
    'Download transparent PNG and vector SVG logos for xUDT tokens and DOB collections on CKB. One stable URL per logo for DApps, wallets and explorers.',
  icons: { icon: '/favicon.ico', apple: '/logo192.png' },
  manifest: '/manifest.json',
  openGraph: { siteName: 'xUDT Logos', type: 'website' },
  twitter: { card: 'summary' },
};

export const viewport = { themeColor: '#0F1B2D' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-white focus:px-3 focus:py-2">
          Skip to content
        </a>
        <TopNav />
        <main id="main" className="grow">{children}</main>
        <Footer />
        <Script
          src="https://context7.com/widget.js"
          data-library="/ckbfansdao/xudtlogos"
          data-position="bottom-right"
          data-color="#2F7FC1"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
