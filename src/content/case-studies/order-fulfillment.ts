/**
 * PRD section 8.4.3. E-commerce fulfillment automation.
 *
 * Drawn from Farhan's own Karmic Seed role bullets, supplied 28 Aug 2026.
 *
 * The ~80% figure from the role bullet is NOT reproduced as an outcome metric:
 * rule CV-1 requires a stated basis for a Tier B claim and none exists yet
 * (PRD Q5).
 */

import type { CaseStudy } from '../schema';

export const orderFulfillment: CaseStudy = {
  slug: 'order-fulfillment',
  title: 'Order fulfillment automation',
  summary:
    'A pipeline that validates incoming orders, picks a carton by volumetric weight, then rates and generates the shipping label across several carriers.',
  metaDescription:
    'Automating e-commerce fulfillment: order validation, volumetric-weight carton selection, and multi-carrier rate and label generation across Amazon and Shopify.',
  organisation: 'Karmic Seed LLC',
  role: 'Automation & Integration Specialist',
  period: { start: '2022-07', end: '2025-02' },
  domain: 'ecommerce',
  featured: false,

  context:
    'A business selling through both Amazon and Shopify, fulfilling its own orders rather than handing them to a marketplace. Every order that arrives has to be checked, packed into a box, rated across carriers, and labelled. None of those steps is difficult. All of them are mandatory, all of them repeat per order, and together they consume the part of the day that could have gone to anything else.',

  problem:
    'Done by hand, an order is a sequence of small decisions that are individually easy and collectively expensive. Is this address deliverable. What will these items actually fit in. Which carrier is cheapest for that box to that destination. Then the label. Multiply by daily volume and it is most of one person’s day, with two failure modes waiting: a parcel shipped to a bad address, and a parcel that quietly cost more than it needed to because somebody grabbed the nearest box.',

  // FR-OF2: carton selection is the technical centrepiece.
  contribution:
    'I built the pipeline end to end: order ingestion and validation across both sales channels, the carton selection step, and the carrier integrations for rating and label generation. The part worth explaining is carton selection. Carriers bill on dimensional weight as well as actual weight, and charge whichever is greater, so the box you choose changes what a shipment costs regardless of what is inside it. Selection has to satisfy several things at once: the items must physically fit, the box has to be one the warehouse actually stocks, the dimensions must stay under the carrier’s oversize thresholds, and among the boxes that qualify it should pick the one that rates cheapest for that destination. That makes it a small packing problem rather than a lookup.',

  constraints: [
    'Two sales channels with different data shapes and different guarantees about address quality, feeding one pipeline.',
    'Carrier APIs are external and they fail. Rate limits, timeouts and bad responses have to be absorbed without dropping a shipment or buying a second label for one that already has one.',
    'A finite set of real carton sizes actually held in the warehouse. The theoretically optimal box does not help if it is not on the shelf.',
    'The output is a physical label on a physical parcel, so a mistake is not a retry. It is a return.',
  ],

  outcomes: [
    {
      value: '',
      label: 'Turned a per-order manual sequence into an automated run with a review step.',
      tier: 'capability',
    },
    {
      value: '',
      label:
        'Carton selection accounts for volumetric weight before rating, so the box choice stops being a hidden cost.',
      tier: 'capability',
    },
    {
      value: '',
      label:
        'One pipeline covers both Amazon and Shopify orders, so fulfillment does not fork by sales channel.',
      tier: 'capability',
    },
  ],

  // whatDidNotWork absent by design — see the note on the field in schema.ts.

  stack: [
    {
      name: 'Python',
      rationale:
        'The work is data transformation and API calls, which is where the tooling and the carrier client libraries already were.',
    },
    { name: 'Amazon Seller Central API' },
    { name: 'Shopify API' },
    {
      name: 'FedEx & DHL APIs',
      rationale:
        'Rating against more than one carrier is the entire point. A single-carrier integration cannot answer the question the pipeline exists to ask.',
    },
    {
      name: 'ShipStation',
      rationale:
        'Covers the carriers and label formats it made no sense to integrate individually, leaving the direct integrations for the ones that mattered.',
    },
  ],

  readingMinutes: 6,
};
