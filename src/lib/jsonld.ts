/**
 * JSON-LD builders. FR-SEO5, FR-SEO6, FR-SEO7.
 *
 * Plain objects rather than a schema library: the output is a handful of fixed
 * shapes, and a dependency to describe them would not earn its place against
 * the PRD section 11.2 budget.
 */

import { education } from '@/content/education';
import { publications } from '@/content/publications';
import { capabilityClusters } from '@/content/capabilities';
import { siteConfig } from '@/content/site';
import type { CaseStudy } from '@/content/schema';
import { SITE_URL, absoluteUrl } from './constants';

type JsonLd = Record<string, unknown>;

/** FR-SEO5. Address is city and country only, never a street address. */
export function personJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    jobTitle: siteConfig.headline,
    url: `${SITE_URL}/`,
    email: `mailto:${siteConfig.email}`,
    sameAs: siteConfig.socials.map((social) => social.url),
    alumniOf: education.map((entry) => ({
      '@type': 'CollegeOrUniversity',
      name: entry.institution,
    })),
    knowsAbout: capabilityClusters.flatMap((cluster) => cluster.tools),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lahore',
      addressCountry: 'PK',
    },
  };
}

/** FR-SEO6. Emitted only when the publication has a resolvable identifier. */
export function scholarlyArticleJsonLd(): JsonLd | null {
  const publication = publications[0];
  if (!publication) return null;

  const identifier = publication.doi ?? publication.url;
  if (!identifier) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: publication.title,
    author: { '@type': 'Person', name: siteConfig.name },
    datePublished: publication.date,
    publisher: { '@type': 'Organization', name: publication.publisher },
    isPartOf: { '@type': 'Periodical', name: publication.venue },
    ...(publication.doi ? { identifier: `https://doi.org/${publication.doi}` } : {}),
    ...(publication.url ? { url: publication.url } : {}),
  };
}

/** FR-SEO7. */
export function caseStudyJsonLd(study: CaseStudy): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: study.title,
    description: study.summary,
    author: { '@type': 'Person', name: siteConfig.name },
    url: absoluteUrl(`/work/${study.slug}/`),
    about: study.stack.map((item) => item.name),
    ...(study.liveUrl ? { citation: study.liveUrl } : {}),
  };
}

export function breadcrumbJsonLd(study: CaseStudy): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Work', item: absoluteUrl('/work/') },
      {
        '@type': 'ListItem',
        position: 3,
        name: study.title,
        item: absoluteUrl(`/work/${study.slug}/`),
      },
    ],
  };
}
