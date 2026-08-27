/**
 * FR-H3, FR-H4, FR-W3.
 *
 * Two variants. `flagship` is the full-width card for the one case study backed
 * by a public product; `default` is the standard card used on the home page and
 * the work index.
 */

import Link from 'next/link';

import type { CaseStudy } from '@/content/schema';
import { DOMAIN_LABELS } from '@/lib/constants';
import { ExternalLink } from './ExternalLink';

interface CaseStudyCardProps {
  study: CaseStudy;
  variant?: 'flagship' | 'default';
  /** Heading level, so the card fits the surrounding document outline (FR-SEO9). */
  headingLevel?: 2 | 3;
}

export function CaseStudyCard({
  study,
  variant = 'default',
  headingLevel = 3,
}: CaseStudyCardProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const href = `/work/${study.slug}/`;
  const isFlagship = variant === 'flagship';

  // FR-H4: three stack tags on a card. The full list is on the case study page.
  const tags = study.stack.slice(0, 3);
  const primaryOutcome = study.outcomes[0];

  return (
    <article
      className={[
        'surface p-6 sm:p-8 flex flex-col gap-4',
        isFlagship ? 'border-l-4 border-l-[var(--accent)]' : '',
      ].join(' ')}
    >
      <div className="flex flex-wrap items-center gap-2">
        {/* FR-W3 / FR-AC5: the badge is text plus a border, never colour alone. */}
        {study.liveUrl ? <span className="badge badge--live">Live product</span> : null}
        <span className="badge">{DOMAIN_LABELS[study.domain] ?? study.domain}</span>
        <span className="mono text-[var(--muted)]">
          {study.period.start.slice(0, 4)}
          {study.period.end === 'present' ? '—present' : `—${study.period.end.slice(0, 4)}`}
        </span>
      </div>

      <Heading className={isFlagship ? 'text-[length:var(--text-xl)]' : ''}>
        <Link href={href} className="heading-anchor">
          {study.title}
        </Link>
      </Heading>

      <p className="m-0 text-[var(--muted)]">
        {study.clientSector ?? study.organisation}
      </p>

      <p className="m-0 prose-measure">{study.summary}</p>

      {primaryOutcome ? (
        <p className="m-0 prose-measure">
          {primaryOutcome.value ? <strong>{primaryOutcome.value} </strong> : null}
          {primaryOutcome.label}
        </p>
      ) : null}

      <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
        {tags.map((item) => (
          <li key={item.name} className="badge">
            {item.name}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-3 mt-2">
        <Link href={href} className="button button--secondary tap-target">
          Read the case study
          <span className="visually-hidden"> about {study.title}</span>
        </Link>

        {study.liveUrl ? (
          <ExternalLink href={study.liveUrl} className="button button--primary">
            Open the live product
          </ExternalLink>
        ) : null}
      </div>
    </article>
  );
}
