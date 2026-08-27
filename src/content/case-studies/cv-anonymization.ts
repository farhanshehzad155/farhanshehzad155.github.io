/**
 * PRD section 8.4.2. Recruitment document pipeline.
 *
 * If FR-PS6 is triggered (Proglo permission refused), this case study becomes
 * the flagship and `featured` flips to true here.
 */

import type { CaseStudy } from '../schema';

export const cvAnonymization: CaseStudy = {
  slug: 'cv-anonymization',
  title: 'CV anonymization pipeline',
  summary:
    'An assisted pipeline that strips identifying details from candidate CVs at volume, using a model to read layout and deterministic rules to do the redaction.',
  metaDescription:
    'How I combined LLM document understanding with deterministic redaction to anonymize candidate CVs at volume, with auditable output and a human review step.',
  organisation: 'Expinder',
  role: 'AI Automation Engineer',
  period: { start: '2026-01', end: 'present' }, // TODO(LI): confirm.
  domain: 'recruitment',
  featured: false,

  // FR-CV1.
  context:
    'Recruitment agencies present candidates to client companies. Before a CV goes out it has to be stripped of the details that identify the candidate, both to support fair hiring and because the agency does not want to be bypassed. TODO(Q7): expand once the permitted level of detail is confirmed.',

  problem:
    'Anonymization is a document task that looks trivial and is not. Names appear in headers, footers, email addresses, file names, referee sections and in the body text. Layouts vary by candidate. Done by hand it is slow, and it is also unreliable, because a human reader skims. A single leaked identifier is not a small error either: it defeats the entire purpose of the exercise. TODO(Q7): confirm this framing.',

  // FR-CV2. This is the architectural point the page exists to make.
  contribution:
    'I designed and built the pipeline: the document understanding step, the deterministic redaction layer, the confidence handling, and the human review around it. The central decision is the split. A language model is good at reading a messy layout and saying where a person is identified. It is not something I would trust to perform the removal, because its output is probabilistic and cannot be audited line by line. So the model interprets, and deterministic rules redact. Every removal is then explainable and repeatable.',

  constraints: [
    'Zero tolerance for a leaked identifier. A pipeline that is right 98 percent of the time is not usable for this, which rules out an approach where the model performs the redaction directly.',
    'Candidate CVs are personal data, so processing location, retention and access all matter (FR-CV6). GDPR applies on the client side of the business.',
    'Volume: the process only earns its keep if it handles a realistic daily intake, not a handful of documents.',
    'TODO(Q7): add the real remaining constraints. Budget, existing vendors and team size are usually the interesting ones.',
  ],

  // FR-CV4: the ~80% metric renders with a section 6.4 footnote or it is
  // removed. It is removed until Q4 supplies the basis. See TRD section 4.5.
  outcomes: [
    {
      value: '',
      label:
        'Cut a slow manual document task down to a review step, with the pipeline doing the reading and the removal.',
      tier: 'capability',
    },
    {
      value: '',
      label:
        'Redaction is deterministic, so every removal can be audited and re-run to the same result.',
      tier: 'capability',
    },
  ],

  whatDidNotWork:
    'TODO(Q7): required (rule CV-2). FR-CV3 also needs covering here or in the approach: what happens on a low-confidence extraction, and what the human review step actually catches. The honest version of this section is the most persuasive part of the page.',

  stack: [
    {
      name: 'Python',
      rationale: 'The document parsing and PDF tooling is there, and the rest of the pipeline was already Python.',
    },
    {
      name: 'LLM document understanding',
      rationale: 'Used for interpretation only. Chosen over a rules-only parser because CV layouts vary too much to enumerate.',
    },
    {
      name: 'Deterministic redaction rules',
      rationale: 'Chosen over model-performed redaction because the output has to be auditable, not merely usually correct.',
    },
  ],

  readingMinutes: 6,
};
