/** PRD section 8.4.4. AI content production pipeline. */

import type { CaseStudy } from '../schema';

export const contentPipeline: CaseStudy = {
  slug: 'content-pipeline',
  title: 'AI content production pipeline',
  summary:
    'A chain from keyword research through drafting, imagery and internal linking to automated publishing on Shopify and WordPress.',
  metaDescription:
    'An AI content pipeline from keyword research to automated publishing, and the quality controls that kept the output from reading as generic filler.',
  organisation: 'LeadForge',
  clientSector: 'E-commerce and marketing clients across several retail sectors',
  role: 'Automation Engineer',
  period: { start: '2024-01', end: '2026-01' }, // TODO(LI): confirm.
  domain: 'content-marketing',
  featured: false,

  context:
    'Product and editorial content at a scale where writing each piece by hand is not economic, across storefronts on Shopify and sites on WordPress. TODO(content): expand to 80-150 words.',

  problem:
    'The naive version of this is a script that asks a model for an article and posts it. That produces volume and nothing else: generic copy, images that do not match, and internal links that point wherever the model felt like pointing. The actual problem is not generation. It is everything around generation that decides whether the output is worth publishing.',

  // FR-CP2: quality control is addressed head-on, because a reader in 2026 is
  // sceptical of AI content pipelines and the page has to earn trust.
  contribution:
    'I built the full chain: keyword research, topic generation, drafting, image generation, internal linking, and publishing into Shopify and WordPress. Most of the engineering went into the parts that are not the model. Internal linking runs against a real index of existing pages rather than asking the model to invent URLs, which is the difference between useful links and confident nonsense. TODO(content): describe the human review step honestly, including how much of it there was.',

  constraints: [
    'Output had to be publishable without an editor rewriting it, or the pipeline saves nothing.',
    'Two publishing targets with different content models, so the pipeline could not assume one CMS shape.',
    'Internal links have to resolve to pages that exist, which means the pipeline needs its own view of the site rather than the model guessing.',
    'TODO(content): add the remaining real constraints.',
  ],

  // FR-CP3: the "500+ products across 20+ stores" figure is Tier C and needs
  // its date range and definition (Q6) before it can appear.
  outcomes: [
    {
      value: '',
      label:
        'Produced and published content across multiple storefronts without a person driving each step.',
      tier: 'capability',
    },
    {
      value: '',
      label:
        'Internal linking runs against an index of real pages, so links resolve rather than being plausible-looking guesses.',
      tier: 'capability',
    },
  ],

  // FR-CP4: state plainly what the pipeline was not good at.
  whatDidNotWork:
    'TODO(content): required (rule CV-2), and FR-CP4 asks for it explicitly. Name what the pipeline was bad at. Anything that needed genuine subject expertise, or a point of view, or current information the model did not have, is the usual answer, and saying so is what makes the rest credible.',

  stack: [
    { name: 'Python' },
    { name: 'n8n', rationale: 'Orchestration the client could see and adjust without reading code.' },
    { name: 'LLM APIs', rationale: 'TODO: one line on which and why.' },
    { name: 'Shopify Admin API' },
    { name: 'WordPress REST API' },
  ],

  readingMinutes: 5,
};
