/**
 * PRD section 8.4.4. AI content production pipeline.
 *
 * Drawn from Farhan's own LeadForge role bullets, supplied 28 Aug 2026, and
 * extended 3 Sep 2026 from his fuller account of the same pipeline: the topic
 * research and SEO keyword analysis stages ahead of drafting, image
 * classification and processing after generation, internal linking to products
 * as well as to articles, and the editorial rule that topics come from real
 * customer questions and comparisons rather than from the model.
 *
 * The three storefronts named in that account are end clients of the LeadForge
 * engagement and are therefore NOT named here (rule C2). `clientSector` carries
 * their shape instead.
 *
 * The "50+ solutions" figure from the role bullet is NOT reproduced as an
 * outcome metric: rule CV-1 requires a scope and date range for a Tier C claim
 * and neither is confirmed yet (PRD Q6).
 */

import type { CaseStudy } from '../schema';

export const contentPipeline: CaseStudy = {
  slug: 'content-pipeline',
  title: 'AI content production pipeline',
  summary:
    'A chain from topic research and keyword analysis through drafting, imagery and internal linking to automated publishing on Shopify and WordPress.',
  metaDescription:
    'An AI content pipeline from keyword research through to automated publishing, and the quality controls that kept the output from reading as generic filler.',
  organisation: 'LeadForge B.V.',
  clientSector: 'International e-commerce, SaaS and marketing clients, including consumer storefronts in the Netherlands',
  role: 'AI Automation & Integration Engineer',
  period: { start: '2023-02', end: '2026-04' },
  domain: 'content-marketing',
  featured: false,

  context:
    'Client businesses running storefronts on Shopify and content sites on WordPress, needing product and editorial content at a volume where writing each piece by hand does not pay for itself. The work sat inside a wider delivery practice: this pipeline was one of a series of automation and AI systems built for international clients across e-commerce, SaaS and marketing operations.',

  problem:
    'The naive version of this is a script that asks a model for an article and posts it. That produces volume and nothing else: copy that could be about any business, images that do not match the text, and internal links pointing at URLs the model invented because they sounded plausible. The actual problem is not generation, which is the easy part now. It is everything around generation that decides whether the output is worth publishing under a client’s name.',

  // FR-CP2: quality control addressed head-on.
  contribution:
    'I built the full chain in n8n: topic research, keyword discovery and SEO keyword analysis, content generation, internal linking to relevant products and to existing articles, image generation, image classification and processing, and publishing into Shopify and WordPress. Most of the engineering went into the parts that are not the model. Internal linking is the clearest example. Asking a model to add internal links produces links that look right and resolve to nothing, because it is predicting plausible URLs rather than consulting the site. So the pipeline keeps its own index of pages and products that actually exist and links against that: a link either resolves or is not inserted. Topic selection works the same way. The pipeline picks subjects from real customer and product questions, comparisons between things the store actually sells, and topics with commercial intent behind them, rather than asking a model what to write about and getting a list of articles that could belong to anyone. The same principle runs through the rest of it — the model drafts, and deterministic checks decide what ships.',

  constraints: [
    'Output had to be publishable without an editor rewriting it, or the pipeline saves nobody any time and simply moves the work downstream.',
    'Two publishing targets with different content models, so the pipeline could not assume one CMS shape or one idea of what a page is.',
    'Internal links have to resolve to pages that exist, which means the pipeline needs its own view of the site rather than the model guessing at one.',
    'It runs against live client storefronts, so a bad publish is visible to a client’s customers rather than to a staging environment.',
    'Volume is not the goal. A hundred articles nobody searches for is a worse result than ten that answer a question a customer actually asked, so topic selection had to be constrained by something outside the model.',
  ],

  outcomes: [
    {
      value: '',
      label:
        'Produced and published content across multiple client storefronts without a person driving each step.',
      tier: 'capability',
    },
    {
      value: '',
      label:
        'Internal linking runs against an index of real pages, so links resolve rather than being plausible-looking guesses.',
      tier: 'capability',
    },
    {
      value: '',
      label:
        'Topics come from real customer and product questions, comparisons and commercially relevant subjects rather than from asking a model what to write about.',
      tier: 'capability',
    },
    {
      value: '',
      label:
        'Articles are linked to the products they discuss as well as to related articles, so content connects to the catalogue instead of sitting beside it.',
      tier: 'capability',
    },
    {
      value: '',
      label:
        'One pipeline publishes into both Shopify and WordPress, so adding a client did not mean writing a new publisher.',
      tier: 'capability',
    },
  ],

  // whatDidNotWork absent by design — see the note on the field in schema.ts.
  // FR-CP4 wants this one particularly: a reader in 2026 is sceptical of AI
  // content pipelines, and naming what it was bad at is what earns the rest.

  stack: [
    { name: 'Python' },
    {
      name: 'n8n',
      rationale:
        'Orchestration a client could see and adjust without reading code, which matters when the pipeline outlives the engagement.',
    },
    {
      name: 'LLM APIs',
      rationale: 'Drafting and topic generation only. Nothing decides what ships.',
    },
    {
      name: 'Image generation & classification',
      rationale:
        'Generated imagery is checked and classified before it is attached, because an image that does not match the article is the fastest way for a reader to work out that nobody looked at the page.',
    },
    { name: 'Shopify Admin API' },
    { name: 'WordPress REST API' },
  ],

  readingMinutes: 6,
};
