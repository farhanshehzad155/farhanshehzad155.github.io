/**
 * FR-A5. Formative work, presented with dates so it reads as history rather
 * than as padding on a thin CV.
 */

import type { Project } from './schema';

export const earlierProjects: Project[] = [
  {
    name: 'Eating Assistive Robot',
    year: '2018',
    description:
      'Final year project. A robotic arm that helps someone eat without use of their hands: computer vision in C++ and Python detects mouth position, a Raspberry Pi drives servo and stepper motors to bring food to it, and Google Assistant handles voice control.',
  },
  // FitnessTime was listed here as a second entry. Removed rather than padded:
  // no description could be written for it that was not invented, and PRD
  // FR-A5 asks for formative work presented honestly, not a longer list. Add it
  // back if there is something real to say about what it was.
];
