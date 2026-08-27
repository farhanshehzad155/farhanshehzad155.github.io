/**
 * Résumé. PRD section 8.6.
 *
 * FR-R1: rendered from the same content modules as the rest of the site. There
 * is no second copy to drift, which is the requirement satisfied structurally
 * rather than by discipline.
 *
 * FR-R3: the print stylesheet in globals.css targets this page primarily, so a
 * browser print produces an acceptable document even before the generated PDF
 * exists.
 */

import type { Metadata } from 'next';

import { CopyEmail } from '@/components/CopyEmail';
import { ExternalLink } from '@/components/ExternalLink';
import { capabilityClusters } from '@/content/capabilities';
import { education } from '@/content/education';
import { publications } from '@/content/publications';
import { getRoles } from '@/content/roles';
import { siteConfig } from '@/content/site';
import { PAGE_DESCRIPTIONS, buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Résumé',
  description: PAGE_DESCRIPTIONS.resume,
  path: '/resume/',
  ogImage: '/og/resume.png',
});

export default function ResumePage() {
  const publication = publications[0];
  const publicationUrl =
    publication?.url ?? (publication?.doi ? `https://doi.org/${publication.doi}` : undefined);

  return (
    <div className="mx-auto max-w-[var(--container-content)] px-5 sm:px-8 py-16">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1>{siteConfig.name}</h1>
          <p className="mt-2 text-[length:var(--text-md)]">{siteConfig.headline}</p>
          <p className="mono text-[var(--muted)] mt-2">
            {siteConfig.location} — {siteConfig.timezone}
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-3">
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            <span className="no-print">
              <CopyEmail email={siteConfig.email} />
            </span>
          </p>
          <ul className="list-none p-0 mt-2 flex flex-wrap gap-4">
            {siteConfig.socials.map((social) => (
              <li key={social.url}>
                <ExternalLink href={social.url}>{social.url.replace(/^https?:\/\//, '')}</ExternalLink>
              </li>
            ))}
          </ul>
        </div>

        {/* No PDF download: this page is the résumé (ADR-011). The print
            stylesheet in globals.css is tuned for it, so a recruiter who needs
            a file can print to PDF from the browser and get a clean one. */}
        <p className="mono text-[var(--muted)] m-0 no-print">
          Print this page for a PDF copy
        </p>
      </div>

      <section aria-labelledby="summary-heading" className="mt-12">
        <h2 id="summary-heading">Summary</h2>
        <p className="mt-3 prose-measure">{siteConfig.heroSubhead}</p>
      </section>

      <section aria-labelledby="resume-experience" className="mt-12">
        <h2 id="resume-experience">Experience</h2>
        {getRoles().map((role) => (
          <div key={`${role.company}-${role.start}`} className="mt-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="m-0">
                {role.title}, {role.company}
              </h3>
              <span className="mono text-[var(--muted)]">
                {role.start} — {role.end}
              </span>
            </div>
            <p className="mono text-[var(--muted)] m-0 mt-1">
              {role.employmentType} · {role.location}
              {role.remote ? ' · Remote' : ''}
            </p>
            <ul className="mt-2 prose-measure">
              {role.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section aria-labelledby="resume-skills" className="mt-12">
        <h2 id="resume-skills">Skills</h2>
        <dl className="mt-4 m-0">
          {capabilityClusters.map((cluster) => (
            <div key={cluster.name} className="py-3 border-b border-[var(--border)]">
              <dt className="font-semibold">{cluster.name}</dt>
              <dd className="m-0 mt-1">{cluster.tools.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="resume-education" className="mt-12">
        <h2 id="resume-education">Education</h2>
        <ul className="list-none p-0 mt-4 m-0">
          {education.map((entry) => (
            <li key={`${entry.institution}-${entry.start}`} className="py-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-semibold">
                  {entry.credential} {entry.field}, {entry.institution}
                </span>
                <span className="mono text-[var(--muted)]">
                  {entry.start}—{entry.end}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {publication ? (
        <section aria-labelledby="resume-publication" className="mt-12">
          <h2 id="resume-publication">Publication</h2>
          <p className="mt-4 mb-0">
            {publication.title}. <em>{publication.venue}</em>, {publication.publisher},{' '}
            {publication.date.slice(0, 4)}.
            {publicationUrl ? (
              <>
                {' '}
                <ExternalLink href={publicationUrl}>DOI</ExternalLink>
              </>
            ) : null}
          </p>
        </section>
      ) : null}
    </div>
  );
}
