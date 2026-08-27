/**
 * Work index. PRD section 8.3.
 *
 * FR-W2 filtering is implemented with zero JavaScript. Empty anchor targets sit
 * before the chips; `:target` sibling selectors in globals.css then hide the
 * non-matching cards, mark the active chip, and swap the count line.
 *
 * The unfiltered list is what renders with no fragment, so the complete list is
 * the no-JS default exactly as the requirement asks. The filter state lives in
 * the URL, so it is shareable and the back button works, for free.
 */

import type { Metadata } from 'next';
import Link from 'next/link';

import { CaseStudyCard } from '@/components/CaseStudyCard';
import { getCaseStudies } from '@/content/case-studies/records';
import { workIndexIntro } from '@/content/site';
import { DOMAIN_LABELS } from '@/lib/constants';
import { PAGE_DESCRIPTIONS, buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Work',
  description: PAGE_DESCRIPTIONS.work,
  path: '/work/',
  ogImage: '/og/work.png',
});

export default function WorkIndexPage() {
  const studies = getCaseStudies();
  const domains = [...new Set(studies.map((study) => study.domain))];

  const countFor = (domain: string) =>
    studies.filter((study) => study.domain === domain).length;

  return (
    <div className="mx-auto max-w-[var(--container-content)] px-5 sm:px-8 py-16">
      <h1>Work</h1>

      {/* FR-W4: sets expectations honestly, before the reader starts wondering
          why there are no screenshots. */}
      <p className="mt-6 prose-measure text-[length:var(--text-md)]">{workIndexIntro}</p>

      {/* The filter machinery. These anchors carry no content; they exist so
          `:target` has something to match, and they must precede everything
          they influence because CSS can only look forwards. */}
      {domains.map((domain) => (
        <span key={domain} id={`filter-${domain}`} className="filter-anchor" aria-hidden="true" />
      ))}

      <nav aria-label="Filter by domain" className="filter-nav mt-10">
        <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
          <li>
            {/* Clearing the filter means clearing the fragment, so this points
                at the route itself rather than at `#`. An empty fragment is
                not a navigable address, and the a11y lint is right to say so. */}
            <Link href="/work/" className="badge tap-target">
              All
            </Link>
          </li>
          {domains.map((domain) => (
            <li key={domain}>
              <a href={`#filter-${domain}`} className="badge tap-target">
                {DOMAIN_LABELS[domain] ?? domain}
                {/* FR-AC5: the active state is text, not just a border colour.
                    Hidden until its filter is the target. */}
                <span className="filter-chip__active"> (showing)</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* One count line per state; CSS shows exactly one. */}
      <div className="filter-status mono text-[var(--muted)] mt-4" role="status">
        <p className="filter-status__all m-0">Showing all {studies.length} case studies</p>
        {domains.map((domain) => (
          <p key={domain} className="m-0" data-status-for={domain}>
            Showing {countFor(domain)} of {studies.length} case studies —{' '}
            {DOMAIN_LABELS[domain] ?? domain}
          </p>
        ))}
      </div>

      <div className="work-grid mt-8 grid gap-6 lg:grid-cols-2">
        {studies.map((study) => (
          <div key={study.slug} data-domain={study.domain}>
            <CaseStudyCard study={study} headingLevel={2} />
          </div>
        ))}
      </div>
    </div>
  );
}
