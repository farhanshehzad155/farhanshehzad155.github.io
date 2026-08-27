/**
 * Build-time content validation. PRD section 9.2, TRD section 5.
 *
 * This file is the evidence policy expressed as executable rules. It is the
 * mechanism that makes PRD section 6 more than an intention: a metric without a
 * basis is not a style-guide violation here, it is a failed build.
 *
 * Deliberately a pure function over the content modules (ADR-009), so every
 * rule can be unit-tested against a crafted-bad fixture. `scripts/validate-content.ts`
 * is the thin CLI that prints the report and sets the exit code.
 *
 * Rule IDs match the PRD where the PRD defines one (CV-1..CV-6) and continue
 * from there for rules this implementation adds.
 */

import { readdirSync } from 'node:fs';
import { join } from 'node:path';

import { caseStudies } from '../content/case-studies/records';
import { capabilityClusters } from '../content/capabilities';
import { cautionPhrases, denylist } from '../content/denylist';
import { education } from '../content/education';
import { earlierProjects } from '../content/projects';
import { publications } from '../content/publications';
import { roles } from '../content/roles';
import {
  capabilityClusterSchema,
  caseStudySchema,
  educationSchema,
  projectSchema,
  publicationSchema,
  roleSchema,
  siteConfigSchema,
} from '../content/schema';
import { aboutBio, siteConfig, workIndexIntro } from '../content/site';

export interface Issue {
  /** Rule ID, e.g. 'CV-1'. */
  rule: string;
  /** Where the problem is, e.g. "cv-anonymization → outcomes[1].basis". */
  location: string;
  message: string;
}

export interface ValidationReport {
  errors: Issue[];
  warnings: Issue[];
}

const MIN_BASIS_LENGTH = 60;
const APPROACH_DIR = join(process.cwd(), 'src', 'content', 'case-studies', 'approach');

/* -------------------------------------------------------------------------- */

