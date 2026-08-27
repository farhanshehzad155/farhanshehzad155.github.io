/**
 * About. PRD section 8.5.
 *
 * FR-A7: a professional photograph, or no photograph. `siteConfig.photo` is
 * optional and when it is absent the header is text-only, never a placeholder
 * silhouette.
 */

import type { Metadata } from 'next';
import Link from 'next/link';

import { ExternalLink } from '@/components/ExternalLink';
import { capabilityClusters } from '@/content/capabilities';
import { education } from '@/content/education';
import { earlierProjects } from '@/content/projects';
import { publications } from '@/content/publications';
import { getRoles } from '@/content/roles';
import { aboutBio, siteConfig } from '@/content/site';
import { scholarlyArticleJsonLd } from '@/lib/jsonld';
import { PAGE_DESCRIPTIONS, buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'About',
  description: PAGE_DESCRIPTIONS.about,
  path: '/about/',
  ogImage: '/og/about.png',
});

export default function AboutPage() {
  const publication = publications[0];
  const publicationUrl =
    publication?.url ?? (publication?.doi ? `https://doi.org/${publication.doi}` : undefined);
  const articleJsonLd = scholarlyArticleJsonLd();

  return (
    <>
      {articleJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      ) : null}

      <div className="mx-auto max-w-[var(--container-content)] px-5 sm:px-8 py-16">
        <h1>About</h1>

        {/* FR-A6. Recruiters need this, and hiding it wastes everyone's time. */}
        <p className="mono text-[var(--muted)] mt-4">
          {siteConfig.location} — {siteConfig.timezone} — remote or hybrid
        </p>

        {/* FR-A1 */}
        <div className="mt-8 prose-measure">
          {aboutBio.map((paragraph, index) => (
            <p key={index} className="mt-4">
              {paragraph}
            </p>
          ))}
        </div>

        {/* FR-A2 */}
        <section aria-labelledby="timeline-heading" className="mt-16">
          <h2 id="timeline-heading">Experience</h2>
          <ol className="list-none p-0 mt-8 m-0">
            {getRoles().map((role) => (
              <li
                key={`${role.company}-${role.start}`}
                className="py-6 border-b border-[var(--border)]"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="m-0">
                    {role.title},{' '}
                    {role.companyUrl ? (
                      <ExternalLink href={role.companyUrl} showIndicator={false}>
                        {role.company}
                      </ExternalLink>
                    ) : (
                      role.company
                    )}
                  </h3>
                  <p className="mono text-[var(--muted)] m-0">
                    {role.start} — {role.end}
                  </p>
                </div>

                <p className="mono text-[var(--muted)] m-0 mt-2">
                  {role.employmentType} · {role.location}
                  {role.remote ? ' · Remote' : ''}
                </p>

                <ul className="mt-4 prose-measure">
                  {role.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>

                {role.caseStudySlugs.length ? (
                  <p className="m-0 mt-3 flex flex-wrap gap-4">
                    {role.caseStudySlugs.map((slug) => (
                      <Link key={slug} href={`/work/${slug}/`}>
                        Case study: {slug.replace(/-/g, ' ')}
                      </Link>
                    ))}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        {/* FR-A4 */}
        {publication ? (
          <section aria-labelledby="research-heading" className="mt-16">
            <h2 id="research-heading">Research</h2>
            <div className="surface p-6 sm:p-8 mt-8">
              <h3 className="m-0">{publication.title}</h3>
              <p className="mono text-[var(--muted)] mt-3 mb-0">
                {publication.venue}, {publication.publisher}, {publication.date.slice(0, 4)}
              </p>
              <p className="mt-4 mb-0 prose-measure">{publication.plainSummary}</p>
              {publicationUrl ? (
                <p className="mt-4 mb-0">
                  <ExternalLink href={publicationUrl}>Read the paper</ExternalLink>
                </p>
              ) : (
                <p className="mt-4 mb-0 text-[var(--muted)] text-sm">
                  A direct link is not published here yet, pending confirmation of the DOI.
                </p>
              )}
            </div>
          </section>
        ) : null}

        {/* FR-A3 */}
        <section aria-labelledby="education-heading" className="mt-16">
          <h2 id="education-heading">Education</h2>
          <ul className="list-none p-0 mt-8 m-0">
            {education.map((entry) => (
              <li
                key={`${entry.institution}-${entry.start}`}
                className="py-4 border-b border-[var(--border)]"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-semibold">
                    {entry.credential} {entry.field}
                  </span>
                  <span className="mono text-[var(--muted)]">
                    {entry.start}—{entry.end}
                  </span>
                </div>
                <p className="m-0 mt-1 text-[var(--muted)]">
                  {entry.institution}
                  {entry.location ? `, ${entry.location}` : ''}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* FR-A5 */}
        <section aria-labelledby="projects-heading" className="mt-16">
          <h2 id="projects-heading">Earlier projects</h2>
          <p className="mt-4 text-[var(--muted)] prose-measure">
            Formative work, listed with dates so it reads as history rather than as a longer
            list of things.
          </p>
          <ul className="list-none p-0 mt-6 m-0">
            {earlierProjects.map((project) => (
              <li key={project.name} className="py-4 border-b border-[var(--border)]">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="m-0">{project.name}</h3>
                  <span className="mono text-[var(--muted)]">{project.year}</span>
                </div>
                <p className="m-0 mt-2 prose-measure">{project.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="stack-heading" className="mt-16">
          <h2 id="stack-heading">Tools</h2>
          <p className="mt-4">
            <Link href="/stack/">How I choose them, and where each one was used</Link>
          </p>
          <ul className="mt-6 flex flex-wrap gap-2 list-none p-0">
            {capabilityClusters.flatMap((cluster) =>
              cluster.tools.slice(0, 4).map((tool) => (
                <li key={`${cluster.name}-${tool}`} className="badge">
                  {tool}
                </li>
              )),
            )}
          </ul>
        </section>
      </div>
    </>
  );
}
