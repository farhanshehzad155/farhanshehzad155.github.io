/**
 * FR-A4, FR-H7, FR-SEO6.
 *
 * This is one of only two Tier A artifacts on the whole site, so it earns a
 * prominent block on the home page as well as the research section on /about.
 */

import type { Publication } from './schema';

export const publications: Publication[] = [
  {
    title: 'Binned Term Count: An Alternative to Term Frequency for Text Categorization',
    venue: 'Mathematics',
    publisher: 'MDPI',
    date: '2022-11',

    // TODO(Q11): confirm the DOI and canonical MDPI URL, then fill both in.
    // Until they are present the publication renders without an outbound link
    // rather than with a guessed one. A wrong DOI is worse than no DOI.
    doi: undefined,
    url: undefined,

    plainSummary:
      'Text classifiers usually weight a word by how often it appears in a document, which quietly favours long documents: the same word simply occurs more times in more text. Binned term count groups those counts into bands instead of using them raw, so a long document and a short one that use a word similarly are treated similarly. The paper shows this reduces document-length bias in categorisation.',
  },
];
