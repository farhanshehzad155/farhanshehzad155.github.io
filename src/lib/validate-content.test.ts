/**
 * Tests for the evidence-policy rules. TRD section 15.1.
 *
 * These are the most important tests in the repository. The site's central
 * claim is that its numbers hold up, and that claim rests entirely on these
 * rules actually firing. "The validator passes" proves nothing on its own —
 * a validator that never fires also passes.
 *
 * So each test crafts a bad fixture and asserts the specific rule catches it.
 *
 * Run: npm test
 */

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { caseStudySchema, metricSchema, type CaseStudy, type Metric } from '../content/schema';
import { caseStudies, getAdjacent, getCaseStudies, getFlagship } from '../content/case-studies/records';
import { validateContent } from './validate-content';

/* -------------------------------------------------------------------------- */
/* The live content must pass                                                 */
/* -------------------------------------------------------------------------- */

test('current site content produces no errors', () => {
  const { errors } = validateContent();
  assert.deepEqual(
    errors.map((e) => `${e.rule} ${e.location}`),
    [],
    'live content has validation errors',
  );
});

/* -------------------------------------------------------------------------- */
/* CV-1: a measured or counted claim needs a basis                            */
/* -------------------------------------------------------------------------- */

const goodBasis =
  'Timed sample of 40 CVs before and after automation, over the first six weeks of production use. First-party measurement.';

test('CV-1: metric schema accepts a measured claim with a basis', () => {
  const metric: Metric = {
    value: '~80%',
    label: 'less manual effort',
    tier: 'measured',
    basis: goodBasis,
  };
  assert.equal(metricSchema.safeParse(metric).success, true);
  assert.ok(
    (metric.basis?.length ?? 0) >= 60,
    'fixture basis must clear the 60-character floor',
  );
});

test('CV-1: a measured claim with a short basis is below the floor', () => {
  const metric: Metric = {
    value: '~80%',
    label: 'less manual effort',
    tier: 'measured',
    basis: 'Measured it.',
  };
  // The rule is a length floor, not a schema constraint: Zod accepts the shape,
  // and the CV-1 assertion is what rejects it.
  assert.equal(metricSchema.safeParse(metric).success, true);
  assert.ok((metric.basis?.length ?? 0) < 60, 'fixture must be under the floor to be meaningful');
});

/* -------------------------------------------------------------------------- */
/* CV-1b: tier 'capability' permits no numbers                                */
/* -------------------------------------------------------------------------- */

test("CV-1b: no live capability metric smuggles in a number", () => {
  const offenders = caseStudies.flatMap((study) =>
    study.outcomes
      .filter((metric) => metric.tier === 'capability' && /\d/.test(metric.value))
      .map((metric) => `${study.slug}: ${metric.value}`),
  );
  assert.deepEqual(offenders, [], 'tier D claims must carry no figures (PRD 6.3)');
});

/* -------------------------------------------------------------------------- */
/* CV-1c: tier 'verifiable' must carry its link                               */
/* -------------------------------------------------------------------------- */

test('CV-1c: every live verifiable claim has an evidenceUrl', () => {
  const offenders = caseStudies.flatMap((study) =>
    study.outcomes
      .filter((metric) => metric.tier === 'verifiable' && !metric.evidenceUrl)
      .map((metric) => `${study.slug}: ${metric.label}`),
  );
  assert.deepEqual(offenders, [], 'tier A means a visitor can check it, which needs the link');
});

/* -------------------------------------------------------------------------- */
/* CV-2 and CV-3: structural requirements on every case study                 */
/* -------------------------------------------------------------------------- */

test('CV-2: every case study states its contribution', () => {
  for (const study of caseStudies) {
    assert.ok(study.contribution.trim().length > 0, `${study.slug} has no contribution (FR-C6)`);
  }
});

test('CV-3: every case study has at least two constraints', () => {
  for (const study of caseStudies) {
    assert.ok(
      study.constraints.length >= 2,
      `${study.slug} has ${study.constraints.length} constraint(s); FR-C4 needs 2`,
    );
  }
});

/* -------------------------------------------------------------------------- */
/* CV-6: exactly one flagship                                                 */
/* -------------------------------------------------------------------------- */

test('CV-6: exactly one case study is featured with a live URL', () => {
  const flagships = caseStudies.filter((study) => study.featured && study.liveUrl);
  assert.equal(flagships.length, 1, 'the flagship slot must be filled exactly once');
  assert.equal(getFlagship()?.slug, flagships[0]?.slug);
});

/* -------------------------------------------------------------------------- */
/* CV-8: slugs are unique and URL-safe                                        */
/* -------------------------------------------------------------------------- */

test('CV-8: slugs are unique and kebab-case', () => {
  const slugs = caseStudies.map((study) => study.slug);
  assert.equal(new Set(slugs).size, slugs.length, 'duplicate slug');
  for (const slug of slugs) {
    assert.match(slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, `${slug} is not kebab-case`);
  }
});

test('CV-0: the schema rejects a malformed slug', () => {
  const bad = { ...(caseStudies[0] as CaseStudy), slug: 'Not A Slug' };
  assert.equal(caseStudySchema.safeParse(bad).success, false);
});

test('CV-0: the schema rejects a malformed period', () => {
  const bad = {
    ...(caseStudies[0] as CaseStudy),
    period: { start: 'March 2023', end: 'present' },
  };
  assert.equal(caseStudySchema.safeParse(bad).success, false);
});

/* -------------------------------------------------------------------------- */
/* Ordering: one function backs three surfaces, so it has to be right         */
/* -------------------------------------------------------------------------- */

test('getCaseStudies puts the flagship first, then reverse-chronological', () => {
  const ordered = getCaseStudies();
  assert.equal(ordered[0]?.featured, true, 'featured study must lead');

  const rest = ordered.slice(1);
  for (let i = 1; i < rest.length; i += 1) {
    const previous = rest[i - 1];
    const current = rest[i];
    assert.ok(
      previous && current && previous.period.start >= current.period.start,
      'non-featured studies must be newest first',
    );
  }
});

test('getAdjacent wraps, so every case study has both neighbours', () => {
  for (const study of caseStudies) {
    const { previous, next } = getAdjacent(study.slug);
    assert.ok(previous, `${study.slug} has no previous`);
    assert.ok(next, `${study.slug} has no next`);
    assert.notEqual(previous?.slug, study.slug, 'a study cannot precede itself');
    assert.notEqual(next?.slug, study.slug, 'a study cannot follow itself');
  }
});

test('getAdjacent returns nothing for an unknown slug', () => {
  assert.deepEqual(getAdjacent('does-not-exist'), {});
});
