/**
 * PRD section 8.4.1. The flagship: the only case study backed by a live public
 * product, so it carries the credibility load for the whole site.
 *
 * Content is drawn from Farhan's own role bullets, supplied 28 Aug 2026, and
 * from publicly observable facts about progloshipping.com verified the same
 * day. Nothing here describes Proglo internals, customer data, order data or
 * private endpoints (FR-PS5, rule C5).
 *
 * FR-PS6 fallback, if the company later objects to being named:
 *   - retitle to 'Multi-carrier shipping platform'
 *   - set `organisation` to 'A US-based multi-carrier shipping platform'
 *   - delete `liveUrl` and `evidence`, set `featured: false`
 *   - set `featured: true` on cv-anonymization
 * That is the whole change. No code is involved.
 */

import type { CaseStudy } from '../schema';

export const progloShipping: CaseStudy = {
  slug: 'proglo-shipping',
  title: 'Proglo Shipping',
  summary:
    'Full-stack and API work on a live multi-carrier shipping platform: Go services behind an OpenAPI contract, a Next.js front end, and the warehouse and Workspace automation around them.',
  metaDescription:
    'Go APIs behind an OpenAPI contract, a Next.js front end, barcode warehouse workflows and Apps Script release tooling on a live multi-carrier shipping platform.',
  organisation: 'Proglo World LLC',
  role: 'Full Stack Developer',
  period: { start: '2024-10', end: '2026-02' },
  domain: 'platform',
  featured: true,

  // Tier A. Publicly reachable, verified 28 Aug 2026.
  liveUrl: 'https://www.progloshipping.com',
  evidence: [
    // FR-PS3: the public docs route is verifiable evidence that the API is
    // real and documented.
    { label: 'Public API documentation', url: 'https://www.progloshipping.com/docs' },
  ],

  context:
    'Proglo Shipping is a shipping platform for small and scaling e-commerce brands. It creates labels and compares rates across USPS, UPS and LTL freight without requiring the volume minimums that carriers normally want, and it connects to the storefronts merchants already sell on. A brand shipping a few hundred parcels a month gets the kind of rate comparison and label automation that would otherwise need either a much larger volume commitment or somebody doing it by hand.',

  problem:
    'A shipping platform is mostly an integration problem wearing a product’s clothing. Rates, labels and tracking all live behind carrier APIs that differ from each other in structure, in vocabulary and in how they fail. Storefronts have their own shapes. And the merchant does not care about any of that: they want a label, at the best rate, for the parcel in front of them, right now. Everything interesting is in the layer between those two facts, and that layer has to hold a contract steady while what sits either side of it moves.',

  // FR-PS2 / FR-C6. Rendered directly under the header, not buried at the end.
  contribution:
    'This is a team product and I did not build it alone. I worked on specific parts of it: full-stack development in Next.js, TypeScript and Go; designing, building and documenting the REST APIs in Go against an OpenAPI (Swagger) contract; barcode generation and the warehouse data-processing workflows around it; and the Google Workspace automation, written in TypeScript on Apps Script, together with the build, bundling, deployment and release tooling for it. I also handled Google Workspace administration, including domain configuration and user provisioning. Product direction, carrier relationships and the rest of the platform are the team’s work, not mine.',

  constraints: [
    'A live product with paying merchants. Label generation sits on the critical path of somebody shipping an order, so changes could not trade availability for elegance.',
    'The API is public and documented, which makes the contract a commitment to third-party integrators rather than an internal detail that can be revised whenever it is convenient.',
    'Carrier APIs are external, rate-limited and occasionally wrong. Timeouts and bad responses have to be absorbed without losing an order or buying a label twice.',
    'Apps Script is not a normal deployment target. It has no native concept of a bundler, a version or a release, and the automation still had to be maintainable by more than one person.',
  ],

  // FR-PS5 / rule C5: no Proglo customer or order data, no internal
  // screenshots, no private endpoints. No unqualified numbers.
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
        'REST APIs in Go documented against an OpenAPI contract, so integrators build against a written specification rather than against observed behaviour.',
      tier: 'capability',
    },
    {
      value: '',
      label:
        'Warehouse operations automated through barcode generation and data processing, replacing manual inventory steps.',
      tier: 'capability',
    },
    {
      value: '',
      label:
        'Apps Script automation given a real toolchain: TypeScript source, bundling, versioned deployment and a repeatable release.',
      tier: 'capability',
    },
  ],

  // whatDidNotWork is deliberately absent. See the note on the field in
  // schema.ts: it cannot be inferred, and inventing it would be worse than
  // omitting it. This is the biggest remaining gap in the case study.

  stack: [
    {
      name: 'Go',
      rationale:
        'For the API services: static typing and a small deployment footprint on the part of the system that had to stay predictable under carrier-API latency.',
    },
    {
      name: 'OpenAPI / Swagger',
      rationale:
        'A written contract the front end and third-party integrators could both build against, rather than each discovering the API by trial.',
    },
    {
      name: 'Next.js',
      rationale: 'The product front end, and the same framework this site is built with.',
    },
    { name: 'TypeScript' },
    {
      name: 'Google Apps Script',
      rationale:
        'The automation had to run inside Google Workspace, where Apps Script is effectively the only option. The interesting part was giving it a build pipeline it does not ship with.',
    },
  ],

  readingMinutes: 6,
};
