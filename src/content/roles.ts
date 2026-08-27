/**
 * Employment history. FR-A2, FR-H6.
 *
 * ---------------------------------------------------------------------------
 * CONFIRMED (28 Aug 2026): company legal names, company LinkedIn pages, job
 * titles, and locations. These came from Farhan directly and are no longer
 * placeholders.
 *
 * STILL UNVERIFIED: every start and end date, and every employment type except
 * Expinder's (PRD section 3.2 states the current Expinder engagement is a
 * contract). Each carries a TODO(LI) marker, so `npm run validate:strict` will
 * not pass until a human has checked them against the LinkedIn profile.
 *
 * The dates are load-bearing beyond their own accuracy: `getRoles()` sorts by
 * `start`, so wrong dates mean the timeline renders in the wrong order on both
 * /about/ and the home page.
 *
 * MISSING ENTIRELY: Sadabyte. It is named in PRD rule C1 as a permitted
 * employer and FR-A2 calls for five roles, but no details have been supplied,
 * so the entry below is a stub.
 * ---------------------------------------------------------------------------
 */

import type { Role } from './schema';

export const roles: Role[] = [
  {
    company: 'Expinder GmbH',
    companyUrl: 'https://www.linkedin.com/company/expinder/',
    title: 'AI Engineer',
    // PRD section 3.2: "the current Expinder engagement is a contract".
    employmentType: 'Contract',
    start: '2026-01', // TODO(LI): confirm the start month.
    end: 'present',
    location: 'Düsseldorf, Germany',
    remote: true,
    oneLine: 'Recruitment AI and document automation for a German-market agency.',
    bullets: [
      'Built an assisted CV anonymization pipeline combining LLM document understanding with deterministic redaction, so removal is auditable rather than probabilistic.',
      'TODO(Q7): confirm how much of the Expinder system may be described before expanding this.',
    ],
    caseStudySlugs: ['cv-anonymization'],
  },
  {
    company: 'LeadForge B.V.',
    companyUrl: 'https://www.linkedin.com/company/getleadforge',
    title: 'AI Automation & Integration Engineer',
    employmentType: 'Contract', // TODO(LI): confirm the employment type.
    start: '2024-01', // TODO(LI): confirm start and end months.
    end: '2026-01',
    location: 'Zoetermeer, Netherlands',
    remote: true,
    oneLine: 'AI content production and publishing pipelines for e-commerce clients.',
    bullets: [
      'Built an end-to-end content pipeline: keyword research, topic generation, drafting, image generation, internal linking, and automated publishing to Shopify and WordPress.',
      'TODO(Q6): confirm the date range and definition behind the store and listing counts before any number appears here.',
    ],
    caseStudySlugs: ['content-pipeline'],
  },
  {
    company: 'Proglo World LLC',
    companyUrl: 'https://www.linkedin.com/company/proglobiz/',
    title: 'Full Stack Developer',
    employmentType: 'Full-time', // TODO(LI): confirm the employment type.
    start: '2023-01', // TODO(LI): confirm start and end months.
    end: '2026-01',
    location: 'Las Vegas, NV',
    remote: true,
    oneLine: 'Full-stack and API work on a live multi-carrier shipping platform.',
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
    company: 'Karmic Seed LLC',
    companyUrl: 'https://www.linkedin.com/company/karmicseed/',
    title: 'Automation & Integration Specialist',
    employmentType: 'Freelance', // TODO(LI): confirm the employment type.
    start: '2022-01', // TODO(LI): confirm start and end months.
    end: '2024-01',
    location: 'Clifton, NJ',
    remote: true,
    oneLine: 'E-commerce fulfillment and inventory planning automation.',
    bullets: [
      'Built order-fulfillment automation across Amazon and Shopify orders: validation, volumetric-weight carton selection, and rate and label generation across multiple carriers.',
      'Built a manufacturing planner that turns warehouse stock levels and projected demand into upcoming production requirements.',
      'TODO(Q14): confirm there is no objection to being named, given the engagement has ended.',
    ],
    caseStudySlugs: ['order-fulfillment', 'inventory-planning'],
  },
  {
    // Named in PRD rule C1 and required by FR-A2's five-role timeline, but no
    // details supplied yet. Everything here is a placeholder.
    company: 'Sadabyte',
    title: 'Software Engineer',
    employmentType: 'Full-time',
    start: '2020-01',
    end: '2022-01',
    location: 'Lahore, Pakistan',
    remote: false,
    oneLine: 'TODO(LI): confirm company legal name, title, dates, location and employment type.',
    bullets: [
      'TODO(LI): supply three to five bullets, rewritten from the LinkedIn text into plainer language rather than pasted (FR-A2). This is currently the thinnest entry on the site.',
    ],
    caseStudySlugs: [],
  },
];

/** Roles newest first, which is the order both /about and the home page want. */
export function getRoles(): Role[] {
  return [...roles].sort((a, b) => b.start.localeCompare(a.start));
}
