/**
 * The case study registry as the app sees it: the records from `records.ts`
 * plus the MDX approach bodies.
 *
 * Adding a case study is: create the record, create the MDX approach body, add
 * both to `records.ts` and to the map below. Everything else — the route, the
 * sitemap entry, the work index card, the home page card, previous/next
 * navigation — derives from here (NFR-13).
 *
 * The split from `records.ts` exists because this module cannot be imported by
 * plain Node: the `.mdx` imports need the bundler. The validator and the tests
 * import `records.ts` instead.
 */

import type { ComponentType } from 'react';

import ProgloShippingApproach from './approach/proglo-shipping.mdx';
import CvAnonymizationApproach from './approach/cv-anonymization.mdx';
import OrderFulfillmentApproach from './approach/order-fulfillment.mdx';
import ContentPipelineApproach from './approach/content-pipeline.mdx';
import InventoryPlanningApproach from './approach/inventory-planning.mdx';

export * from './records';

/**
 * The FR-C5 approach narrative for each case study, as an MDX component.
 * Statically imported rather than dynamically resolved, so a missing body is a
 * compile error rather than a runtime blank section.
 */
export const approachBodies: Record<string, ComponentType> = {
  'proglo-shipping': ProgloShippingApproach,
  'cv-anonymization': CvAnonymizationApproach,
  'order-fulfillment': OrderFulfillmentApproach,
  'content-pipeline': ContentPipelineApproach,
  'inventory-planning': InventoryPlanningApproach,
};
