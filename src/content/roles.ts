/**
 * Employment history. FR-A2, FR-H6.
 *
 * Confirmed by Farhan on 28 Aug 2026: company legal names, company LinkedIn
 * pages, job titles, locations, dates, and the bullets themselves. Employment
 * types are inferred (see the note on each) and `remote` is inferred from him
 * being in Lahore while all four employers are in Germany, the Netherlands and
 * the United States.
 *
 * ---------------------------------------------------------------------------
 * NOTE ON THE THREE NUMBERS IN THESE BULLETS
 *
 * Three bullets carry quantitative claims: ~80% on CV anonymization, ~80% on
 * order fulfillment, and 50+ delivered solutions. They are Farhan's own claims
 * about his own work and are reproduced as supplied.
 *
 * They do NOT currently carry a basis, and PRD section 6.3 is explicit that a
 * Tier B or C claim needs one anywhere it appears. Rule CV-15 in the validator
 * flags each of them on every run so the gap stays visible rather than
 * quietly shipping.
 *
 * The fix is PRD Q4, Q5 and Q6: what was sampled, before and after, over what
 * period. With those the numbers move into the case study outcomes as proper
 * Metric objects and render with the section 6.4 footnote they are supposed to
 * have.
 * ---------------------------------------------------------------------------
 */

import type { Role } from './schema';

export const roles: Role[] = [
  {
    company: 'Expinder GmbH',
    companyUrl: 'https://www.linkedin.com/company/expinder/',
    title: 'AI Engineer',
    // PRD section 3.2 states the current Expinder engagement is a contract.
    employmentType: 'Contract',
    start: '2026-05',
    end: 'present',
    location: 'Düsseldorf, Germany',
    remote: true,
    oneLine: 'Recruitment and HR-tech AI: agents, document pipelines and the full-stack systems around them.',
    bullets: [
      'Design and build AI-powered recruitment and HR-tech systems, including agents, automation workflows and full-stack web applications.',
      'Reduced manual CV anonymization effort by approximately 80% by combining LLM-based document understanding with deterministic data processing.',
      'Build browser automation and API integrations for candidate sourcing, data enrichment and recruitment operations.',
      'Build document processing, candidate enrichment and CRM integration pipelines to improve data quality across recruitment workflows.',
      'Build backend services, front-end applications and cloud infrastructure for AI systems running in production.',
      'Own solution architecture end to end: design, development, deployment and the improvement that follows.',
    ],
    caseStudySlugs: ['cv-anonymization'],
  },
  {
    company: 'Proglo World LLC',
    companyUrl: 'https://www.linkedin.com/company/proglobiz/',
    title: 'Full Stack Developer',
    // Inferred: a defined-term engagement on a single product. Correct to
    // 'Contract' if that is what LinkedIn says.
    employmentType: 'Full-time',
    start: '2024-10',
    end: '2026-02',
    location: 'Las Vegas, NV',
    remote: true,
    oneLine: 'Full-stack and API work on a live multi-carrier shipping platform.',
    bullets: [
      'Built full-stack web applications in Next.js, TypeScript and Go supporting business operations and automation workflows.',
      'Designed, built and documented REST APIs in Go against an OpenAPI (Swagger) contract, so internal and third-party integrations had something reliable to build against.',
      'Built Google Workspace automation in Google Apps Script and TypeScript for operational workflows and data processing.',
      'Maintained the TypeScript toolchain around those Apps Script projects, including build, bundling, deployment and release.',
      'Automated warehouse operations through barcode generation, data processing and inventory workflow improvements.',
      'Ran Google Workspace administration: domain configuration, user provisioning and operational setup.',
    ],
    caseStudySlugs: ['proglo-shipping'],
  },
  {
    company: 'LeadForge B.V.',
    companyUrl: 'https://www.linkedin.com/company/getleadforge',
    title: 'AI Automation & Integration Engineer',
    // Inferred from the engagement shape: delivery for many external clients.
    employmentType: 'Contract',
    start: '2023-02',
    end: '2026-04',
    location: 'Zoetermeer, Netherlands',
    remote: true,
    oneLine: 'Automation and AI delivery for international clients across e-commerce, SaaS and marketing operations.',
    bullets: [
      'Delivered 50+ automation and AI solutions for international clients, turning business requirements into workflow, integration and automation systems.',
      'Designed AI-powered workflows for content generation, lead generation, data enrichment and process optimisation.',
      'Built e-commerce automation covering order processing, inventory workflows, data synchronisation and operational reporting.',
      'Built API integrations over REST, OAuth 2.0 and webhooks across e-commerce, SaaS and business platforms.',
      'Built web data extraction systems in Python, Scrapy and Selenium for structured collection and processing.',
      'Integrated the Amazon, Shopify, ShipStation and Walmart APIs to synchronise e-commerce operations.',
      'Built and shipped Google Workspace Add-ons to extend client business workflows.',
      'Processed and reshaped large datasets for operational workflows, analytics and downstream integrations.',
    ],
    caseStudySlugs: ['content-pipeline'],
  },
  {
    company: 'Karmic Seed LLC',
    companyUrl: 'https://www.linkedin.com/company/karmicseed/',
    title: 'Automation & Integration Specialist',
    // Inferred from the engagement shape. Correct if LinkedIn says otherwise.
    employmentType: 'Contract',
    start: '2022-07',
    end: '2025-02',
    location: 'Clifton, NJ',
    remote: true,
    oneLine: 'E-commerce operations automation: fulfillment, inventory planning, advertising and price monitoring.',
    bullets: [
      'Reduced order fulfillment effort by approximately 80% by automating order validation, volumetric-weight carton selection and shipping label generation across Amazon and Shopify orders.',
      'Built an inventory planning workflow that turns warehouse stock levels and projected demand into upcoming manufacturing requirements, replacing a manual planning step.',
      'Automated Amazon Ads campaign scheduling and execution by joining Google Sheets, Google Apps Script and the Amazon Ads API.',
      'Built a cloud-scheduled competitor price monitoring system in Python and Scrapy to track marketplace pricing and inform pricing decisions.',
      'Built API integrations and data workflows across Amazon Seller Central, Amazon Ads, Shopify, FedEx, DHL and ShipStation.',
    ],
    caseStudySlugs: ['order-fulfillment', 'inventory-planning'],
  },
];

/** Roles newest first, which is the order both /about and the home page want. */
export function getRoles(): Role[] {
  return [...roles].sort((a, b) => b.start.localeCompare(a.start));
}

/**
 * The earliest role start year, used for the "Building since" row on the
 * manifest strip (FR-H2).
 *
 * Derived rather than hard-coded so it cannot contradict the timeline directly
 * beneath it. The PRD's copy deck says 2020, which was true of a longer history
 * than the one this site now shows.
 */
export function buildingSinceYear(): string {
  const earliest = roles.reduce(
    (min, role) => (role.start < min ? role.start : min),
    roles[0]?.start ?? '',
  );
  return earliest.slice(0, 4);
}
