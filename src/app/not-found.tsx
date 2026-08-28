/**
 * 404. FR-G10, PRD Appendix A.7.
 *
 * Next.js emits this as `out/404.html`, which GitHub Pages serves for any
 * unmatched path automatically. No configuration needed (TRD section 7.3).
 */

import type { Metadata } from 'next';
import Link from 'next/link';

import { siteConfig } from '@/content/site';
import { PAGE_DESCRIPTIONS, buildMetadata } from '@/lib/seo';

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Not found',
    description: PAGE_DESCRIPTIONS.notFound,
    path: '/404/',
  }),

  /*
   * The one page on this site that should stay out of the index, and the
   * reason is a quirk of static export.
   *
   * The exporter emits this twice: as `out/404.html`, which Pages serves for
   * any unmatched path with a real 404 status, and as `out/404/index.html`,
   * which is reachable at `/404/` and returns **200**. That second one is a
   * soft 404 — a page saying "Nothing routed here" that reports itself as
   * perfectly fine. Indexed, it would appear in results under Farhan's name as
   * a broken-looking page.
   *
   * It is absent from the sitemap, but a sitemap is a suggestion rather than a
   * boundary, so the noindex is what actually settles it.
   */
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[var(--container-content)] px-5 sm:px-8 py-24">
      <p className="mono text-[var(--muted)] m-0">404</p>
      <h1 className="mt-4">Nothing routed here.</h1>

      <p className="mt-6 prose-measure text-[length:var(--text-md)]">
        That link does not match anything on the site. Try the work, the about page, or just
        email me.
      </p>

      {/* FR-G10: three links. */}
      <ul className="list-none p-0 mt-8 m-0 flex flex-wrap gap-4">
        <li>
          <Link href="/work/" className="button button--primary tap-target">
            Work
          </Link>
        </li>
        <li>
          <Link href="/about/" className="button button--secondary tap-target">
            About
          </Link>
        </li>
        <li>
          <Link href="/contact/" className="button button--secondary tap-target">
            Contact
          </Link>
        </li>
      </ul>

      <p className="mt-8">
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
      </p>
    </div>
  );
}
