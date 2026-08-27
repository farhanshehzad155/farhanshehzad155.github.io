/**
 * Case study template. PRD section 8.4.
 *
 * The eight FR-C sections render in a fixed order and the order is not
 * parameterised. Deviating from the structure is a content bug per the PRD, so
 * the template does not offer the option.
 *
 * Layout above 1024px is the PRD section 10.4 asymmetric split: prose in a
 * 7-column measure, metadata in a 3-column sticky rail. Below that the rail
 * collapses above the prose. DOM order is identical either way, so reading
 * order never diverges from visual order at any breakpoint.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ExternalLink } from '@/components/ExternalLink';
import { MetricWithBasis } from '@/components/MetricWithBasis';
import { Schematic } from '@/components/Schematic';
import { approachBodies } from '@/content/case-studies';
import { caseStudies, getAdjacent, getCaseStudy } from '@/content/case-studies/records';
import { siteConfig } from '@/content/site';
import { DOMAIN_LABELS } from '@/lib/constants';
import { breadcrumbJsonLd, caseStudyJsonLd } from '@/lib/jsonld';
import { buildMetadata } from '@/lib/seo';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  return buildMetadata({
    title: study.title,
    description: study.metaDescription,
    path: `/work/${study.slug}/`,
    kind: 'case-study',
    ogImage: `/og/work-${study.slug}.png`,
    type: 'article',
  });
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const Approach = approachBodies[study.slug];
  const { previous, next } = getAdjacent(study.slug);
  const period = `${study.period.start} — ${study.period.end}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudyJsonLd(study)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(study)) }}
      />

      <article className="mx-auto max-w-[var(--container-content)] px-5 sm:px-8 py-16">
        {/* FR-C1 — header ------------------------------------------------ */}
        <header>
          <p className="mono text-[var(--muted)] m-0">
            <Link href="/work/">Work</Link> / {DOMAIN_LABELS[study.domain] ?? study.domain}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {study.liveUrl ? <span className="badge badge--live">Live product</span> : null}
            <span className="mono text-[var(--muted)]">
              {study.readingMinutes} min read
            </span>
          </div>

          <h1 className="mt-4">{study.title}</h1>
          <p className="mt-6 prose-measure text-[length:var(--text-md)]">{study.summary}</p>

          {study.liveUrl ? (
            <p className="mt-6">
              <ExternalLink href={study.liveUrl} className="button button--primary">
                Open the live product
              </ExternalLink>
            </p>
          ) : null}
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-[7fr_3fr]">
          <div>
            {/* FR-C6 — scope statement, deliberately near the top. On a team
                product a reader must not get halfway down before learning
                which parts were actually owned (FR-PS2). */}
            <section aria-labelledby="contribution-heading" className="surface p-6">
              <h2 id="contribution-heading" className="mono text-[var(--muted)] m-0">
                What I did
              </h2>
              <p className="mt-3 mb-0 prose-measure">{study.contribution}</p>
            </section>

            {/* FR-C2 */}
            <section aria-labelledby="context-heading" className="mt-12">
              <h2 id="context-heading">Context</h2>
              <p className="mt-4 prose-measure">{study.context}</p>
            </section>

            {/* FR-C3 */}
            <section aria-labelledby="problem-heading" className="mt-12">
              <h2 id="problem-heading">Problem</h2>
              <p className="mt-4 prose-measure">{study.problem}</p>
            </section>

            {/* FR-C4 — mandatory. This is what separates a case study from a
                marketing blurb. */}
            <section aria-labelledby="constraints-heading" className="mt-12">
              <h2 id="constraints-heading">Constraints</h2>
              <ul className="mt-4 prose-measure">
                {study.constraints.map((constraint) => (
                  <li key={constraint}>{constraint}</li>
                ))}
              </ul>
            </section>

            {/* FR-C5 */}
            <section aria-labelledby="approach-heading" className="mt-12">
              <h2 id="approach-heading">Approach</h2>

              {study.schematic && study.schematicSummary ? (
                <Schematic
                  src={study.schematic}
                  title={`System schematic for ${study.title}`}
                  summary={study.schematicSummary}
                />
              ) : null}

              <div className="mt-4 prose-measure">{Approach ? <Approach /> : null}</div>
            </section>

            {/* FR-C7 */}
            <section aria-labelledby="outcome-heading" className="mt-12">
              <h2 id="outcome-heading">Outcome</h2>
              <div className="mt-4 prose-measure">
                {study.outcomes.map((metric, index) => (
                  <MetricWithBasis
                    key={metric.label}
                    metric={metric}
                    idPrefix={study.slug}
                    index={index}
                  />
                ))}
              </div>

              <h3 className="mt-8">What did not work</h3>
              <p className="mt-3 prose-measure">{study.whatDidNotWork}</p>
            </section>
          </div>

          {/* Metadata rail. Sticky above 1024px, a plain block below it. */}
          <aside aria-label="Case study details" className="lg:sticky lg:top-8 lg:self-start">
            <dl className="m-0">
              <MetaRow label="Organisation" value={study.organisation} />
              {study.clientSector ? (
                <MetaRow label="End client" value={study.clientSector} />
              ) : null}
              <MetaRow label="Role" value={study.role} />
              <MetaRow label="Period" value={period} />
              <MetaRow label="Domain" value={DOMAIN_LABELS[study.domain] ?? study.domain} />
            </dl>

            {study.evidence?.length ? (
              <section className="mt-8">
                <h2 className="mono text-[var(--muted)] m-0">Evidence</h2>
                <ul className="list-none p-0 mt-3 m-0 flex flex-col gap-2">
                  {study.evidence.map((item) => (
                    <li key={item.url}>
                      <ExternalLink href={item.url}>{item.label}</ExternalLink>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {/* FR-C8 */}
            <section className="mt-8">
              <h2 className="mono text-[var(--muted)] m-0">Stack</h2>
              <dl className="mt-3 m-0">
                {study.stack.map((item) => (
                  <div key={item.name} className="py-3 border-b border-[var(--border)]">
                    <dt className="font-semibold">{item.name}</dt>
                    {item.rationale ? (
                      <dd className="m-0 mt-1 text-sm text-[var(--muted)]">{item.rationale}</dd>
                    ) : null}
                  </div>
                ))}
              </dl>
            </section>
          </aside>
        </div>

        {/* FR-C10 */}
        <nav
          aria-label="More case studies"
          className="mt-16 pt-8 border-t border-[var(--border)] flex flex-wrap gap-8 justify-between"
        >
          {previous ? (
            <p className="m-0">
              <span className="mono text-[var(--muted)] block">Previous</span>
              <Link href={`/work/${previous.slug}/`}>{previous.title}</Link>
            </p>
          ) : null}
          {next ? (
            <p className="m-0 text-right">
              <span className="mono text-[var(--muted)] block">Next</span>
              <Link href={`/work/${next.slug}/`}>{next.title}</Link>
            </p>
          ) : null}
        </nav>

        <p className="mt-12">
          Working on something similar?{' '}
          <a href={`mailto:${siteConfig.email}`}>Email me</a>.
        </p>
      </article>
    </>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="manifest-row">
      <dt className="manifest-row__key">{label}</dt>
      <span className="manifest-row__leader" aria-hidden="true" />
      <dd className="manifest-row__value m-0">{value}</dd>
    </div>
  );
}
