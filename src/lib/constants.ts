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
 * Turned on 28 Aug 2026.
 *
 * It was false while unresolved TODO markers rendered as visible body text on
 * the case study pages — an indexed page reading "TODO(Q7): expand once the
 * permitted level of detail is confirmed" under Farhan's name would have
 * undercut the exact thing this site exists to demonstrate, and a search engine
 * that caches a draft keeps serving it long after the page is fixed.
 *
 * That is now resolved: every page carries real content, dates and titles are
 * confirmed, and no placeholder text is rendered anywhere.
 *
 * `npm run validate:strict` still reports warnings, and none of them are
 * reasons to stay out of the index. They are quality gaps rather than
 * inaccuracies: six case studies have no "what did not work" section, and
 * three role bullets carry a number without its measured basis (rule CV-15).
 * The second of those is worth closing soon — see PRD Q4, Q5 and Q6.
 *
 * Set this back to false if the site ever regresses to placeholder content.
 * ---------------------------------------------------------------------------
 */
export const SITE_INDEXABLE = true;

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
