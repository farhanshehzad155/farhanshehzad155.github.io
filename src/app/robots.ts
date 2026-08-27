/** FR-SEO8. */

import type { MetadataRoute } from 'next';

import { SITE_URL, absoluteUrl } from '@/lib/constants';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: absoluteUrl('/sitemap.xml').replace(/\/$/, ''),
    host: SITE_URL,
  };
}
