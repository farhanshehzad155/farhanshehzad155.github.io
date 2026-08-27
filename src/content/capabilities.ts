/**
 * PRD section 8.7. Four clusters, ordered within each by actual depth rather
 * than alphabetically.
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
    caseStudySlugs: ['cv-anonymization', 'content-pipeline'],
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
    caseStudySlugs: ['order-fulfillment', 'content-pipeline', 'inventory-planning'],
  },
  {
    name: 'Backend & platform',
    statement:
      'Services and the pipelines behind them: APIs with a written contract, jobs that run unattended, and enough operational plumbing that a failure is visible.',
    tools: [
      'Python',
      'FastAPI',
      'Go',
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
