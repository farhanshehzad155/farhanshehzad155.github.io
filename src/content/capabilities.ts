/**
 * PRD section 8.7. Five clusters, ordered within each by actual depth rather
 * than alphabetically.
 *
 * The e-commerce and marketplace cluster was added 3 Sep 2026. It is the
 * largest single block of the employment history and had no home here: the
 * platforms were visible only inside role bullets and case study stacks, and
 * the operational surface around them was not stated anywhere.
 *
 * FR-S1 (no proficiency bars) is not a rule anyone has to remember here: the
 * `CapabilityCluster` type has no field that could express a proficiency, so
 * the component that would render one cannot be written.
 */

import type { CapabilityCluster } from './schema';

export const capabilityClusters: CapabilityCluster[] = [
  {
    name: 'AI & agents',
    statement:
      'I use models for the part of a problem that needs judgement about unstructured input, and keep deterministic code for the part that has to be repeatable.',
    tools: [
      'LLM integration (OpenAI, Claude)',
      'AI agents',
      'MCP servers',
      'Prompt engineering',
      'Document understanding',
      'Claude Code',
      'Claude Skills',
    ],
    caseStudySlugs: ['cv-anonymization', 'content-pipeline', 'product-data-enrichment'],
  },
  {
    name: 'Automation & integration',
    statement:
      'Most of my work is joining systems that were never designed to talk to each other, and making the join survive rate limits, outages and bad data.',
    tools: [
      'n8n',
      'Google Apps Script',
      'REST APIs',
      'OAuth 2.0',
      'Webhooks',
      'Browser automation',
      'Scrapy',
      'Selenium',
    ],
    caseStudySlugs: [
      'order-fulfillment',
      'content-pipeline',
      'inventory-planning',
      'product-data-enrichment',
    ],
  },
  {
    name: 'E-commerce & marketplace operations',
    statement:
      'Order and inventory management, fulfillment and shipping, customer and vendor operations, reconciliation and reporting — and the integrations that make a marketplace, a storefront, a carrier and an internal system behave as one process rather than four.',
    tools: [
      'Amazon Selling Partner API (SP-API)',
      'Amazon Ads API',
      'Walmart Marketplace',
      'Shopify Admin API',
      'ShipStation',
      'FedEx & DHL APIs',
      'Order & inventory management',
      'Fulfillment & shipping operations',
      'Reconciliation & operational reporting',
    ],
    caseStudySlugs: ['order-fulfillment', 'inventory-planning', 'product-data-enrichment'],
  },
  {
    name: 'Backend & platform',
    statement:
      'Services and the pipelines behind them: APIs with a written contract, jobs that run unattended, and enough operational plumbing that a failure is visible.',
    tools: [
      'Python',
      'FastAPI',
      'Node.js',
      'TypeScript',
      'OpenAPI/Swagger',
      'Docker',
      'Google Cloud Platform',
      'Git',
    ],
    caseStudySlugs: ['proglo-shipping'],
  },
  {
    name: 'Front-end',
    statement:
      'Interfaces for the systems above, plus product front-end work. This site is a sample of it.',
    tools: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'HTML5', 'CSS3'],
    caseStudySlugs: ['proglo-shipping'],
  },
];
