/**
 * PRD section 7.2. Email, socials, publication, location and timezone,
 * last-updated date (FR-G7), and a link to the source of the site itself.
 */

import Link from 'next/link';

import buildMeta from '@/generated/build-meta.json';
import { publications } from '@/content/publications';
import { siteConfig } from '@/content/site';
import { ExternalLink } from './ExternalLink';

const REPO_URL = 'https://github.com/farhanshehzad155/farhanshehzad155.github.io';

export function SiteFooter() {
  const publication = publications[0];
  const publicationUrl = publication?.url ?? (publication?.doi ? `https://doi.org/${publication.doi}` : undefined);
  const lastUpdated = formatDate(buildMeta.lastCommit);

  return (
    <footer className="border-t border-[var(--border)] mt-24">
      <div className="mx-auto max-w-[var(--container-content)] px-5 sm:px-8 py-12 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="mono text-[var(--muted)] m-0">Contact</h2>
          <p className="mt-3 mb-0">
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </p>
          <ul className="list-none p-0 mt-3 mb-0 flex flex-wrap gap-4">
            {siteConfig.socials.map((social) => (
              <li key={social.url}>
                <ExternalLink href={social.url}>{social.label}</ExternalLink>
              </li>
            ))}
            {publicationUrl ? (
              <li>
                <ExternalLink href={publicationUrl}>Publication</ExternalLink>
              </li>
            ) : null}
          </ul>
        </div>

        <div>
          <h2 className="mono text-[var(--muted)] m-0">Site</h2>
          <p className="mt-3 mb-0 text-[var(--muted)]">
            {siteConfig.location} — {siteConfig.timezone}
          </p>
          <p className="mt-2 mb-0 text-[var(--muted)]">
            Last updated <time dateTime={buildMeta.lastCommit}>{lastUpdated}</time>
          </p>
          <p className="mt-3 mb-0 flex flex-wrap gap-4">
            <ExternalLink href={REPO_URL}>Source</ExternalLink>
            <Link href="/privacy/">Privacy</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

function formatDate(iso: string): string {
  // Fixed locale and timezone: the same build must produce the same string
  // everywhere, or the date becomes a source of hydration noise.
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso));
}
