/**
 * The single environment-dependent value in the system. TRD section 2.3.
 *
 * This is a constant rather than an environment variable on purpose: a
 * misconfigured environment cannot then produce a build with broken canonical
 * URLs, OG tags and sitemap entries. Everything derives from here.
 *
 * ---------------------------------------------------------------------------
 * MIGRATING TO A CUSTOM DOMAIN (PRD Q9)
 *
 * 1. Change SITE_URL below to the new origin, no trailing slash.
 * 2. Add `public/CNAME` containing the apex domain on one line, no scheme.
 * 3. Set the domain in Settings > Pages, wait for the certificate, then tick
 *    Enforce HTTPS.
 *
 * That is the whole migration. `basePath` never enters the picture, because
 * this deploys as a GitHub user site served from the domain root (ADR-007).
 * ---------------------------------------------------------------------------
 */

export const SITE_URL = 'https://farhanshehzad155.github.io';

/**
 * Whether search engines may index the site.
 *
 * ---------------------------------------------------------------------------
 * CURRENTLY FALSE ON PURPOSE.
 *
 * The content is structurally complete and factually incomplete: unresolved
 * TODO markers render as visible body text on the case study pages, employment
 * dates are unverified, and the Proglo permission (PRD Q1) is outstanding.
 *
 * An indexed page carrying "TODO(Q7): expand once the permitted level of detail
 * is confirmed" under Farhan's name would undercut the exact thing this site
 * exists to demonstrate. Worse, a search engine that indexes a draft may keep
 * serving it from cache well after the page is fixed.
 *
 * So the site deploys, is publicly reachable, and can be checked on real
 * devices — but asks not to be indexed until the content is finished.
 *
 * FLIP THIS TO `true` WHEN:
 *   1. `npm run validate:strict` passes with zero warnings, and
 *   2. the launch checklist in TRD section 15.3 is complete.
 *
 * Then redeploy and submit the sitemap to Google Search Console.
 * ---------------------------------------------------------------------------
 */
export const SITE_INDEXABLE = false;

/**
 * Absolute URL for a route path.
 *
 * Trailing slashes are preserved deliberately: `trailingSlash: true` means the
 * CDN serves `/work/`, and a canonical URL that disagrees with what is served
 * is a self-inflicted duplicate-content problem (ADR-008, TRD section 8.2).
 */
export function absoluteUrl(path: string): string {
  if (path === '/') return `${SITE_URL}/`;
  const withLeading = path.startsWith('/') ? path : `/${path}`;
  const withTrailing = withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
  return `${SITE_URL}${withTrailing}`;
}

/** Navigation, in the order PRD section 7.2 specifies. */
export const NAV_LINKS: readonly { label: string; href: string }[] = [
  { label: 'Work', href: '/work/' },
  { label: 'About', href: '/about/' },
  { label: 'Résumé', href: '/resume/' },
  { label: 'Contact', href: '/contact/' },
] as const;

/** Domain filter labels for the work index (FR-W2). */
export const DOMAIN_LABELS: Record<string, string> = {
  ecommerce: 'E-commerce',
  recruitment: 'Recruitment / HR tech',
  'content-marketing': 'Content & marketing',
  platform: 'Platform / full-stack',
};