export function validateContent(): ValidationReport {
  const errors: Issue[] = [];
  const warnings: Issue[] = [];

  const error = (rule: string, location: string, message: string) =>
    errors.push({ rule, location, message });
  const warn = (rule: string, location: string, message: string) =>
    warnings.push({ rule, location, message });

  /* CV-0 — every content module parses against its Zod schema ------------- */

  const parse = (schema: { safeParse: (v: unknown) => { success: boolean; error?: unknown } }, value: unknown, location: string) => {
    const result = schema.safeParse(value);
    if (!result.success) {
      const zodError = result.error as { issues?: { path: (string | number)[]; message: string }[] };
      for (const issue of zodError.issues ?? []) {
        error('CV-0', `${location}${issue.path.length ? `.${issue.path.join('.')}` : ''}`, issue.message);
      }
    }
  };

  parse(siteConfigSchema, siteConfig, 'siteConfig');
  caseStudies.forEach((study, i) =>
    parse(caseStudySchema, study, `caseStudies[${i}] (${study.slug ?? 'unknown'})`),
  );
  roles.forEach((role, i) => parse(roleSchema, role, `roles[${i}] (${role.company})`));
  publications.forEach((pub, i) => parse(publicationSchema, pub, `publications[${i}]`));
  education.forEach((ed, i) => parse(educationSchema, ed, `education[${i}]`));
  earlierProjects.forEach((p, i) => parse(projectSchema, p, `earlierProjects[${i}]`));
  capabilityClusters.forEach((c, i) =>
    parse(capabilityClusterSchema, c, `capabilityClusters[${i}] (${c.name})`),
  );

  /* CV-1 / CV-1b / CV-1c — the evidence policy ---------------------------- */

  for (const study of caseStudies) {
    study.outcomes.forEach((metric, i) => {
      const where = `${study.slug} → outcomes[${i}]`;

      // CV-1: Tier B and C claims must carry a basis.
      if (metric.tier === 'measured' || metric.tier === 'counted') {
        const length = metric.basis?.trim().length ?? 0;
        if (length < MIN_BASIS_LENGTH) {
          error(
            'CV-1',
            `${where}.basis`,
            `tier '${metric.tier}' requires a basis of at least ${MIN_BASIS_LENGTH} characters (found ${length}). ` +
              'It must state what was sampled, the before and after values, the period, and that it is a ' +
              'first-party measurement. If that cannot be written honestly, drop the number and use tier ' +
              "'capability' instead. See PRD section 6.4.",
          );
        }
      }

      // CV-1b: Tier D describes a capability. No numbers permitted.
      if (metric.tier === 'capability' && /\d/.test(metric.value)) {
        error(
          'CV-1b',
          `${where}.value`,
          `tier 'capability' permits no numbers, found "${metric.value}". Either supply a basis and ` +
            "promote the claim to 'measured' or 'counted', or remove the number. See PRD section 6.3.",
        );
      }

      // CV-1c: Tier A must carry the link that makes it verifiable.
      if (metric.tier === 'verifiable' && !metric.evidenceUrl) {
        error(
          'CV-1c',
          `${where}.evidenceUrl`,
          "tier 'verifiable' means a visitor can confirm it themselves, so it must carry a public URL.",
        );
      }

      // A basis on a tier that does not need one is a sign the tier is wrong.
      if ((metric.tier === 'verifiable' || metric.tier === 'capability') && metric.basis) {
        warn(
          'CV-1d',
          `${where}.basis`,
          `tier '${metric.tier}' does not use a basis. Check the tier is right.`,
        );
      }
    });

    /* CV-2 — contribution and whatDidNotWork are required ----------------- */

    if (!study.contribution.trim()) {
      error(
        'CV-2',
        `${study.slug} → contribution`,
        'every case study must state explicitly which parts were owned (FR-C6). On a team product this ' +
          'is what stops the page misleading a reader about scope.',
      );
    }
    // CV-2b. A warning rather than an error, because this cannot be inferred
    // from anything — only the person who built the system knows what went
    // wrong — and the alternatives were blocking every build or fabricating it.
    // The section is omitted from the page when absent.
    if (!study.whatDidNotWork?.trim()) {
      warn(
        'CV-2b',
        `${study.slug} → whatDidNotWork`,
        'no "what did not work" section (FR-C7). This is what a hiring engineer looks for, and a case ' +
          'study without it reads as marketing. Blocks release under --strict.',
      );
    }

    /* CV-3 — constraints ------------------------------------------------- */

    if (study.constraints.length < 2) {
      error(
        'CV-3',
        `${study.slug} → constraints`,
        `at least 2 constraints are required, found ${study.constraints.length}. This section is what ` +
          'separates a case study from a blurb (FR-C4).',
      );
    }

    /* CV-9 — reading time target ----------------------------------------- */

    if (study.readingMinutes < 3 || study.readingMinutes > 12) {
      warn(
        'CV-9',
        `${study.slug} → readingMinutes`,
        `${study.readingMinutes} minutes is outside the 4-7 minute target (FR-C9).`,
      );
    }
  }

  /* CV-5 — no end-client names ------------------------------------------- */

  // NOTE: the message names the term and the field but never echoes the
  // surrounding text. CI logs are public on a public repository, and printing
  // the context would leak the very name this rule exists to suppress.
  for (const { location, text } of collectContentStrings()) {
    for (const term of denylist) {
      if (!term.trim()) continue;
      const pattern = new RegExp(`\\b${escapeRegExp(term)}\\b`, 'i');
      if (pattern.test(text)) {
        error(
          'CV-5',
          location,
          `contains a denylisted end-client name ("${term}"). Refer to the client by sector and shape ` +
            'instead (rule C2). The offending text is not printed here on purpose.',
        );
      }
    }

    for (const phrase of cautionPhrases) {
      const pattern = new RegExp(`\\b${escapeRegExp(phrase)}\\b`, 'i');
      if (pattern.test(text)) {
        warn(
          'CV-5b',
          location,
          `uses "${phrase}", which PRD section 6.2 rules out. Prefer a plain verb.`,
        );
      }
    }

    /* CV-10 — outstanding TODO markers ----------------------------------- */

    const todos = text.match(/TODO\([^)]*\)/g);
    if (todos) {
      for (const marker of new Set(todos)) {
        warn('CV-10', location, `unresolved ${marker}. Blocks release under --strict.`);
      }
    }
  }

  /* CV-6 — exactly one flagship ------------------------------------------ */

  const flagships = caseStudies.filter((s) => s.featured && s.liveUrl);
  if (flagships.length !== 1) {
    error(
      'CV-6',
      'caseStudies',
      `exactly one case study must have featured: true and a liveUrl, found ${flagships.length}` +
        (flagships.length ? ` (${flagships.map((s) => s.slug).join(', ')})` : '') +
        '. The flagship carries the credibility load for the site (FR-H3).',
    );
  }

  const featuredWithoutLive = caseStudies.filter((s) => s.featured && !s.liveUrl);
  for (const study of featuredWithoutLive) {
    warn(
      'CV-6b',
      `${study.slug} → featured`,
      'featured but has no liveUrl, so it cannot be the flagship.',
    );
  }

  /* CV-7 — every case study has an approach body, and vice versa ---------- */

  let approachFiles: string[] = [];
  try {
    approachFiles = readdirSync(APPROACH_DIR)
      .filter((f) => f.endsWith('.mdx'))
      .map((f) => f.replace(/\.mdx$/, ''));
  } catch {
    error('CV-7', 'src/content/case-studies/approach', 'directory is missing or unreadable.');
  }

  for (const study of caseStudies) {
    if (!approachFiles.includes(study.slug)) {
      error('CV-7', `${study.slug}`, `no approach body at approach/${study.slug}.mdx (FR-C5).`);
    }
  }
  for (const file of approachFiles) {
    if (!caseStudies.some((s) => s.slug === file)) {
      error('CV-7', `approach/${file}.mdx`, 'orphaned approach body: no case study has this slug.');
    }
  }

  /* CV-8 — slug uniqueness ------------------------------------------------ */

  const seen = new Set<string>();
  for (const study of caseStudies) {
    if (seen.has(study.slug)) {
      error('CV-8', `${study.slug}`, 'duplicate slug. Slugs are URLs and must be unique.');
    }
    seen.add(study.slug);
  }

  /* CV-11 — meta description length (FR-SEO2) ----------------------------- */

  for (const study of caseStudies) {
    const length = study.metaDescription.length;
    if (length < 140 || length > 160) {
      warn(
        'CV-11',
        `${study.slug} → metaDescription`,
        `${length} characters; FR-SEO2 asks for 140-160.`,
      );
    }
  }

  /* CV-12 — cross-references resolve -------------------------------------- */

  const slugs = new Set(caseStudies.map((s) => s.slug));
  for (const role of roles) {
    for (const slug of role.caseStudySlugs) {
      if (!slugs.has(slug)) {
        error('CV-12', `roles (${role.company}) → caseStudySlugs`, `unknown case study "${slug}".`);
      }
    }
  }
  for (const cluster of capabilityClusters) {
    for (const slug of cluster.caseStudySlugs ?? []) {
      if (!slugs.has(slug)) {
        error(
          'CV-12',
          `capabilityClusters (${cluster.name}) → caseStudySlugs`,
          `unknown case study "${slug}".`,
        );
      }
    }
  }

  /* CV-15 — unqualified numbers outside the Metric type -------------------- */

  /*
   * The hole this closes.
   *
   * Rules CV-1 and CV-1b police `Metric` objects, so an outcome cannot carry a
   * number without a basis. But PRD section 6.3 says a Tier B or C claim needs
   * its qualifier ANYWHERE it appears, and a role bullet is just a string — it
   * bypasses the metric machinery entirely.
   *
   * So a bullet reading "reduced effort by approximately 80%" ships unqualified
   * while the equivalent Metric would fail the build. This rule makes that
   * visible on every run rather than leaving the site's strongest claims
   * outside its strictest rule.
   *
   * A warning, not an error: these are the owner's own claims about his own
   * work, and blocking his build over his CV copy would be the wrong call. The
   * fix is to supply the basis (PRD Q4, Q5, Q6), at which point the number
   * belongs in a Metric with a footnote.
   */
  const QUANTIFIED = /\b(?:\d+(?:\.\d+)?\s*(?:%|percent)|\d{2,}\+)/i;

  for (const role of roles) {
    role.bullets.forEach((bullet, i) => {
      const match = bullet.match(QUANTIFIED);
      if (match) {
        warn(
          'CV-15',
          `roles (${role.company}) → bullets[${i}]`,
          `contains an unqualified quantitative claim ("${match[0]}") outside the Metric type, so it ` +
            'ships without the basis PRD section 6.3 requires. Supply what was sampled, the before and ' +
            'after values, and the period, then move the number into the case study outcomes where ' +
            'rule CV-1 can enforce it.',
        );
      }
    });
  }

  /* CV-13 — a Tier A publication claim needs its link (FR-A4, FR-SEO6) ---- */

  publications.forEach((pub, i) => {
    if (!pub.doi && !pub.url) {
      warn(
        'CV-13',
        `publications[${i}]`,
        'no DOI and no URL, so the publication renders without an outbound link. A reader cannot verify ' +
          'it until one is supplied (PRD Q11).',
      );
    }
  });

  return { errors, warnings };
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

