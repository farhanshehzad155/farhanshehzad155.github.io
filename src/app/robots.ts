/** FR-SEO8. */

import type { MetadataRoute } from 'next';

import { SITE_INDEXABLE, SITE_URL, absoluteUrl } from '@/lib/constants';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  // While the content is unfinished, ask crawlers to stay away entirely. The
  // sitemap is withheld too: pointing a crawler at a list of draft pages while
  // telling it not to index them is a mixed signal. See SITE_INDEXABLE.
  if (!SITE_INDEXABLE) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
      host: SITE_URL,
    };
  }

  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: absoluteUrl('/sitemap.xml').replace(/\/$/, ''),
    host: SITE_URL,
  };
}
