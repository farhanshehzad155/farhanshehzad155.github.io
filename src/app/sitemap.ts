/**
 * FR-SEO8. Native Next.js metadata route; exports correctly under
 * `output: 'export'`.
 *
 * Routes are enumerated from the same content modules the pages use, so adding
 * a case study puts it in the sitemap without a second edit (NFR-13).
 *
 * `lastmod` comes from git via `src/generated/build-meta.json` rather than from
 * build time, so re-running a build does not falsely bump every page's date.
 */

import type { MetadataRoute } from 'next';

import buildMeta from '@/generated/build-meta.json';
import { caseStudies } from '@/content/case-studies/records';
import { absoluteUrl } from '@/lib/constants';

export const dynamic = 'force-static';

const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: '/', priority: 1 },
  { path: '/work/', priority: 0.9 },
  { path: '/about/', priority: 0.8 },
  { path: '/resume/', priority: 0.8 },
  { path: '/contact/', priority: 0.7 },
  { path: '/stack/', priority: 0.5 },
  { path: '/privacy/', priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const routeDates = buildMeta.routes as Record<string, string>;
  const fallback = buildMeta.lastCommit;

  const staticEntries = STATIC_ROUTES.map(({ path, priority }) => ({
    url: absoluteUrl(path),
    lastModified: routeDates[path] ?? fallback,
    priority,
  }));

  const caseStudyEntries = caseStudies.map((study) => {
    const path = `/work/${study.slug}/`;
    return {
      url: absoluteUrl(path),
      lastModified: routeDates[path] ?? fallback,
      // The flagship carries the credibility load, so it outranks the rest.
      priority: study.featured ? 0.9 : 0.7,
    };
  });

  return [...staticEntries, ...caseStudyEntries];
}
