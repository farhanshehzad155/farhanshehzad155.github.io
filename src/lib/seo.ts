/**
 * Metadata construction. PRD section 13, TRD section 8.
 *
 * Every route calls `buildMetadata`; no route hand-writes a Metadata object.
 * That centralisation is what makes FR-SEO1's title formula and FR-SEO3's
 * canonical rule enforceable rather than aspirational — there is one place to
 * get them right, and one place to test.
 */

import type { Metadata } from 'next';

import { siteConfig } from '@/content/site';
import { SITE_URL, absoluteUrl } from './constants';

const SITE_NAME = siteConfig.name;

/** FR-SEO1. */
export function pageTitle(title: string | undefined, kind: 'home' | 'case-study' | 'page'): string {
  if (kind === 'home') return `${SITE_NAME} — ${siteConfig.headline}`;
  if (kind === 'case-study') return `${title} — Case study — ${SITE_NAME}`;
  return `${title} — ${SITE_NAME}`;
}

export interface BuildMetadataInput {
  /** Page title, without the site suffix. Omitted for the home page. */
  title?: string;
  /** Hand-written, 140-160 characters (FR-SEO2). Never templated from body text. */
  description: string;
  /** Route path, e.g. '/work/proglo-shipping/'. */
  path: string;
  kind?: 'home' | 'case-study' | 'page';
  /** Path to a generated OG image under /og. Falls back to the default card. */
  ogImage?: string;
  type?: 'website' | 'article';
}

export function buildMetadata({
  title,
  description,
  path,
  kind = 'page',
  ogImage,
  type = 'website',
}: BuildMetadataInput): Metadata {
  const resolvedTitle = pageTitle(title, kind);
  const canonical = absoluteUrl(path);
  const image = `${SITE_URL}${ogImage ?? '/og/default.png'}`;

  return {
    title: resolvedTitle,
    description,
    alternates: { canonical },
    openGraph: {
      title: resolvedTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type,
      locale: 'en_GB',
      images: [{ url: image, width: 1200, height: 630, alt: resolvedTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description,
      images: [image],
    },
  };
}

/**
 * Descriptions for the static routes. Kept beside the metadata builder rather
 * than inline in each page, so the whole set can be reviewed for length and
 * tone in one place (FR-SEO2, rule CV-11).
 */
export const PAGE_DESCRIPTIONS = {
  home: 'AI automation and integration engineer. I design agents, pipelines and integrations for recruitment, e-commerce and marketing operations, and ship them to production.',
  work: 'Case studies on automation and platform work: what the problem was, what constrained the solution, what I decided and why, and what actually changed as a result.',
  about: 'How I moved from research on text categorisation into building AI automation and integrations, plus the full timeline, education and published work behind it.',
  resume: 'Résumé for Farhan Shehzad, AI automation and integration engineer: experience, stack, education and published research, on one page and readable without a download.',
  contact: 'Get in touch about an AI engineering role or contract automation work. Email is fastest, and I reply within two working days. LinkedIn and GitHub also listed.',
  stack: 'The tools I actually work with, grouped by what I use them for, with links to the case studies where each one was used. No proficiency bars, because they mean nothing.',
  privacy: 'What this site collects, which is very little: cookieless analytics, no tracking, and what the contact form provider receives when you send a message.',
  notFound: 'That link does not match anything on this site. Try the case studies, the about page, or send an email instead.',
} as const;
