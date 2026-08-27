/**
 * CLI wrapper around the content validator. TRD sections 2.2 and 5.1.
 *
 * Runs in three places: the `prebuild` npm hook, its own CI job, and by hand
 * while writing content. `prebuild` is what makes it unskippable — a bare
 * `npm run build` cannot get past it.
 *
 * Exit codes:
 *   0  clean (warnings may still be printed)
 *   1  at least one error, or, with --strict, at least one warning
 *
 * Usage:
 *   tsx scripts/validate-content.ts
 *   tsx scripts/validate-content.ts --strict   # release gate: warnings fail too
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { cautionPhrases, denylist } from '../src/content/denylist';
import { validateContent, type Issue } from '../src/lib/validate-content';

const strict = process.argv.includes('--strict');

const APPROACH_DIR = join(process.cwd(), 'src', 'content', 'case-studies', 'approach');

const report = validateContent();

// The MDX approach bodies are raw files, so they are scanned here rather than
// in the pure validator, which has no business reading the filesystem beyond a
// directory listing.
scanApproachBodies(report.errors, report.warnings);

print('Errors', report.errors, '\x1b[31m');
print('Warnings', report.warnings, '\x1b[33m');

const errorCount = report.errors.length;
const warningCount = report.warnings.length;

if (errorCount === 0 && warningCount === 0) {
  console.log('\x1b[32m✓ Content validation passed.\x1b[0m');
  process.exit(0);
}

console.log(
  `\nContent validation: \x1b[31m${errorCount} error(s)\x1b[0m, \x1b[33m${warningCount} warning(s)\x1b[0m.`,
);

if (errorCount > 0) {
  console.error(
    '\nBuild blocked. These rules implement the evidence policy in PRD section 6 — ' +
      'the point of the site is that its claims hold up, so a claim that does not is a build failure.',
  );
  process.exit(1);
}

if (strict && warningCount > 0) {
  console.error(
    '\n--strict: warnings are errors for a release build. Resolve the items above, ' +
      'or run without --strict for a development build.',
  );
  process.exit(1);
}

console.log(
  '\n\x1b[33mPassing with warnings.\x1b[0m Run with --strict before release; it will not pass ' +
    'until every TODO above is resolved.',
);
process.exit(0);

/* -------------------------------------------------------------------------- */

function print(heading: string, issues: Issue[], colour: string): void {
  if (issues.length === 0) return;

  console.log(`\n${colour}${heading} (${issues.length})\x1b[0m`);

  const byRule = new Map<string, Issue[]>();
  for (const issue of issues) {
    const existing = byRule.get(issue.rule);
    if (existing) existing.push(issue);
    else byRule.set(issue.rule, [issue]);
  }

  for (const [rule, ruleIssues] of [...byRule.entries()].sort()) {
    console.log(`\n  ${rule}`);
    for (const issue of ruleIssues) {
      console.log(`    ${issue.location}`);
      console.log(`      ${issue.message}`);
    }
  }
}

/**
 * Rules CV-5, CV-5b and CV-10 applied to the raw MDX bodies.
 *
 * As in the validator: a denylist hit names the term and the file but never
 * echoes the surrounding text, because CI logs on a public repository are
 * public.
 */
function scanApproachBodies(errors: Issue[], warnings: Issue[]): void {
  let files: string[];
  try {
    files = readdirSync(APPROACH_DIR).filter((f) => f.endsWith('.mdx'));
  } catch {
    return; // CV-7 in the validator already reports a missing directory.
  }

  for (const file of files) {
    const text = readFileSync(join(APPROACH_DIR, file), 'utf8');
    const location = `approach/${file}`;

    for (const term of denylist) {
      if (!term.trim()) continue;
      if (new RegExp(`\\b${escapeRegExp(term)}\\b`, 'i').test(text)) {
        errors.push({
          rule: 'CV-5',
          location,
          message: `contains a denylisted end-client name ("${term}"). The offending text is not printed here on purpose.`,
        });
      }
    }

    for (const phrase of cautionPhrases) {
      if (new RegExp(`\\b${escapeRegExp(phrase)}\\b`, 'i').test(text)) {
        warnings.push({
          rule: 'CV-5b',
          location,
          message: `uses "${phrase}", which PRD section 6.2 rules out. Prefer a plain verb.`,
        });
      }
    }

    const todos = text.match(/TODO\([^)]*\)/g);
    if (todos) {
      for (const marker of new Set(todos)) {
        warnings.push({
          rule: 'CV-10',
          location,
          message: `unresolved ${marker}. Blocks release under --strict.`,
        });
      }
    }

    // FR-C5 requires the approach section to name a rejected alternative.
    if (!/reject/i.test(text)) {
      warnings.push({
        rule: 'CV-14',
        location,
        message:
          'no rejected alternative found. FR-C5 requires the approach to name at least one ' +
          'alternative and why it was not chosen.',
      });
    }
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
