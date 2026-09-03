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
    'AI automation and integration engineer. I design agents, pipelines and integrations for e-commerce and marketplace operations, recruitment and marketing, from requirements through to the part where it runs unattended.',
  heroSupporting:
    'Python, TypeScript and n8n. Currently building recruitment AI at Expinder, remotely from Lahore.',

  location: 'Lahore, Pakistan',
  timezone: 'UTC+5',

  // FR-G8. Confirmed 28 Aug 2026: open to full-time, part-time and contract,
  // remote. Set this back to false the moment that stops being true — a stale
  // "open to work" chip is worse than none.
  available: true,
  availabilityNote: 'Open to work — full-time, part-time or contract, remote.',

  email: 'farhanshehzad155@gmail.com',

  socials: [
    { label: 'GitHub', url: 'https://github.com/farhanshehzad155' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/farhanshehzad155' },
  ],

  // FR-A7: a professional photograph, or no photograph. No placeholder avatar,
  // no AI-generated portrait. None supplied, so /about renders a text-only
  // header. Add `photo: { src, alt }` here when one exists.
  //
  // No Google Scholar or ORCID profile exists yet, so `socials` carries only
  // the two that do. The publication is reachable by DOI instead, which is the
  // stronger link anyway.
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
 * Opens on the Appendix A.3 draft, then continues from the timeline in
 * roles.ts. Farhan should read the whole thing aloud before launch (PRD
 * section 19.1) and correct anything that is not how he would say it. The
 * facts are his; the phrasing is not yet.
 */
export const aboutBio: string[] = [
  'I started in research. My MPhil work was on text categorisation, specifically on a term weighting method that reduces the bias long documents introduce into classification, which ended up published in Mathematics in 2022. Somewhere in the middle of that I noticed I enjoyed the plumbing more than the models: getting data out of one system, into a shape something else could use, reliably, at three in the morning without anyone watching.',
  'That turned into automation work. It started with e-commerce operations. Order validation, carton selection, shipping labels, inventory planning, price monitoring: the sort of work that is nobody’s job and everybody’s afternoon. Then integration work across whatever a client already ran on, which usually meant some combination of Amazon, Shopify, ShipStation and a carrier or two. Most of it was one problem wearing different clothes. Two systems that were never designed to talk to each other, a person in between doing the translation by hand, and a business quietly paying for that person’s time.',
  'The surface of that work is wider than the word automation suggests. Order and inventory management, fulfillment and shipping, customer and vendor operations, reconciliation, reporting: the operational spine of a business that sells online. Amazon through the Selling Partner API, Amazon Ads, Walmart Marketplace, Shopify and ShipStation are mostly just where that spine happens to live.',
  'Around the point language models became reliable enough to put in a pipeline, the interesting part of the job changed. The question stopped being whether something could be automated and became which part a model should do and which part has to stay deterministic. I care about that line more than almost anything else in my work. In the CV anonymization pipeline I build at Expinder, a model reads the document and reports where a person is identified; deterministic rules perform the actual removal. That split is the design, and it is what makes the result auditable rather than merely usually right.',
  'In between, I spent a stretch on product engineering rather than automation: full-stack work on a live shipping platform in Next.js and TypeScript, including the REST APIs and the OpenAPI contract underneath them. That period is why I would rather agree the interface contract before writing the implementation, and why I am comfortable owning something from architecture through to the part where it runs unattended.',
  'What I like is a problem where the manual process is well understood, expensive and dull, and where the real work is not the automation but deciding what is safe to automate, what stays in front of a person, and how the thing behaves when it fails. I am based in Lahore and work remotely.',
];

/** FR-CT7. Stated on /contact, and it has to be true. */
export const contactResponseExpectation = 'I reply within two working days.';
