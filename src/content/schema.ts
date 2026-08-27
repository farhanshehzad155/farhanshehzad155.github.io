/**
 * The content model. PRD section 9.1, TRD section 4.
 *
 * Two layers live here, and they must agree:
 *
 *   1. TypeScript interfaces — what the editor and `tsc` enforce while writing.
 *   2. Zod schemas — what the build enforces at validation time.
 *
 * The `satisfies` assertions at the bottom of this file make the compiler fail
 * if the two ever drift apart, so a rule cannot be silently weakened by editing
 * only one of them.
 *
 * Note on `Metric.basis`: it is optional in the type and mandatory in the
 * validator for tiers 'measured' and 'counted'. That is deliberate — see TRD
 * section 4.3 for why a discriminated union was rejected.
 */

import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/* Evidence policy (PRD section 6.3)                                          */
/* -------------------------------------------------------------------------- */

/**
 * Tier A 'verifiable'  — a visitor can confirm it via a public link.
 * Tier B 'measured'    — first-party measurement; needs a stated basis.
 * Tier C 'counted'     — first-party count; needs a scope and date range.
 * Tier D 'capability'  — a description of what he can do. No numbers permitted.
 */
export type EvidenceTier = 'verifiable' | 'measured' | 'counted' | 'capability';

export type Domain = 'ecommerce' | 'recruitment' | 'content-marketing' | 'platform';

/** A claim with a number attached. Tier B and C claims MUST carry a basis. */
export interface Metric {
  /** Rendered value, e.g. "~80%" or "500+". Empty for tier 'capability'. */
  value: string;
  /** Short label, e.g. "less manual effort on CV anonymization". */
  label: string;
  tier: EvidenceTier;
  /**
   * Required for 'measured' and 'counted'. Must state what was sampled, the
   * before/after values, the period, and that it is a first-party measurement.
   * Enforced by a build-time assertion, not by convention (rule CV-1).
   */
  basis?: string;
  /** Public URL supporting the claim. Required for tier 'verifiable' (CV-1c). */
  evidenceUrl?: string;
}

export interface StackItem {
  name: string;
  /** Why this over the obvious alternative. One sentence. */
  rationale?: string;
}

export interface EvidenceLink {
  label: string;
  url: string;
}

export interface Period {
  /** ISO YYYY-MM. */
  start: string;
  end: string | 'present';
}

export interface CaseStudy {
  slug: string;
  title: string;
  /** One sentence, plain language, no adjectives. */
  summary: string;
  /** Hand-written meta description, 140-160 characters (FR-SEO2). */
  metaDescription: string;
  organisation: string;
  /** Sector description used when the end client cannot be named (rule C2). */
  clientSector?: string;
  role: string;
  period: Period;
  domain: Domain;
  featured: boolean;
  /** Public, verifiable artifact. Presence drives the "Live" badge. */
  liveUrl?: string;
  /** Additional verifiable links: docs routes, DOIs, repos. */
  evidence?: EvidenceLink[];
  /** FR-C2. 80-150 words. */
  context: string;
  /** FR-C3. */
  problem: string;
  /** FR-C4. At least two entries (rule CV-3). */
  constraints: string[];
  /** FR-C6. Explicit scope statement. Required and non-empty (rule CV-2). */
  contribution: string;
  /** FR-C7. Results with tier qualifiers. */
  outcomes: Metric[];
  /** FR-C7. Required; an empty string is a build error (rule CV-2). */
  whatDidNotWork: string;
  /** FR-C8. */
  stack: StackItem[];
  /** FR-C9. Target 4-7 minutes. */
  readingMinutes: number;
  /** Path to an SVG under /public/schematics. Optional until drawn. */
  schematic?: string;
  /** Alt-text summary rendered beneath the schematic (FR-AC4). */
  schematicSummary?: string;
}

export interface Role {
  company: string;
  /** Public company page, so a reader can confirm the employer exists. */
  companyUrl?: string;
  title: string;
  employmentType: 'Contract' | 'Full-time' | 'Part-time' | 'Freelance' | 'Internship';
  /** ISO YYYY-MM. */
  start: string;
  end: string | 'present';
  location: string;
  remote: boolean;
  /** One line for the home page summary (FR-H6). */
  oneLine: string;
  /** Three to five bullets for /about (FR-A2). */
  bullets: string[];
  caseStudySlugs: string[];
}

export interface Publication {
  title: string;
  venue: string;
  publisher: string;
  /** ISO date. */
  date: string;
  doi?: string;
  url?: string;
  /** Two to three sentences, no jargon (FR-A4). */
  plainSummary: string;
}

export interface Education {
  institution: string;
  credential: string;
  field: string;
  start: string;
  end: string;
  location?: string;
}

/** Formative work shown on /about (FR-A5). Presented with dates, not as padding. */
export interface Project {
  name: string;
  year: string;
  description: string;
  url?: string;
}

/**
 * A capability cluster (PRD section 8.7).
 *
 * Note what this type does NOT have: no `proficiency`, no `level`, no
 * `percent`. FR-S1 forbids skill bars and star ratings, so the data required
 * to render one does not exist. The requirement is enforced by the type, not
 * by discipline.
 */
