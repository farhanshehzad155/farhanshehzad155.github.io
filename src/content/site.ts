/**
 * Site-wide configuration and the long-form copy that is not tied to a single
 * component. PRD section 9.1 (`SiteConfig`) and Appendix A (copy deck).
 */

import type { SiteConfig } from './schema';

export const siteConfig: SiteConfig = {
  name: 'Farhan Shehzad',
  headline: 'AI Automation & Integration Engineer',

  // Appendix A.1, recommended option 1 for the h1.
  heroHeadline: 'I build the systems that do the repetitive work.',
  heroSubhead:
    'AI automation and integration engineer. I design agents, pipelines and integrations for recruitment, e-commerce and marketing operations, from requirements through to the part where it runs unattended.',
  heroSupporting:
    'Python, TypeScript and Go. Currently building recruitment AI at Expinder, remotely from Lahore.',

  location: 'Lahore, Pakistan',
  timezone: 'UTC+5',

  // FR-G8. TODO(Q12): confirm what he is actually open to before setting this
  // to true. Until then the chip does not render, which is better than
  // advertising an availability that may not be accurate.
  available: false,
  availabilityNote: 'Open to AI engineering and automation roles, remote or hybrid.',

  email: 'farhanshehzad155@gmail.com',

  socials: [
    { label: 'GitHub', url: 'https://github.com/farhanshehzad155' },
    // TODO(Q11): confirm the exact LinkedIn vanity URL and add ORCID / Google
    // Scholar, which FR-SEO5 needs for the Person `sameAs` array.
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/farhanshehzad155' },
  ],

  resumePdfPath: '/farhan-shehzad-resume.pdf',

  // FR-A7: a professional photograph, or no photograph. No placeholder avatar.
  // TODO(Q13): supply a photo or leave this undefined permanently.
};

/**
 * FR-W4. Sets expectations honestly at the top of the work index: most of the
 * work is internal to client systems and is therefore described rather than
 * demonstrated. Appendix A.2.
 */
export const workIndexIntro =
  'Most of what I build lives inside other companies systems: internal pipelines, private integrations, workflows running against client accounts. There is no public URL for any of it. So these are written as case studies rather than demos. The problem, what constrained the solution, what I decided and why, and what actually changed. Where something is public, I have linked it.';

/**
 * FR-A1. 300-450 words of first-person prose for /about.
 *
 * TODO(content): the opening two paragraphs below are the Appendix A.3 draft.
 * The remainder needs writing before launch, and the whole thing needs reading
 * aloud (PRD section 19.1) to check it does not read as machine-written.
 */
export const aboutBio: string[] = [
  'I started in research. My MPhil work was on text categorisation, specifically on a term weighting method that reduces the bias long documents introduce into classification, which ended up published in Mathematics in 2022. Somewhere in the middle of that I noticed I enjoyed the plumbing more than the models: getting data out of one system, into a shape something else could use, reliably, at three in the morning without anyone watching.',
  'That turned into five years of automation work. TODO(content): continue from the Appendix A.3 draft. Cover the move from full-stack work into AI automation, and what kind of problem is actually interesting to solve.',
];

/** FR-CT7. Stated on /contact, and it has to be true. */
export const contactResponseExpectation = 'I reply within two working days.';
