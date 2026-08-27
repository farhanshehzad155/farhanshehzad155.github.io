/**
 * Stack. PRD section 8.7 (optional, P2).
 *
 * FR-S3 is the point of this page: where a tool is used in a published case
 * study, it links to that case study. That is the single best credibility
 * mechanism available here, and it is the difference between this page and the
 * logo grid every other portfolio has.
 */

import type { Metadata } from 'next';
import Link from 'next/link';

import { capabilityClusters } from '@/content/capabilities';
import { getCaseStudy } from '@/content/case-studies/records';
import { PAGE_DESCRIPTIONS, buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Stack',
  description: PAGE_DESCRIPTIONS.stack,
  path: '/stack/',
  ogImage: '/og/stack.png',
});

export default function StackPage() {
  return (
    <div className="mx-auto max-w-[var(--container-content)] px-5 sm:px-8 py-16">
      <h1>Stack</h1>

      <p className="mt-6 prose-measure text-[length:var(--text-md)]">
        Grouped by what I use them for rather than by category, and ordered within each group by
        actual depth. There are no proficiency percentages here: they are unfalsifiable, and a
        bar at 85% tells you nothing a sentence would not tell you better.
      </p>

      {capabilityClusters.map((cluster) => (
        <section key={cluster.name} aria-labelledby={`cluster-${slugify(cluster.name)}`} className="mt-12">
          <h2 id={`cluster-${slugify(cluster.name)}`}>{cluster.name}</h2>

          {/* FR-S2 */}
          <p className="mt-3 prose-measure">{cluster.statement}</p>

          <ul className="mt-6 flex flex-wrap gap-2 list-none p-0">
            {cluster.tools.map((tool) => (
              <li key={tool} className="badge">
                {tool}
              </li>
            ))}
          </ul>

          {/* FR-S3 */}
          {cluster.caseStudySlugs?.length ? (
            <p className="mt-6 m-0">
              <span className="mono text-[var(--muted)] block">Used in</span>
              <span className="flex flex-wrap gap-4 mt-2">
                {cluster.caseStudySlugs.map((slug) => {
                  const study = getCaseStudy(slug);
                  if (!study) return null;
                  return (
                    <Link key={slug} href={`/work/${slug}/`}>
                      {study.title}
                    </Link>
                  );
                })}
              </span>
            </p>
          ) : null}

          {/* FR-S4 */}
          {cluster.familiarWith?.length ? (
            <div className="mt-6">
              <p className="mono text-[var(--muted)] m-0">Familiar with, would not claim depth</p>
              <ul className="mt-2 flex flex-wrap gap-2 list-none p-0">
                {cluster.familiarWith.map((tool) => (
                  <li key={tool} className="badge">
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ))}
    </div>
  );
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