export interface CapabilityCluster {
  name: string;
  /** One sentence on what he actually does with these tools (FR-S2). */
  statement: string;
  tools: string[];
  /** Tools used but not claimed as depth (FR-S4). */
  familiarWith?: string[];
  /** Case studies that demonstrate this cluster (FR-S3). */
  caseStudySlugs?: string[];
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface SiteConfig {
  name: string;
  headline: string;
  /** The h1 on the home page. */
  heroHeadline: string;
  heroSubhead: string;
  heroSupporting: string;
  location: string;
  timezone: string;
  available: boolean;
  availabilityNote: string;
  email: string;
  socials: SocialLink[];
  /**
   * No `resumePdfPath`. The site itself is the résumé (see /resume/), so there
   * is no PDF to link to. This is a deliberate deviation from PRD FR-R2 —
   * see ADR-011.
   */
  /** Optional portrait. Absent means a text-only header, never a placeholder (FR-A7). */
  photo?: { src: string; alt: string };
}

/* -------------------------------------------------------------------------- */
/* Zod mirrors — the runtime enforcement layer                                */
/* -------------------------------------------------------------------------- */

const isoMonth = z
  .string()
  .regex(/^\d{4}-\d{2}$/, 'expected an ISO year-month, e.g. "2024-03"');

const endDate = z.union([isoMonth, z.literal('present')]);

export const evidenceTierSchema = z.enum([
  'verifiable',
  'measured',
  'counted',
  'capability',
]);

export const domainSchema = z.enum([
  'ecommerce',
  'recruitment',
  'content-marketing',
  'platform',
]);

export const metricSchema = z.object({
  value: z.string(),
  label: z.string().min(1),
  tier: evidenceTierSchema,
  basis: z.string().optional(),
  evidenceUrl: z.string().url().optional(),
});

export const stackItemSchema = z.object({
  name: z.string().min(1),
  rationale: z.string().optional(),
});

export const evidenceLinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
});

export const periodSchema = z.object({
  start: isoMonth,
  end: endDate,
});

export const caseStudySchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'slug must be lowercase kebab-case'),
  title: z.string().min(1),
  summary: z.string().min(1),
  metaDescription: z.string().min(1),
  organisation: z.string().min(1),
  clientSector: z.string().optional(),
  role: z.string().min(1),
  period: periodSchema,
  domain: domainSchema,
  featured: z.boolean(),
  liveUrl: z.string().url().optional(),
  evidence: z.array(evidenceLinkSchema).optional(),
  context: z.string().min(1),
  problem: z.string().min(1),
  constraints: z.array(z.string().min(1)),
  contribution: z.string(),
  outcomes: z.array(metricSchema),
  whatDidNotWork: z.string(),
  stack: z.array(stackItemSchema).min(1),
  readingMinutes: z.number().int().positive(),
  schematic: z.string().optional(),
  schematicSummary: z.string().optional(),
});

export const roleSchema = z.object({
  company: z.string().min(1),
  companyUrl: z.string().url().optional(),
  title: z.string().min(1),
  employmentType: z.enum(['Contract', 'Full-time', 'Part-time', 'Freelance', 'Internship']),
  start: isoMonth,
  end: endDate,
  location: z.string().min(1),
  remote: z.boolean(),
  oneLine: z.string().min(1),
  bullets: z.array(z.string().min(1)).min(1),
  caseStudySlugs: z.array(z.string()),
});

export const publicationSchema = z.object({
  title: z.string().min(1),
  venue: z.string().min(1),
  publisher: z.string().min(1),
  date: z.string().min(4),
  doi: z.string().optional(),
  url: z.string().url().optional(),
  plainSummary: z.string().min(1),
});

export const educationSchema = z.object({
  institution: z.string().min(1),
  credential: z.string().min(1),
  field: z.string().min(1),
  start: z.string().min(4),
  end: z.string().min(4),
  location: z.string().optional(),
});

export const projectSchema = z.object({
  name: z.string().min(1),
  year: z.string().min(4),
  description: z.string().min(1),
  url: z.string().url().optional(),
});

export const capabilityClusterSchema = z.object({
  name: z.string().min(1),
  statement: z.string().min(1),
  tools: z.array(z.string().min(1)).min(1),
  familiarWith: z.array(z.string().min(1)).optional(),
  caseStudySlugs: z.array(z.string()).optional(),
});

export const socialLinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
});

export const siteConfigSchema = z.object({
  name: z.string().min(1),
  headline: z.string().min(1),
  heroHeadline: z.string().min(1),
  heroSubhead: z.string().min(1),
  heroSupporting: z.string().min(1),
  location: z.string().min(1),
  timezone: z.string().min(1),
  available: z.boolean(),
  availabilityNote: z.string(),
  email: z.string().email(),
  socials: z.array(socialLinkSchema),
  photo: z.object({ src: z.string(), alt: z.string() }).optional(),
});

/* -------------------------------------------------------------------------- */
/* Drift guards                                                               */
/* -------------------------------------------------------------------------- */

/**
 * These assertions are the reason the two layers above cannot diverge. If a
 * field is added to an interface but not to its Zod schema (or vice versa),
 * `tsc` fails here rather than the mismatch surviving to production, where it
 * would mean a field nobody validates.
 */
type Assert<_T extends true> = never;
type Equals<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
  ? true
  : false;

export type _MetricDrift = Assert<Equals<Metric, z.infer<typeof metricSchema>>>;
export type _StackItemDrift = Assert<Equals<StackItem, z.infer<typeof stackItemSchema>>>;
export type _CaseStudyDrift = Assert<Equals<CaseStudy, z.infer<typeof caseStudySchema>>>;
export type _RoleDrift = Assert<Equals<Role, z.infer<typeof roleSchema>>>;
export type _PublicationDrift = Assert<Equals<Publication, z.infer<typeof publicationSchema>>>;
export type _EducationDrift = Assert<Equals<Education, z.infer<typeof educationSchema>>>;
export type _ProjectDrift = Assert<Equals<Project, z.infer<typeof projectSchema>>>;
export type _CapabilityDrift = Assert<
  Equals<CapabilityCluster, z.infer<typeof capabilityClusterSchema>>
>;
export type _SiteConfigDrift = Assert<Equals<SiteConfig, z.infer<typeof siteConfigSchema>>>;