interface LocatedString {
  location: string;
  text: string;
}

/**
 * Every author-written string reachable from the content modules, with a
 * human-readable location. The MDX approach bodies are scanned separately by
 * the CLI, which has filesystem access to them as raw text.
 */
function collectContentStrings(): LocatedString[] {
  const out: LocatedString[] = [];

  const push = (location: string, value: unknown) => {
    if (typeof value === 'string' && value.length > 0) out.push({ location, text: value });
  };

  push('siteConfig.heroHeadline', siteConfig.heroHeadline);
  push('siteConfig.heroSubhead', siteConfig.heroSubhead);
  push('siteConfig.heroSupporting', siteConfig.heroSupporting);
  push('siteConfig.headline', siteConfig.headline);
  push('siteConfig.availabilityNote', siteConfig.availabilityNote);
  push('workIndexIntro', workIndexIntro);
  aboutBio.forEach((para, i) => push(`aboutBio[${i}]`, para));

  for (const study of caseStudies) {
    const base = `${study.slug}`;
    push(`${base} → title`, study.title);
    push(`${base} → summary`, study.summary);
    push(`${base} → metaDescription`, study.metaDescription);
    push(`${base} → clientSector`, study.clientSector);
    push(`${base} → context`, study.context);
    push(`${base} → problem`, study.problem);
    push(`${base} → contribution`, study.contribution);
    push(`${base} → whatDidNotWork`, study.whatDidNotWork);
    study.constraints.forEach((c, i) => push(`${base} → constraints[${i}]`, c));
    study.outcomes.forEach((m, i) => {
      push(`${base} → outcomes[${i}].label`, m.label);
      push(`${base} → outcomes[${i}].basis`, m.basis);
    });
    study.stack.forEach((s, i) => push(`${base} → stack[${i}].rationale`, s.rationale));
    push(`${base} → schematicSummary`, study.schematicSummary);
  }

  for (const role of roles) {
    push(`roles (${role.company}) → oneLine`, role.oneLine);
    role.bullets.forEach((b, i) => push(`roles (${role.company}) → bullets[${i}]`, b));
  }

  publications.forEach((p, i) => push(`publications[${i}].plainSummary`, p.plainSummary));
  earlierProjects.forEach((p, i) => push(`earlierProjects[${i}].description`, p.description));
  capabilityClusters.forEach((c) => push(`capabilityClusters (${c.name}) → statement`, c.statement));

  return out;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
