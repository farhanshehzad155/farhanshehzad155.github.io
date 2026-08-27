/** PRD section 8.4.3. E-commerce fulfillment automation. */

import type { CaseStudy } from '../schema';

export const orderFulfillment: CaseStudy = {
  slug: 'order-fulfillment',
  title: 'Order fulfillment automation',
  summary:
    'A pipeline that validates incoming orders, picks a carton by volumetric weight, then rates and labels the shipment across several carriers.',
  metaDescription:
    'Automating e-commerce fulfillment: order validation, volumetric-weight carton selection, and multi-carrier rate and label generation across Amazon and Shopify.',
  organisation: 'Karmic Seed',
  // Rule C2: the end client is referred to by sector only (FR-OF5).
  clientSector: 'A US wellness brand shipping via Amazon FBM and Shopify',
  role: 'Automation Engineer',
  period: { start: '2022-01', end: '2024-01' }, // TODO(LI): confirm.
  domain: 'ecommerce',
  featured: false,

  context:
    'A brand selling through both Amazon and its own Shopify storefront, fulfilling orders itself rather than through Amazon. Every order has to be checked, packed into a box, rated across carriers, and labelled. TODO(content): expand to 80-150 words.',

  problem:
    'Done by hand, each order is a sequence of small decisions that are individually easy and collectively expensive. Is this address valid. What will this fit in. Which carrier is cheapest for this box to this destination. Then the label. Multiply that by daily order volume and it becomes most of one person day, with the cost of a mistake being a mis-shipped or overpriced parcel.',

  // FR-OF2: the carton-selection logic is the technical centrepiece.
  contribution:
    'I built the pipeline end to end: order ingestion and validation, the carton selection step, and the carrier integrations for rating and label generation. The interesting part is carton selection. Carriers bill on dimensional (volumetric) weight as well as actual weight, so the box you choose changes what a shipment costs regardless of what is inside it. The selection has to fit the items, avoid an oversize surcharge, and not waste volume, which makes it a small packing problem rather than a lookup.',

  constraints: [
    'Two order sources with different data shapes and different guarantees about address quality.',
    'Carrier APIs are external and they fail. Rate limits, timeouts and bad responses all have to be absorbed without dropping or duplicating a shipment.',
    'A finite set of real carton sizes actually held in the warehouse. The optimal box does not help if it is not on the shelf.',
    'TODO(content): add the budget, vendor and team-size constraints.',
  ],

  // FR-OF3: the ~80% claim needs its basis (Q5) or it does not appear.
  outcomes: [
    {
      value: '',
      label: 'Turned a per-order manual sequence into a reviewed automated run.',
      tier: 'capability',
    },
    {
      value: '',
      label:
        'Carton selection accounts for volumetric weight before rating, so the box choice stops being a hidden cost.',
      tier: 'capability',
    },
  ],

  whatDidNotWork:
    'TODO(content): required (rule CV-2). FR-OF4 also needs covering: multi-item orders, oversized items, address validation failures, and carrier API errors and retries. The retry story in particular is where this kind of pipeline usually earns its scars.',

  stack: [
    {
      name: 'Python',
      rationale: 'The pipeline is data transformation and API calls, and the carrier client libraries were straightforward here.',
    },
    { name: 'Shopify API' },
    { name: 'Amazon selling APIs' },
    {
      name: 'FedEx / DHL APIs',
      rationale: 'Rating against more than one carrier is the point. A single-carrier integration cannot answer the cost question.',
    },
    {
      name: 'ShipStation',
      rationale: 'TODO: one line on why this was used rather than going direct to every carrier.',
    },
  ],

  readingMinutes: 6,
};
