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

    // DOI inferred from the MDPI article URL. MDPI mints DOIs as
    // 10.3390/{journal}{volume}{issue}{article}, and the URL
    // /2227-7390/10/21/4124 gives Mathematics, volume 10, issue 21,
    // article 4124 -- so math10214124.
    doi: '10.3390/math10214124',
    url: 'https://www.mdpi.com/2227-7390/10/21/4124',

    plainSummary:
      'Text classifiers usually weight a word by how often it appears in a document, which quietly favours long documents: the same word simply occurs more times in more text. Binned term count groups those counts into bands instead of using them raw, so a long document and a short one that use a word similarly are treated similarly. The paper shows this reduces document-length bias in categorisation.',
  },
];
