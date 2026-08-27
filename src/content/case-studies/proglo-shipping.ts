/**
 * PRD section 8.4.1. The flagship: the only case study backed by a live public
 * product, so it carries the credibility load for the whole site.
 *
 * FR-PS6 fallback, if permission (Q1) is refused:
 *   - set `title` to 'Multi-carrier shipping platform'
 *   - set `organisation` to 'A US-based multi-carrier shipping platform'
 *   - delete `liveUrl` and `evidence`
 *   - set `featured: false` here, and `featured: true` on cv-anonymization
 * That is the whole change. No code is involved.
 */

import type { CaseStudy } from '../schema';

export const progloShipping: CaseStudy = {
  slug: 'proglo-shipping',
  title: 'Proglo Shipping',
  summary:
    'Full-stack and API work on a live multi-carrier shipping platform for small and scaling e-commerce brands.',
  metaDescription:
    'Go APIs, OpenAPI documentation, a Next.js front end and Apps Script release tooling on Proglo Shipping, a live multi-carrier shipping platform.',
  organisation: 'Proglo World',
  role: 'Full-Stack Engineer',
  period: { start: '2023-01', end: '2026-01' }, // TODO(LI): confirm against LinkedIn.
  domain: 'platform',
  featured: true,

  // Tier A. progloshipping.com is publicly reachable and verified live on
  // 28 Aug 2026, independently of whether Q1 permission is granted for the
  // narrative below.
  liveUrl: 'https://www.progloshipping.com',
  evidence: [
    // FR-PS3: the public docs route is the verifiable evidence for the
    // OpenAPI work. TODO(Q3): confirm this is the specification he authored
    // before describing it as his.
    { label: 'Public API documentation', url: 'https://www.progloshipping.com/docs' },
  ],

  context:
    'Proglo Shipping is a multi-carrier shipping platform for small and scaling e-commerce brands. It creates labels and compares rates across USPS, UPS and LTL freight without requiring volume minimums, and integrates with the storefronts merchants already sell on. TODO(Q1): expand once permission is confirmed.',

  problem:
    'TODO(Q1, Q2): state the operational problem the platform solves for a merchant, and the specific engineering problem the components below addressed. Do not restate marketing copy from the product site.',

  // FR-PS2. This appears above the fold on the page, not buried at the bottom.
  contribution:
    'This is a team product. I did not build Proglo Shipping. I worked on specific components: REST APIs in Go and their OpenAPI contract, parts of the Next.js front end, barcode generation and warehouse data-processing workflows, and the Google Workspace automation with its build and release tooling. Everything else, including product direction, carrier contracts and the wider platform, is the team’s work. TODO(Q2): tighten this to name exactly which components were owned solo versus contributed to.',

  constraints: [
    'A live product with paying merchants: label generation is on the critical path of someone shipping an order, so changes could not risk downtime.',
    'The API is public and documented, which means the contract is a commitment to third-party integrators rather than an internal detail that can be changed freely.',
    'Carrier APIs are external, rate-limited, and occasionally return errors or timeouts that the platform has to absorb without losing an order.',
    'TODO(Q1): add the remaining real constraints once permission is confirmed. Constraints are what separate a case study from a marketing blurb (FR-C4).',
  ],

  // FR-PS5 / rule C5: no Proglo customer data, order data, internal
  // screenshots or private endpoints. Nothing below is a number.
  outcomes: [
    {
      value: '',
      label:
        'The platform is live and publicly reachable, including its API documentation route.',
      tier: 'verifiable',
      evidenceUrl: 'https://www.progloshipping.com',
    },
    {
      value: '',
      label:
        'Designed and documented REST APIs in Go against an OpenAPI specification, kept in sync with the implementation.',
      tier: 'capability',
    },
    {
      value: '',
      label:
        'Built Google Workspace automation in TypeScript on Apps Script, with bundling, versioned deployment and release tooling around it.',
      tier: 'capability',
    },
  ],

  whatDidNotWork:
    'TODO(Q1, Q2): required section (rule CV-2). Name one thing that did not work or had to be revised. This is the section a hiring engineer looks for, and a case study without it reads as marketing.',

  stack: [
    { name: 'Go', rationale: 'TODO: one line on why Go for these services rather than the obvious alternative.' },
    { name: 'OpenAPI / Swagger', rationale: 'A written contract the front end and third-party integrators could both build against.' },
    { name: 'Next.js', rationale: 'TODO: one line on the rendering strategy this choice was serving.' },
    { name: 'TypeScript' },
    { name: 'Google Apps Script', rationale: 'The automation had to run inside Google Workspace, which is where Apps Script is the only real option.' },
  ],

  readingMinutes: 7,
};
