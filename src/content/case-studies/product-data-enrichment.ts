/**
 * Product data enrichment and product relationships.
 *
 * Drawn from Farhan's own account of the LeadForge work, supplied 3 Sep 2026.
 *
 * The end clients are NOT named here, or anywhere else on the site. Three were
 * supplied by name; rule C2 covers end clients of an agency engagement, and
 * listing them in `denylist.ts` would publish them in this public repository
 * instead. They are described by sector and shape, which is the mechanism the
 * rule prescribes.
 *
 * No outcome carries a number. The account of this work describes the impact
 * qualitatively — substantial manual work removed, better consistency, wider
 * SEO coverage — without a sampled before and after, and rule CV-1 will not
 * accept a Tier B claim on that basis. The outcomes below state the same
 * results as capabilities. Supply what was sampled, the before and after
 * values and the period, and they can be promoted.
 */

import type { CaseStudy } from '../schema';

export const productDataEnrichment: CaseStudy = {
  slug: 'product-data-enrichment',
  title: 'Product data enrichment',
  summary:
    'Pulling product attributes out of prose descriptions with a model, validating them before anything is accepted, and deriving product families and cross-sell relationships from sales patterns.',
  metaDescription:
    'Extracting product attributes from unstructured descriptions with an LLM, validating each one before it is written back, and deriving cross-sell relationships.',
  organisation: 'LeadForge B.V.',
  clientSector: 'Consumer e-commerce storefronts in the Netherlands',
  role: 'AI Automation & Integration Engineer',
  period: { start: '2023-02', end: '2026-04' },
  domain: 'ecommerce',
  featured: false,

  context:
    'Storefronts whose product data was written for a person to read and for nothing else. Size, material, capacity, compatibility, model number: all present, all sitting inside a paragraph of description rather than in a field anything could query. The stores wanted filtering, comparison and recommendations, which are three versions of the same request underneath — a structured view of a catalogue that exists only as text. Retyping it product by product is possible in principle, and at catalogue scale nobody was ever going to finish.',

  problem:
    'An attribute that exists only inside a sentence is invisible to every system that needs it. A shopper cannot filter on it, a comparison cannot show it, a recommendation cannot use it, and a search engine has nothing to key off. The obvious fix — hand each description to a model and ask for JSON — fails in the way that matters most here. A model asked for structured output returns structured output every time: well formed, confident, and occasionally describing a different product. At catalogue scale nobody is reading the results, so a wrong attribute goes live and stays live.',

  contribution:
    'I built the enrichment workflows end to end in n8n: pull the raw descriptions, extract candidate attributes with a model, validate what came back, and write only the accepted attributes to the store. The decision worth stating is that extraction and acceptance are separate steps. The model proposes values against the attribute vocabulary for that category; a validation stage then checks type, units and permitted values, and whether the source text actually supports the claim. Anything that fails is dropped rather than downgraded, because a missing attribute is a correct outcome and a guessed one is not. I also built the related workflows that group products into families and read sales and view patterns to establish which products are bought or looked at together, which is what the cross-sell and recommendation suggestions are generated from.',

  constraints: [
    'The output is written back into a live storefront, so a wrong attribute is not a bad log line. It is a product page telling a customer something untrue.',
    'Descriptions were prose written by different people over several years, with no shared template to key off and no guarantee that any given attribute is present at all.',
    'The attribute vocabulary differs by store and by category, so extraction could not assume one fixed schema across a catalogue.',
    'A model always fills the shape it is given. Absence had to be representable end to end, or the pipeline invents values for the fields it cannot find.',
  ],

  outcomes: [
    {
      value: '',
      label:
        'Attributes that existed only in prose became queryable fields, so a catalogue could be filtered and compared rather than only read.',
      tier: 'capability',
    },
    {
      value: '',
      label:
        'Extraction proposes and validation accepts, so an attribute the source does not support is dropped instead of published as fact.',
      tier: 'capability',
    },
    {
      value: '',
      label:
        'Product families and co-purchase relationships derived from observed sales and view patterns, so cross-sell suggestions rest on behaviour rather than on manual curation.',
      tier: 'capability',
    },
    {
      value: '',
      label:
        'Structured attributes gave product pages machine-readable detail that a description paragraph does not expose.',
      tier: 'capability',
    },
  ],

  // whatDidNotWork absent by design — see the note on the field in schema.ts.
  // Extraction accuracy across an inconsistent catalogue is a rich source of
  // honest answers and this page is weaker without one.

  stack: [
    {
      name: 'n8n',
      rationale:
        'The workflows had to stay visible and adjustable to the client after the engagement ended, which a repository of scripts does not manage.',
    },
    {
      name: 'LLM APIs',
      rationale:
        'Reading unstructured prose is the one part of this that is genuinely a judgement call. Nothing downstream of it is.',
    },
    { name: 'Python' },
    { name: 'Shopify Admin API' },
  ],

  readingMinutes: 5,
};
