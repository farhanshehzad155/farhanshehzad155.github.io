/**
 * Employment history. FR-A2, FR-H6.
 *
 * ---------------------------------------------------------------------------
 * IMPORTANT — dates and titles are UNVERIFIED in this revision.
 *
 * PRD section 19.1 requires that "all dates, titles, and employment types match
 * the LinkedIn profile exactly". The LinkedIn export is listed as a related
 * input in PRD section 1.3 but is not in this repository, so the ranges below
 * are inferred from statements the PRD does make (building since 2020, two of
 * the roles ended in 2026, Expinder is a current contract) and are placeholders
 * until reconciled against the profile.
 *
 * Every entry therefore carries a TODO(LI) marker, which the strict validator
 * treats as an error. `npm run validate:strict` will not pass, and cannot pass,
 * until a human has checked these against LinkedIn. That is the intent: a date
 * is a factual claim, and this site does not ship unverified factual claims.
 * ---------------------------------------------------------------------------
 */

import type { Role } from './schema';

export const roles: Role[] = [
  {
    company: 'Expinder',
    title: 'AI Automation Engineer',
    employmentType: 'Contract',
    start: '2026-01',
    end: 'present',
    location: 'Remote',
    remote: true,
    oneLine: 'TODO(LI): confirm title, start month and employment type. Recruitment AI and document automation.',
    bullets: [
      'Built an assisted CV anonymization pipeline combining LLM document understanding with deterministic redaction, so removal is auditable rather than probabilistic.',
      'TODO(Q7): confirm how much of the Expinder system may be described before expanding this.',
    ],
    caseStudySlugs: ['cv-anonymization'],
  },
  {
    company: 'LeadForge',
    title: 'Automation Engineer',
    employmentType: 'Contract',
    start: '2024-01',
    end: '2026-01',
    location: 'Remote',
    remote: true,
    oneLine: 'TODO(LI): confirm title and dates. AI content production and publishing pipelines.',
    bullets: [
      'Built an end-to-end content pipeline: keyword research, topic generation, drafting, image generation, internal linking, and automated publishing to Shopify and WordPress.',
      'TODO(Q6): confirm the date range and definition behind the store and listing counts before any number appears here.',
    ],
    caseStudySlugs: ['content-pipeline'],
  },
  {
    company: 'Proglo World',
    title: 'Full-Stack Engineer',
    employmentType: 'Full-time',
    start: '2023-01',
    end: '2026-01',
    location: 'Remote',
    remote: true,
    oneLine: 'TODO(LI): confirm title and dates. Full-stack work on a live multi-carrier shipping platform.',
    bullets: [
      'Full-stack development with Next.js, TypeScript and Go on a production shipping platform.',
      'Designed, implemented and documented REST APIs in Go against an OpenAPI specification.',
      'Built barcode generation and warehouse data-processing workflows.',
      'Built Google Workspace automation in TypeScript on Apps Script, including the bundling, deployment and release tooling around it.',
      'TODO(Q1, Q2): confirm permission and the precise ownership boundary before publishing.',
    ],
    caseStudySlugs: ['proglo-shipping'],
  },
  {
    company: 'Karmic Seed',
    title: 'Automation Engineer',
    employmentType: 'Freelance',
    start: '2022-01',
    end: '2024-01',
    location: 'Remote',
    remote: true,
    oneLine: 'TODO(LI): confirm title and dates. E-commerce fulfillment and inventory planning automation.',
    bullets: [
      'Built order-fulfillment automation across Amazon and Shopify orders: validation, volumetric-weight carton selection, and rate and label generation across multiple carriers.',
      'Built a manufacturing planner that turns warehouse stock levels and projected demand into upcoming production requirements.',
      'TODO(Q14): confirm there is no objection to being named, given the engagement has ended.',
    ],
    caseStudySlugs: ['order-fulfillment', 'inventory-planning'],
  },
  {
    company: 'Sadabyte',
    title: 'Software Engineer',
    employmentType: 'Full-time',
    start: '2020-01',
    end: '2022-01',
    location: 'Lahore, Pakistan',
    remote: false,
    oneLine: 'TODO(LI): confirm title, dates and employment type. Early full-stack and automation work.',
    bullets: [
      'TODO(LI): rewrite from the LinkedIn bullets into plainer language. Do not paste them verbatim (FR-A2).',
    ],
    caseStudySlugs: [],
  },
];

/** Roles newest first, which is the order both /about and the home page want. */
export function getRoles(): Role[] {
  return [...roles].sort((a, b) => b.start.localeCompare(a.start));
}
