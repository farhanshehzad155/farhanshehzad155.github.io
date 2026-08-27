/**
 * Home. PRD section 8.2.
 *
 * Composition follows the PRD section 7.3 priority order exactly:
 * position -> proof -> flagship -> remaining work -> capabilities ->
 * experience -> research -> contact.
 *
 * FR-H9: no client-side JavaScript beyond the theme script, the copy button and
 * the analytics beacon. That is met structurally — every component below is a
 * server component except ThemeToggle and CopyEmail.
 */

import Link from 'next/link';

import { AvailabilityChip } from '@/components/AvailabilityChip';
import { CaseStudyCard } from '@/components/CaseStudyCard';
import { CopyEmail } from '@/components/CopyEmail';
import { ExternalLink } from '@/components/ExternalLink';
import { ManifestStrip, type ManifestRow } from '@/components/ManifestStrip';
import { capabilityClusters } from '@/content/capabilities';
import { getFlagship, getSupportingCaseStudies } from '@/content/case-studies/records';
import { publications } from '@/content/publications';
import { getRoles } from '@/content/roles';
import { siteConfig } from '@/content/site';
import { personJsonLd } from '@/lib/jsonld';

export default function HomePage() {
  const flagship = getFlagship();
  const supporting = getSupportingCaseStudies();
  const publication = publications[0];
  const publicationUrl =
    publication?.url ?? (publication?.doi ? `https://doi.org/${publication.doi}` : undefined);

  return (
    <>
      {/* FR-SEO5 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />

      <div className="mx-auto max-w-[var(--container-content)] px-5 sm:px-8">
        {/* FR-H1 --------------------------------------------------------- */}
        <section className="pt-16 pb-10 sm:pt-24 sm:pb-14">
          <p className="mono text-[var(--muted)] m-0">{siteConfig.headline}</p>

          <h1 className="mt-4 max-w-[18ch]">{siteConfig.heroHeadline}</h1>

          <p className="mt-6 prose-measure text-[length:var(--text-md)]">
            {siteConfig.heroSubhead}
          </p>
          <p className="mt-4 prose-measure text-[var(--muted)]">{siteConfig.heroSupporting}</p>

          <div className="mt-6">
            <AvailabilityChip />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/work/" className="button button--primary tap-target">
              See the work
            </Link>
            {/* The site is the résumé, so this goes to the page rather than to
                a PDF download. See ADR-011. */}
            <Link href="/resume/" className="button button--secondary tap-target">
              Read the résumé
            </Link>
          </div>
        </section>

        {/* FR-H2 — the manifest strip ------------------------------------ */}
        <section aria-labelledby="manifest-heading" className="pb-16">
          <h2 id="manifest-heading" className="visually-hidden">
            Verifiable facts
          </h2>
          <ManifestStrip rows={manifestRows()} />
        </section>

        {/* FR-H3 — flagship ---------------------------------------------- */}
        {flagship ? (
          <section aria-labelledby="flagship-heading" className="pb-16">
            <h2 id="flagship-heading" className="mono text-[var(--muted)]">
              Flagship
            </h2>
            <div className="mt-6">
              <CaseStudyCard study={flagship} variant="flagship" />
            </div>
          </section>
        ) : null}

        {/* FR-H4 — selected work ----------------------------------------- */}
        <section aria-labelledby="work-heading" className="pb-16">
          <h2 id="work-heading">Selected work</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {supporting.map((study) => (
              <CaseStudyCard key={study.slug} study={study} />
            ))}
          </div>
          <p className="mt-8">
            <Link href="/work/">All case studies</Link>
          </p>
        </section>

        {/* FR-H5 — capabilities ------------------------------------------ */}
        <section aria-labelledby="capabilities-heading" className="pb-16">
          <h2 id="capabilities-heading">What I work with</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {capabilityClusters.map((cluster) => (
              <div key={cluster.name}>
                <h3>{cluster.name}</h3>
                <p className="mt-2 prose-measure text-[var(--muted)]">{cluster.statement}</p>
                <ul className="mt-3 flex flex-wrap gap-2 list-none p-0">
                  {cluster.tools.map((tool) => (
                    <li key={tool} className="badge">
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FR-H6 — experience summary ------------------------------------ */}
        <section aria-labelledby="experience-heading" className="pb-16">
          <h2 id="experience-heading">Experience</h2>
          <ul className="mt-8 list-none p-0 m-0">
            {getRoles().map((role) => (
              <li
                key={`${role.company}-${role.start}`}
                className="py-4 border-b border-[var(--border)]"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-semibold">
                    {role.title}, {role.company}
                  </span>
                  <span className="mono text-[var(--muted)]">
                    {role.start} — {role.end}
                  </span>
                </div>
                <p className="m-0 mt-1 text-[var(--muted)] prose-measure">{role.oneLine}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <Link href="/about/">Full timeline</Link>
          </p>
        </section>

        {/* FR-H7 — research ---------------------------------------------- */}
        {publication ? (
          <section aria-labelledby="research-heading" className="pb-16">
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
              ) : null}
            </div>
          </section>
        ) : null}

        {/* FR-H8 — closing CTA ------------------------------------------- */}
        <section aria-labelledby="contact-heading" className="pb-24">
          <h2 id="contact-heading">Get in touch</h2>
          <p className="mt-4 prose-measure">
            Email is the fastest way to reach me. If you are looking for contract help, tell me
            what the manual process currently costs you and I will tell you whether it is worth
            automating.
          </p>
          <p className="mt-4 flex flex-wrap items-center gap-3">
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            <CopyEmail email={siteConfig.email} />
          </p>
          <ul className="mt-4 list-none p-0 flex flex-wrap gap-4">
            {siteConfig.socials.map((social) => (
              <li key={social.url}>
                <ExternalLink href={social.url}>{social.label}</ExternalLink>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

/**
 * FR-H2. Four to six verifiable facts, each a link where a link exists.
 *
 * Rows are only included when the fact behind them is real. The publication row
 * is dropped rather than shown without its DOI, because an unlinked row in a
 * strip whose entire purpose is verifiability undercuts the strip.
 */
function manifestRows(): ManifestRow[] {
  const rows: ManifestRow[] = [];
  const flagship = getFlagship();
  const publication = publications[0];
  const publicationUrl =
    publication?.url ?? (publication?.doi ? `https://doi.org/${publication.doi}` : undefined);

  if (flagship?.liveUrl) {
    rows.push({
      key: 'Shipped',
      value: flagship.liveUrl.replace(/^https?:\/\/(www\.)?/, ''),
      href: flagship.liveUrl,
    });
  }

  if (publication && publicationUrl) {
    rows.push({
      key: 'Published',
      value: `${publication.venue}, ${publication.publisher} ${publication.date.slice(0, 4)}`,
      href: publicationUrl,
    });
  }

  rows.push({ key: 'Building since', value: '2020' });
  rows.push({ key: 'Primary stack', value: 'Python · TypeScript · Go' });
  rows.push({
    key: 'Based',
    value: `${siteConfig.location} — ${siteConfig.timezone}`,
  });

  if (siteConfig.available) {
    rows.push({ key: 'Status', value: siteConfig.availabilityNote });
  }

  return rows;
}
