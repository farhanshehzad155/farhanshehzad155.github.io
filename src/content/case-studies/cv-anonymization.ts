/**
 * PRD section 8.4.2. Recruitment document pipeline.
 *
 * Drawn from Farhan's own Expinder role bullets, supplied 28 Aug 2026. Nothing
 * here describes Expinder infrastructure, and no real candidate material of any
 * kind appears (rule C5).
 *
 * The ~80% figure from the role bullet is deliberately NOT reproduced as an
 * outcome metric here: rule CV-1 requires a stated basis for a Tier B claim and
 * none exists yet (PRD Q4). The outcomes below describe the same result without
 * the number.
 *
 * If FR-PS6 is ever triggered (Proglo objects to being named), this case study
 * becomes the flagship and `featured` flips to true here.
 */

import type { CaseStudy } from '../schema';

export const cvAnonymization: CaseStudy = {
  slug: 'cv-anonymization',
  title: 'CV anonymization pipeline',
  summary:
    'An assisted pipeline that strips identifying details from candidate CVs at volume, using a model to read the layout and deterministic rules to do the removal.',
  metaDescription:
    'Combining LLM document understanding with deterministic redaction to anonymize candidate CVs at volume, so every removal is auditable rather than probable.',
  organisation: 'Expinder GmbH',
  role: 'AI Engineer',
  period: { start: '2026-05', end: 'present' },
  domain: 'recruitment',
  featured: false,

  // FR-CV1.
  context:
    'Recruitment agencies present candidates to client companies. Before a CV goes out it has to be stripped of the details that identify the person, partly to support fair hiring by keeping the first read on the work rather than the name, and partly because an agency that hands over full contact details has handed over its business. At any real volume this sits directly between sourcing a candidate and putting them in front of anyone.',

  problem:
    'Anonymization is a document task that looks trivial and is not. A name appears in the heading, in an email address, in the file name, in a footer repeated on every page, in a referee block, and in the middle of a sentence about a previous employer. Layouts vary by candidate, so there is no template to key off. Done by hand it is slow, and it is also unreliable, because a human reader skims and the fifth CV of the afternoon gets less attention than the first. The failure is not graceful either: one missed identifier does not degrade the result, it defeats the entire purpose of the exercise.',

  // FR-CV2. The architectural point the page exists to make.
  contribution:
    'I designed and built the pipeline: the document understanding step, the deterministic redaction layer, the confidence handling, and the human review around it. The central decision is the split between the first two. A language model is genuinely good at reading a messy layout and reporting where a person is identified, including cases a rule would never anticipate. It is not something I would trust to perform the removal, because its output is probabilistic and cannot be checked line by line afterwards. So the model interprets and deterministic rules redact. Every removal is then a rule applied to a location, which means it can be explained, audited, and re-run to exactly the same result.',

  constraints: [
    'Zero tolerance for a leaked identifier. A pipeline that is right 98 percent of the time is not usable here, which rules out any design where the model performs the redaction directly.',
    'Candidate CVs are personal data under GDPR, so where documents are processed, how long they are kept and who can reach them are design constraints rather than afterthoughts.',
    'Volume. The pipeline only earns its place if it handles a realistic daily intake, which rules out anything needing per-document configuration.',
    'The output has to be defensible to a client. If an agency is asked why a particular detail was removed, the answer needs to be a rule, not a model.',
  ],

  outcomes: [
    {
      value: '',
      label:
        'Turned a slow manual document task into a review step, with the pipeline doing the reading and the removal.',
      tier: 'capability',
    },
    {
      value: '',
      label:
        'Redaction is deterministic, so every removal can be explained, audited and re-run to the same result.',
      tier: 'capability',
    },
    {
      value: '',
      label:
        'Assisted, not autonomous. Low-confidence extractions route to a person rather than through to output.',
      tier: 'capability',
    },
  ],

  // whatDidNotWork absent by design — see the note on the field in schema.ts.
  // FR-CV3's failure handling is covered in the approach body instead.

  stack: [
    {
      name: 'Python',
      rationale:
        'The document parsing and PDF tooling lives here, and the rest of the pipeline was already Python.',
    },
    {
      name: 'LLM document understanding',
      rationale:
        'Used for interpretation only. Chosen over a rules-only parser because CV layouts vary more than anyone is going to enumerate.',
    },
    {
      name: 'Deterministic redaction rules',
      rationale:
        'Chosen over model-performed redaction because the output has to be auditable, not merely usually correct.',
    },
    {
      name: 'CRM integration',
      rationale:
        'The anonymized document has to land where recruiters already work, or the pipeline just moves the manual step somewhere else.',
    },
  ],

  readingMinutes: 6,
};
