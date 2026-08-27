/**
 * Writes git-derived build metadata to `src/generated/build-meta.json`.
 * FR-G7 (footer last-updated date) and FR-SEO8 (sitemap `lastmod`).
 *
 * Per-file dates come from git rather than from the filesystem, because a fresh
 * CI checkout gives every file the same mtime. That would make every page look
 * modified on every deploy, which is worse than no date at all.
 */

import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { caseStudies } from '../src/content/case-studies/records';

interface BuildMeta {
  /** ISO timestamp of the most recent commit, or of the build if git is unavailable. */
  lastCommit: string;
  /** Per-route ISO dates, keyed by route path. */
  routes: Record<string, string>;
  /** True when the dates are real git dates rather than a build-time fallback. */
  fromGit: boolean;
}

const OUTPUT = join(process.cwd(), 'src', 'generated', 'build-meta.json');
const now = new Date().toISOString();

const meta: BuildMeta = {
  lastCommit: git(['log', '-1', '--format=%cI']) ?? now,
  routes: {},
  fromGit: git(['rev-parse', '--is-inside-work-tree']) === 'true',
};

if (!meta.fromGit) {
  console.warn(
    '[build-meta] Not a git repository. Falling back to the build timestamp, so ' +
      'last-updated dates and sitemap lastmod values will be approximate.',
  );
}

if (isShallow()) {
  console.warn(
    '[build-meta] Shallow clone detected. Per-file dates will be wrong or missing. ' +
      'Set `fetch-depth: 0` on actions/checkout (TRD section 8.5).',
  );
}

// Static routes track the file that owns their content.
const staticRoutes: Record<string, string> = {
  '/': 'src/content/site.ts',
  '/work/': 'src/content/case-studies/records.ts',
  '/about/': 'src/content/roles.ts',
  '/resume/': 'src/content/roles.ts',
  '/contact/': 'src/content/site.ts',
  '/stack/': 'src/content/capabilities.ts',
  '/privacy/': 'src/app/privacy/page.tsx',
};

for (const [route, file] of Object.entries(staticRoutes)) {
  meta.routes[route] = fileDate(file);
}

// A case study is modified when either half of it changes, so take the later of
// the record and its approach body.
for (const study of caseStudies) {
  const record = fileDate(`src/content/case-studies/${study.slug}.ts`);
  const approach = fileDate(`src/content/case-studies/approach/${study.slug}.mdx`);
  meta.routes[`/work/${study.slug}/`] = record > approach ? record : approach;
}

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, `${JSON.stringify(meta, null, 2)}\n`, 'utf8');

console.log(
  `[build-meta] Wrote ${Object.keys(meta.routes).length} route dates (fromGit: ${meta.fromGit}).`,
);

/* -------------------------------------------------------------------------- */

function git(args: string[]): string | null {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

function isShallow(): boolean {
  return git(['rev-parse', '--is-shallow-repository']) === 'true';
}

function fileDate(path: string): string {
  const date = git(['log', '-1', '--format=%cI', '--', path]);
  return date && date.length > 0 ? date : now;
}
