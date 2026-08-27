/**
 * FR-A3. These two entries are stated explicitly in the PRD, so unlike the
 * employment dates they are not placeholders.
 */

import type { Education } from './schema';

export const education: Education[] = [
  {
    institution: 'University of Gujrat',
    credential: 'MPhil',
    field: 'Computer Science',
    start: '2019',
    end: '2022',
    location: 'Gujrat, Pakistan',
  },
  {
    institution: 'University of the Punjab (PUCIT)',
    credential: 'BS',
    field: 'Computer Science & IT',
    start: '2014',
    end: '2018',
    location: 'Lahore, Pakistan',
  },
];
