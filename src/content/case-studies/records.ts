/**
 * The case study records and the queries over them. TRD section 4.4.
 *
 * Deliberately free of MDX imports. `index.ts` adds the approach bodies on top
 * of this module, which means the validator and the unit tests can import the
 * data under plain Node without a bundler that understands `.mdx`.
 */

import type { CaseStudy } from '../schema';

import { progloShipping } from './proglo-shipping';
import { cvAnonymization } from './cv-anonymization';
import { orderFulfillment } from './order-fulfillment';
import { contentPipeline } from './content-pipeline';
import { inventoryPlanning } from './inventory-planning';
import { productDataEnrichment } from './product-data-enrichment';

export const caseStudies: CaseStudy[] = [
  progloShipping,
  cvAnonymization,
  orderFulfillment,
  contentPipeline,
  inventoryPlanning,
  productDataEnrichment,
];

/**
 * FR-W1 ordering: featured first, then reverse-chronologically.
 *
 * This one function backs the work index, the home page selection and
 * previous/next navigation, so those three cannot disagree with each other.
 */
export function getCaseStudies(): CaseStudy[] {
  return [...caseStudies].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.period.start.localeCompare(a.period.start);
  });
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}

/** The flagship: featured and backed by a public artifact (FR-H3, rule CV-6). */
export function getFlagship(): CaseStudy | undefined {
  return caseStudies.find((study) => study.featured && study.liveUrl !== undefined);
}

/** Everything except the flagship, in display order (FR-H4). */
export function getSupportingCaseStudies(): CaseStudy[] {
  const flagship = getFlagship();
  return getCaseStudies().filter((study) => study.slug !== flagship?.slug);
}

/** FR-C10. Wraps around, so every case study has both neighbours. */
export function getAdjacent(slug: string): { previous?: CaseStudy; next?: CaseStudy } {
  const ordered = getCaseStudies();
  const index = ordered.findIndex((study) => study.slug === slug);
  if (index === -1 || ordered.length < 2) return {};

  return {
    previous: ordered[(index - 1 + ordered.length) % ordered.length],
    next: ordered[(index + 1) % ordered.length],
  };
}

/** FR-S3: case studies that used a given tool, matched case-insensitively. */
export function getCaseStudiesUsing(tool: string): CaseStudy[] {
  const needle = tool.toLowerCase();
  return getCaseStudies().filter((study) =>
    study.stack.some((item) => item.name.toLowerCase() === needle),
  );
}
