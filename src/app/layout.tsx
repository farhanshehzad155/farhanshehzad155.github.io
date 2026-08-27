/**
 * Root layout. FR-G2, FR-G3, FR-G4, FR-AC3, FR-P3.
 *
 * Fonts come through `next/font/google`, which downloads them at BUILD time and
 * serves them from this origin. There is no runtime request to a third-party
 * font host, so PRD section 10.3's objection to a font CDN does not apply.
 * See ADR-006 — the package name is misleading and the ADR exists to say so.
 */

import type { Metadata, Viewport } from 'next';
import { Archivo, JetBrains_Mono, Public_Sans } from 'next/font/google';

import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { ThemeScript } from '@/components/ThemeScript';
import { siteConfig } from '@/content/site';
import { SITE_URL } from '@/lib/constants';
import { PAGE_DESCRIPTIONS, buildMetadata } from '@/lib/seo';

import '@/styles/globals.css';

const display = Archivo({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
});

const body = Public_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  preload: true,
});

// Not preloaded: the manifest strip sits below the LCP element, so the mono
// face is not on the critical path (TRD section 10.3).
const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...buildMetadata({
    description: PAGE_DESCRIPTIONS.home,
    path: '/',
    kind: 'home',
  }),
  authors: [{ name: siteConfig.name, url: SITE_URL }],
  creator: siteConfig.name,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

/**
 * FR-P3. GitHub Pages cannot set response headers, so the policy is delivered
 * by meta tag.
 *
 * Known limitations, recorded rather than glossed (TRD section 13.2):
 *   - `frame-ancestors` is ignored in a meta-delivered CSP, so clickjacking
 *     protection is unavailable on this host. Accepted: the site has no
 *     authenticated state and no destructive actions, so framing achieves
 *     nothing.
 *   - `style-src 'unsafe-inline'` is required because Next.js injects inline
 *     styles that cannot practically be hashed across a build.
 *   - `script-src 'unsafe-inline'` is required for the same reason: Next.js
 *     emits inline bootstrap and flight-payload scripts on every page, so a
 *     hash-only policy would break the site rather than harden it. The TRD
 *     originally specified hashing only the theme script; that is achievable
 *     for the theme script alone but not for the framework's, so the honest
 *     policy is the one written here.
 *
 * The value of this CSP is therefore `default-src 'self'` plus `object-src
 * 'none'` and `base-uri 'self'` — real but modest. It is not XSS protection,
 * and it should not be described as such.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        <meta httpEquiv="Content-Security-Policy" content={CSP} />
        {/* Must run before first paint, or the wrong theme flashes (FR-G4). */}
        <ThemeScript />
      </head>
      <body>
        {/* FR-G3: first focusable element on every page. */}
        <a href="#main" className="skip-link">
          Skip to content
        </a>

        <SiteHeader />

        {/* FR-AC3: landmark regions. */}
        <main id="main" tabIndex={-1}>
          {children}
        </main>

        <SiteFooter />
      </body>
    </html>
  );
}
