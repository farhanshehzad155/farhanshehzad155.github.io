# Technical Requirements Document
## Personal Engineering Portfolio — Farhan Shehzad

| Field | Value |
|---|---|
| Document | Technical Requirements Document (TRD) |
| Derived from | `docs/PRD-portfolio-farhan-shehzad.md` v1.0 |
| Document version | 1.0 |
| Status | Draft — implementation in progress |
| Date | 28 August 2026 |
| Author | Farhan Shehzad |
| Repository | `github.com/farhanshehzad155/farhanshehzad155.github.io` (public) |
| Production URL | `https://farhanshehzad155.github.io` |
| Runtime | None. Static export, served by the GitHub Pages CDN. |

---

## 1. Scope, purpose, and traceability

### 1.1 Purpose

The PRD says *what* the site must be and *why*. This document says *how*, at the level of detail a second engineer would need to build it without asking questions. Where the PRD states a requirement in product language, this document names the module, the type, the build step, or the CI gate that satisfies it.

Two things make this project unusual, and both drive the technical design more than the visual brief does:

1. **The evidence policy (PRD §6) has to be machine-enforced.** The site's central claim is that its author is careful with the truth. A convention cannot enforce that; a build that fails on an unsupported number can. Section 5 of this document is therefore the most load-bearing part of the architecture, not a lint step bolted on at the end.
2. **There is no server anywhere.** Static export to GitHub Pages removes runtime rendering, image optimisation, HTTP headers, and API routes from the toolbox. Every capability the PRD asks for that would normally use one of those has to be relocated to build time. Sections 9, 10, and 13 exist for exactly that reason.

### 1.2 Scope of this document

In scope: architecture, technology selection, content model, build pipeline, validation, design-system implementation, routing, SEO, accessibility, performance, security, CI/CD, testing, repository standards, and the deployment runbook.

Out of scope: editorial content (PRD §6, Appendix A), visual design decisions already fixed by PRD §10, and the resolution of the fourteen open questions in PRD §22 — those are inputs this document consumes rather than produces.

### 1.3 Requirement traceability matrix

Every PRD requirement ID maps to a place in the codebase. `P` is the PRD priority.

#### Global (PRD §8.1)

| PRD ID | P | Implemented by | TRD § |
|---|---|---|---|
| FR-G1 | P0 | `output: 'export'`; all pages are server components with zero fetch | 2, 7 |
| FR-G2 | P0 | `src/lib/seo.ts` → `buildMetadata()`; `scripts/generate-og.ts` | 8, 9 |
| FR-G3 | P0 | `src/app/layout.tsx` skip link, first focusable node | 11 |
| FR-G4 | P0 | `src/components/ThemeScript.tsx` (inline, pre-paint) + `ThemeToggle.tsx` | 6.4 |
| FR-G5 | P0 | Global `prefers-reduced-motion: reduce` kill switch in `globals.css` | 6.6 |
| FR-G6 | P0 | `src/components/ExternalLink.tsx` — single choke point for outbound links | 11 |
| FR-G7 | P1 | `scripts/build-meta.ts` writes the git commit date into `src/generated/build-meta.json` | 8.5 |
| FR-G8 | P1 | `siteConfig.available` boolean → `AvailabilityChip` | 4.2 |
| FR-G9 | P0 | `src/components/CopyEmail.tsx` with an `aria-live` region | 11 |
| FR-G10 | P0 | `src/app/not-found.tsx` | 7.3 |

#### Home (PRD §8.2)

| PRD ID | P | Implemented by | TRD § |
|---|---|---|---|
| FR-H1 | P0 | `src/app/page.tsx` → `Hero` | 7.2 |
| FR-H2 | P0 | `src/components/ManifestStrip.tsx` — full content in HTML, CSS-only stagger | 6.5 |
| FR-H3 | P0 | `CaseStudyCard` variant `flagship`, driven by `featured && liveUrl` | 6.7 |
| FR-H4 | P0 | `CaseStudyCard` default variant over `getCaseStudies()` | 6.7 |
| FR-H5 | P0 | `src/content/capabilities.ts` → `Capabilities` | 4.2 |
| FR-H6 | P1 | `src/content/roles.ts` → `ExperienceSummary` | 4.2 |
| FR-H7 | P1 | `src/content/publications.ts` → `ResearchBlock` | 4.2 |
| FR-H8 | P0 | `ClosingCta` | 7.2 |
| FR-H9 | P0 | Enforced structurally: only `ThemeToggle` and `CopyEmail` are client components | 12.2 |

#### Work index and case studies (PRD §8.3, §8.4)

| PRD ID | P | Implemented by | TRD § |
|---|---|---|---|
| FR-W1 | P0 | `getCaseStudies()` sort: `featured` desc, then `period.start` desc | 4.4 |
| FR-W2 | P1 | URL-hash + `:target` CSS filtering; the unfiltered list is the no-JS default | 7.4 |
| FR-W3 | P0 | `CaseStudyCard` fields; `Live` badge from `liveUrl` presence | 6.7 |
| FR-W4 | P0 | `src/content/site.ts` → `workIndexIntro` | 4.2 |
| FR-C1..C8 | P0/P1 | `src/app/work/[slug]/page.tsx` renders the eight-part template in fixed order | 7.5 |
| FR-C9 | P2 | `CaseStudy.readingMinutes` in the metadata rail | 7.5 |
| FR-C10 | P1 | `PrevNextNav` derived from the sorted case-study list | 7.5 |
| FR-PS1..PS6 | P0 | Content-level, in `src/content/case-studies/proglo-shipping.ts`; the FR-PS6 fallback is a documented content edit, not a code path | 4.5 |
| FR-CV1..CV6 | P0/P1 | Content-level, `cv-anonymization.*` | 4.5 |
| FR-OF1..OF5 | P0/P1 | Content-level, `order-fulfillment.*` | 4.5 |
| FR-CP1..CP4 | P0/P1 | Content-level, `content-pipeline.*` | 4.5 |
| FR-IP1..IP3 | P0/P1 | Content-level, `inventory-planning.*` | 4.5 |

#### About, résumé, stack, contact (PRD §8.5–8.8)

| PRD ID | P | Implemented by | TRD § |
|---|---|---|---|
| FR-A1..A7 | P0/P1 | `src/app/about/page.tsx` over `roles.ts`, `education.ts`, `publications.ts`, `projects.ts` | 7.6 |
| FR-R1 | P0 | `src/app/resume/page.tsx` renders from the same content modules — no second copy exists | 7.7 |
| FR-R2 | P0 | **Dropped — see ADR-011.** No PDF; the site is the résumé | 10.4 |
| FR-R3 | P1 | `@media print` block in `globals.css`. Promoted to P0: it is now the only route to a file | 6.8 |
| FR-R4 | P1 | **Dropped with FR-R2** — nothing to generate | 10.4 |
| FR-S1..S4 | P0/P1 | `src/content/capabilities.ts` — the type has no `proficiency` field, so FR-S1 cannot be violated | 4.2 |
| FR-CT1..CT8 | P0/P1 | `src/app/contact/page.tsx` + `src/components/ContactForm.tsx` | 7.8 |

#### Content validation (PRD §9.2)

| PRD ID | Implemented by | TRD § |
|---|---|---|
| CV-1..CV-3, CV-5, CV-6 | `src/lib/validate-content.ts`, run by `scripts/validate-content.ts` in `prebuild` and in CI | 5 |
| CV-4 | `scripts/check-links.ts`, run in CI only (needs network) | 5.3, 14 |

#### Non-functional, SEO, analytics, accessibility, privacy (PRD §12–16)

| PRD ID | Implemented by | TRD § |
|---|---|---|
| NFR-1..NFR-5, NFR-10 | `lighthouserc.json` assertions, enforced in CI | 12 |
| NFR-6 | Server-component-by-default architecture plus a bundle-size assertion | 12.2 |
| NFR-7 | `next/font` build-time self-hosting, three families | 10.3 |
| NFR-8 | Browserslist in `package.json`; no polyfills beyond Next.js defaults | 3.5 |
| NFR-9 | No content sits behind a client component; verified by a JS-disabled CI pass | 12.3 |
| NFR-11 | axe-core CI gate plus a manual screen-reader pass | 11, 15 |
| NFR-12, NFR-13 | Architectural; no infrastructure exists to manage | 2 |
| FR-SEO1..SEO11 | `src/lib/seo.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `public/llms.txt` | 8 |
| FR-AN1..AN5 | Analytics provider decision deferred; the integration point is specified | 13.4 |
| FR-AC1..AC11 | Component-level; see the per-ID table | 11 |
| FR-P1..P8 | `/privacy` route, meta CSP, Dependabot, `npm audit` gate, licence split | 13 |

---

## 2. System architecture

### 2.1 Topology

There is no runtime. The system is a build pipeline that emits a directory of files, and a CDN that serves them.

```
  Author                Build (GitHub Actions, ephemeral)              Runtime
  ------                --------------------------------              -------

  TypeScript     +--> validate-content --+  (fails the build on a §9.2 breach)
  content        |                       |
  modules   -----+--> build-meta --------+
                 |                       +--> next build --> out/ --> GitHub Pages CDN
  MDX case  -----+--> optimise-images ---+    (output:        |        (static files,
  study bodies   |                       |     'export')      |         HTTPS, no origin)
                 +--> generate-og -------+                    |
                                                              v
                                           axe . Lighthouse . link check (gates)
```

Consequences worth stating explicitly, because they shape everything downstream:

- **No API routes, no server actions, no middleware, no ISR.** Anything dynamic is either pushed to build time or delegated to a third party with a public key (the contact form).
- **No HTTP response headers.** GitHub Pages does not let us set them. CSP is therefore delivered by `<meta http-equiv>` (§13.2), which is weaker but is the only option available.
- **No image optimisation service.** `next/image` optimisation requires a server, so images are pre-processed at build time and served as plain files (§10.2).
- **The failure mode is a red build, never a broken page.** Content errors surface in CI, not in production. This is the property that makes the evidence policy credible.

### 2.2 Build pipeline stages

| # | Stage | Command | Blocking | Purpose |
|---|---|---|---|---|
| 1 | Content validation | `npm run validate:content` | Yes | PRD §9.2 rules CV-1..CV-3, CV-5, CV-6 |
| 2 | Build metadata | `npm run build:meta` | Yes | Git commit date for FR-G7 and sitemap `lastmod` |
| 3 | Image optimisation | `npm run build:images` | Yes | AVIF/WebP derivatives plus intrinsic dimensions |
| 4 | OG image generation | `npm run build:og` | Yes | One 1200x630 PNG per route (FR-SEO4) |
| 5 | Static export | `next build` | Yes | Emits `out/` |
| 6 | Post-build checks | axe, Lighthouse, links | Yes (CI) | PRD §18.1 gates |

Stages 1–4 run in the `prebuild` npm lifecycle hook, so a bare `npm run build` cannot skip them. That is deliberate: a gate that can be bypassed by running the wrong command is not a gate.

### 2.3 Data flow

Content is a compile-time constant. `src/content/*.ts` modules are imported directly by server components; TypeScript resolves them, the bundler inlines them, and the rendered HTML contains the result. There is no fetch, no client-side hydration of content, and no environment-dependent branch in any render path.

The single environment-dependent value in the entire system is `SITE_URL`, and it is a constant in `src/lib/constants.ts` rather than an environment variable — precisely so that a misconfigured environment cannot produce a build with broken canonical URLs.

---

## 3. Technology decisions

### 3.1 Selected stack

| Layer | Choice | Version | Rationale |
|---|---|---|---|
| Framework | Next.js, App Router, `output: 'export'` | 15.x | PRD ADR-001: the site is a work sample for a claimed skill |
| Language | TypeScript, `strict: true` | 5.x | PRD §17; also the mechanism behind ADR-003 |
| UI runtime | React server components | 19.x | Content pages ship no component JavaScript at all |
| Styling | Tailwind CSS v4, CSS-first `@theme` | 4.x | No `tailwind.config.js`; tokens live in CSS beside the design system |
| Content bodies | MDX via `@next/mdx` | — | Prose in prose format, typed metadata in TypeScript |
| Schema validation | Zod | 3.x | Runtime mirror of the compile-time types |
| OG images | `satori` + `@resvg/resvg-js` | — | Build-time PNG generation without a server (ADR-005) |
| Image processing | `sharp` | — | Build-time AVIF/WebP derivatives |
| Linting | ESLint flat config, `@typescript-eslint`, `eslint-plugin-jsx-a11y` | 9.x | PRD §17 |
| Script runner | `tsx` | — | Runs the TypeScript build scripts without a separate compile step |

Production dependency count target: **fewer than 15** (PRD §11.2). Current plan: `next`, `react`, `react-dom`, `zod`, plus four MDX/remark/rehype packages — eight. Everything else is a devDependency, which does not ship.

### 3.2 Explicitly excluded

UI component libraries, animation libraries, icon packs, state management, form libraries, analytics SDKs, and CSS-in-JS. Each would either add client JavaScript against NFR-6 or add a dependency whose value the site does not need. Where an icon is required it is an inlined SVG in the component that uses it.

### 3.3 Configuration decisions

`next.config.mjs`:

| Option | Value | Why |
|---|---|---|
| `output` | `'export'` | No runtime (PRD §11.1) |
| `trailingSlash` | `true` | ADR-008 — Pages resolves `/work/` to `work/index.html` |
| `images.unoptimized` | `true` | Required under export; optimisation moves to build time |
| `basePath` | *(unset)* | ADR-007 — a user site serves from the domain root |
| `reactStrictMode` | `true` | Standard |
| `eslint.ignoreDuringBuilds` | `false` | Lint failures must fail the build |
| `typescript.ignoreBuildErrors` | `false` | Same |

MDX is wired through `createMDX()` with `remark-gfm`, `rehype-slug`, and `rehype-autolink-headings`. Autolinked headings use `behavior: 'wrap'` with a visually-hidden label, so the anchor is announced meaningfully rather than as a bare `#`.

### 3.4 Node and package manager

Node 22 LTS, pinned in `.nvmrc` and in both workflows. Local development is on Node 24.15, which works, but CI pins the LTS so a build is reproducible. npm is the package manager; `package-lock.json` is committed and CI uses `npm ci`.

### 3.5 Browser support

`browserslist` in `package.json`: the last two versions of Chrome, Safari, Firefox and Edge, plus iOS Safari ≥ 16 and Android Chrome ≥ 110 (NFR-8). This drives both the SWC transpile target and Tailwind's Lightning CSS output. No manual polyfills are added; if a feature is not supported by that matrix, it is not used.

---

## 4. Content architecture

### 4.1 Principle

Content is code. It is typed, compiled, and validated, and it fails the build when wrong. This is PRD ADR-003 taken literally: the evidence policy has teeth only because a metric without a basis is an assertion failure, not a style-guide violation.

### 4.2 Module layout

| Module | Exports | Consumed by |
|---|---|---|
| `src/content/schema.ts` | All interfaces from PRD §9.1 plus their Zod mirrors | Everything |
| `src/content/site.ts` | `siteConfig: SiteConfig`, `workIndexIntro`, `aboutBio` | Layout, home, work, about |
| `src/content/roles.ts` | `roles: Role[]` | Home, about, résumé |
| `src/content/education.ts` | `education: Education[]` | About, résumé |
| `src/content/publications.ts` | `publications: Publication[]` | Home, about, résumé, JSON-LD |
| `src/content/projects.ts` | `earlierProjects: Project[]` | About (FR-A5) |
| `src/content/capabilities.ts` | `capabilityClusters: CapabilityCluster[]` | Home, `/stack` |
| `src/content/denylist.ts` | `denylist: string[]` | Validator only |
| `src/content/case-studies/index.ts` | `caseStudies: CaseStudy[]`, `getCaseStudy(slug)` | Work index, case study route |

`CapabilityCluster` deliberately has no `proficiency`, `level`, or `percent` field. FR-S1 ("no proficiency percentages, star ratings, or progress bars") is enforced by the type system rather than by discipline — the data needed to render a skill bar does not exist.

### 4.3 The metric type is the core of the design

```ts
export type EvidenceTier = 'verifiable' | 'measured' | 'counted' | 'capability';

export interface Metric {
  value: string;          // "~80%", "500+"
  label: string;
  tier: EvidenceTier;
  basis?: string;         // REQUIRED for 'measured' | 'counted' — enforced at build time
  evidenceUrl?: string;   // for 'verifiable'
}
```

`basis` is optional in the interface and mandatory in the validator. The alternative — a discriminated union making `basis` structurally required for two of the four tiers — was considered and rejected: it produces worse error messages ("no overload matches this call") than a validator that can say

> `cv-anonymization` → outcomes[1]: tier 'measured' requires a basis of at least 60 characters (found 0). See PRD §6.4.

Error quality matters here because the person hitting the error is the author, mid-edit, and the message has to teach the policy rather than merely block.

`MetricWithBasis` (§6.7) additionally refuses to render a `measured` or `counted` metric with an empty basis, so even a bypassed validator cannot ship a bare number.

### 4.4 Case study representation

Each case study is two files that share a slug:

- `src/content/case-studies/<slug>.ts` — the typed `CaseStudy` record: all short fields, metrics, constraints, stack, and the eight-part scaffolding.
- `src/content/case-studies/<slug>.mdx` — only the long-form `approach` body, the one field that benefits from prose formatting, headings, and inline links.

The join is by convention and checked by the validator: every `CaseStudy.slug` must have a matching MDX file, and every MDX file must have a matching record. This split keeps the metric and evidence fields inside the type system — where they can be validated — while letting the narrative be written as prose.

Ordering (`getCaseStudies()`): `featured` descending, then `period.start` descending. This single function backs the work index (FR-W1), the home page selection (FR-H4), and previous/next navigation (FR-C10), so the three can never disagree.

### 4.5 Placeholder content policy for this phase

PRD §22 leaves fourteen questions open, several of which gate content that would otherwise have to be invented. Until they are answered:

- Every case study exists with its **real structure** and honest placeholder prose, marked `TODO(Q4)`, `TODO(Q7)` and so on against the PRD question that unblocks it.
- **Every outcome metric starts at tier `capability` with no number.** Not a number with a fabricated basis, and not a number with a `TODO` basis — no number at all. This satisfies CV-1 truthfully rather than by exemption, and it means the site at every commit is publishable without containing a claim its author cannot support.
- `proglo-shipping` keeps `featured: true` and its `liveUrl`, because progloshipping.com is publicly reachable regardless of whether permission (Q1) is granted for the case-study narrative. If Q1 comes back negative, the FR-PS6 fallback is a content edit — rename to "a US-based multi-carrier shipping platform", drop `liveUrl` and `evidence`, set `featured: false`, and set `featured: true` on `cv-anonymization`. No code changes.

A `TODO(Q*)` marker in a content string is a **warning** in the validator, not an error, and CI prints a summary of outstanding markers. It becomes an error under `VALIDATE_STRICT=1`, which is what the release checklist runs (§15.3).

---

## 5. Build-time content validation

This section implements PRD §9.2. It is the mechanism behind ADR-003 and the reason the evidence policy is more than an intention.

### 5.1 Execution model

`src/lib/validate-content.ts` exports `validateContent(): ValidationReport` — a pure function over the imported content modules, returning `{ errors: Issue[], warnings: Issue[] }`. It performs no I/O beyond reading the case-study directory listing, which makes it directly unit-testable (§15.1).

`scripts/validate-content.ts` is the CLI wrapper: it calls the function, prints a grouped human-readable report, and exits `1` if `errors.length > 0` (or if `warnings.length > 0` under `VALIDATE_STRICT=1`).

It runs in three places: the `prebuild` hook, its own CI job (so the failure is legible in the checks list rather than buried in build output), and a pre-commit hook if the author chooses to install one.

### 5.2 Rules

| ID | Rule | Severity | Message shape |
|---|---|---|---|
| CV-0 | Every content module parses against its Zod schema | Error | Zod path plus expected type |
| CV-1 | Every `Metric` with tier `measured` or `counted` has a `basis` of ≥ 60 characters | Error | `<slug> → outcomes[i]: tier '<tier>' requires a basis ≥ 60 chars (found N). See PRD §6.4.` |
| CV-1b | A `Metric` with tier `capability` has **no** digits in `value` | Error | Tier D permits no numbers (PRD §6.3) |
| CV-1c | A `Metric` with tier `verifiable` has an `evidenceUrl` | Error | Tier A must carry its link |
| CV-2 | Every `CaseStudy` has a non-empty `contribution` | Error | Names the empty field |
| CV-2b | Every `CaseStudy` has a `whatDidNotWork` | **Warning** | Only the person who built the system knows what went wrong, so this cannot be inferred. Blocking every build would have forced a fabrication; the section is omitted from the page instead |
| CV-3 | Every `CaseStudy.constraints` has ≥ 2 entries | Error | Names the count found |
| CV-5 | No content string contains a denylisted end-client name | Error | Names the term and the field, **never echoing the surrounding text** |
| CV-6 | Exactly one `CaseStudy` has `featured: true` **and** a `liveUrl` | Error | Lists the offending slugs |
| CV-7 | Every `CaseStudy.slug` has a matching MDX file and vice versa | Error | Names the orphan |
| CV-8 | Slugs are unique and match `^[a-z0-9]+(-[a-z0-9]+)*$` | Error | Names the slug |
| CV-9 | `readingMinutes` is between 3 and 12 | Warning | PRD FR-C9 targets 4–7 |
| CV-10 | No `TODO(` marker remains in any content string | Warning (Error under `--strict`) | Lists field and marker |
| CV-15 | No role bullet carries a bare percentage or `N+` count | Warning | Closes the hole where a number in a plain string bypasses the `Metric` rules entirely. See below |

**CV-15 closes a hole the original design missed.** Rules CV-1 and CV-1b police `Metric` objects, so a case study outcome cannot carry a number without a basis. But PRD §6.3 requires the qualifier *anywhere* a Tier B or C claim appears, and a role bullet is a plain string — it never touches the metric machinery.

The consequence was concrete: a bullet reading "reduced effort by approximately 80%" shipped unqualified while the identical claim as a `Metric` would have failed the build. The site's three strongest numbers were the three sitting outside its strictest rule.

CV-15 is a warning rather than an error because these are the owner's own claims about his own work, and failing his build over his CV copy would be the wrong instrument. What it does is make the gap impossible to forget: it prints on every run, names the role and the bullet, and says what supplying the basis would unlock.

CV-5 deserves a note on its own implementation. The check is case-insensitive and matches on word boundaries, so "Acme" does not fire on "acmeism", and it is applied to every string field reachable from the content modules plus the raw text of every MDX file. Critically, **the error message names the term and the field but does not print the surrounding sentence** — CI logs are public on a public repository, and echoing the matched context would leak the very name the rule exists to suppress.

### 5.3 CV-4: external link liveness

CV-4 needs the network, so it is not part of `validateContent()` and does not run in `prebuild` — a local build must work offline. `scripts/check-links.ts` runs in CI only:

- Internal links: extracted from the built `out/` HTML and resolved against the emitted file tree. **Blocking**, always.
- External links: `HEAD` with a `GET` fallback (some hosts reject `HEAD`), 10s timeout, 2 retries with backoff. **Warning**, because third-party downtime must not block an unrelated deploy.
- The flagship's `liveUrl` (`progloshipping.com`): **blocking**, per PRD §18.1. If the one Tier A artifact the site leans on is unreachable, the release waits.

### 5.4 Design note

The validator is written to be *readable as an argument*. Someone auditing the repository should be able to open one file and see the entire evidence policy expressed as executable rules. That is a deliberate secondary purpose: it is itself a demonstration of the engineering judgement the site is claiming.

---

## 6. Design system implementation

### 6.1 Token strategy

Tailwind v4 is configured CSS-first. There is no `tailwind.config.js`; the design system lives in `src/styles/globals.css` in an `@theme` block, which is both the Tailwind configuration and the CSS custom property declaration.

```css
@theme {
  --color-ink:    #101418;
  --color-paper:  #EEF0F2;
  --color-steel:  #5A6672;
  --color-line:   #C9CED4;
  --color-signal: #FFB000;
  --color-depth:  #1F6F6B;
}
```

Semantic aliases (`--color-bg`, `--color-fg`, `--color-muted`, `--color-border`, `--color-link`) are layered on top and are what components actually reference. Components never use a raw palette token directly. This indirection is what makes the dark theme a redefinition of five variables rather than a sweep through every component.

### 6.2 Theming

Light is the default on bare `:root`. Dark is applied twice — once under `@media (prefers-color-scheme: dark)` guarded by `:root:not([data-theme='light'])`, and once under `:root[data-theme='dark']` — so an explicit toggle wins in both directions and the system setting is respected when no choice has been made.

Dark theme per PRD §10.2: `--ink` and `--paper` swap, `--steel` lifts to `#98A3AE`, `--line` drops to `#252C33`, `--signal` holds, `--depth` lightens to `#3FA39D`.

### 6.3 Contrast budget

PRD §10.2 requires body text at ≥ 7:1 (AAA) in both themes and secondary text at ≥ 4.5:1. The chosen pairs:

| Pair | Ratio | Requirement |
|---|---|---|
| `#101418` on `#EEF0F2` (light body) | ~16.4:1 | ≥ 7:1 ✅ |
| `#EEF0F2` on `#101418` (dark body) | ~16.4:1 | ≥ 7:1 ✅ |
| `#5A6672` on `#EEF0F2` (light secondary) | ~5.0:1 | ≥ 4.5:1 ✅ |
| `#98A3AE` on `#101418` (dark secondary) | ~8.0:1 | ≥ 4.5:1 ✅ |
| `#1F6F6B` on `#EEF0F2` (light link) | ~4.9:1 | ≥ 4.5:1 ✅ |
| `#3FA39D` on `#101418` (dark link) | ~7.7:1 | ≥ 4.5:1 ✅ |

`--signal` (`#FFB000`) is a **surface and border colour only** and is never used for text on `--paper`. A unit test in `src/lib/__tests__/contrast.test.ts` recomputes these ratios from the tokens, so changing a hex value without checking contrast fails CI rather than shipping.

### 6.4 No-flash theme script (FR-G4)

A small synchronous script is inlined in `<head>` before any paint. It reads `localStorage.theme`, falls back to `matchMedia('(prefers-color-scheme: dark)')`, and stamps `data-theme` on `<html>`. It is inlined rather than imported because an external module would be fetched after first paint, which is exactly the flash the requirement forbids.

Because it is inline, it needs a CSP allowance. The script is hashed at build time and the hash is added to the `script-src` directive in the meta CSP (§13.2), so `'unsafe-inline'` is never used.

`ThemeToggle` is one of only two client components. It exposes state via `aria-pressed` (FR-AC11), carries a visible text label rather than an icon alone, and writes through to both `localStorage` and the `data-theme` attribute. No transition is applied on theme change (PRD §10.7).

### 6.5 The manifest strip (PRD §10.5)

The signature element. A `<dl>` of key/value rows rendered in JetBrains Mono, with the dotted leader produced in pure CSS by a repeating linear-gradient on a flex spacer — not by literal dot characters, which would be read aloud by screen readers as noise.

Requirements it must satisfy simultaneously:

- **Full content in the HTML.** The staggered reveal is a CSS animation with `animation-delay` set per row via an inline custom property. Nothing is hidden by JavaScript, so with JS disabled the strip is simply present (NFR-9).
- **`prefers-reduced-motion`** removes the animation and shows all rows at once (FR-G5).
- Rows whose value is a URL render through `ExternalLink`.
- The dotted leader is `aria-hidden`; the `<dt>`/`<dd>` pairing carries the semantics.

PRD §10.5 is explicit that this visual language appears in exactly three places — the strip, case-study metadata headers, and metric footnote markers. That constraint is enforced by keeping the leader and mono-label styling in a single `.manifest-row` class used by those three components and nowhere else.

### 6.6 Motion

All motion is CSS. There is no animation library (PRD §11.2). A single global rule disables everything:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Scroll-triggered reveals (PRD §10.7) use pure-CSS `animation-timeline: view()` where supported, with no fallback beyond "the element is simply visible". A JavaScript IntersectionObserver was rejected: it would add client JavaScript to otherwise-static pages for a decorative effect, which trades against NFR-6 for nothing.

### 6.7 Component contracts

| Component | Client? | Contract |
|---|---|---|
| `ManifestStrip` | No | Renders `ManifestRow[]`; content fully present in HTML |
| `CaseStudyCard` | No | `variant: 'flagship' \| 'default'`; `Live` badge requires both a `liveUrl` and a text label, never colour alone (FR-AC5) |
| `MetricWithBasis` | No | `<details>`/`<summary>` disclosure. **Throws at build time** if given a `measured`/`counted` metric with no basis |
| `Schematic` | No | Inlines the SVG (needs CSS variables for theming), injects `<title>`/`<desc>`, requires a `summary` prop rendered as visible text beneath |
| `ThemeToggle` | **Yes** | `aria-pressed`, text label, localStorage persistence |
| `CopyEmail` | **Yes** | Clipboard write plus `aria-live="polite"` confirmation; the raw address is always present as selectable text so it degrades to plain text without JS (FR-CT8) |
| `ExternalLink` | No | Adds `rel="noopener noreferrer"`, `target="_blank"`, and a visually-hidden "(opens in a new tab)" (FR-G6) |
| `AvailabilityChip` | No | Renders from `siteConfig.available`; renders nothing when false |

`MetricWithBasis` throwing during a server render is intentional. Under static export, a throw in a server component fails the build — so the render path enforces the same rule as the validator, and neither can be circumvented by editing around the other.

### 6.8 Print stylesheet (FR-R3)

An `@media print` block hides the header, footer, theme toggle, and navigation; forces the light palette; expands all `<details>` so metric bases print; and appends `href` values after external links via `content: " (" attr(href) ")"`. The résumé route is the primary target but the rule set is global, so any page prints acceptably.

---

## 7. Routing and rendering

### 7.1 Route table

| Route | File | Generation | Priority |
|---|---|---|---|
| `/` | `src/app/page.tsx` | Static | P0 |
| `/work/` | `src/app/work/page.tsx` | Static | P0 |
| `/work/<slug>/` | `src/app/work/[slug]/page.tsx` | `generateStaticParams` over `caseStudies` | P0 |
| `/about/` | `src/app/about/page.tsx` | Static | P0 |
| `/resume/` | `src/app/resume/page.tsx` | Static | P0 |
| `/contact/` | `src/app/contact/page.tsx` | Static | P0 |
| `/stack/` | `src/app/stack/page.tsx` | Static | P2 |
| `/privacy/` | `src/app/privacy/page.tsx` | Static | P0 (FR-P1) |
| `404` | `src/app/not-found.tsx` | Static → `out/404.html` | P0 |
| `/sitemap.xml` | `src/app/sitemap.ts` | Build-time | P0 |
| `/robots.txt` | `src/app/robots.ts` | Build-time | P0 |
| `/llms.txt` | `public/llms.txt` | Static file | P2 |

### 7.2 Home composition

`page.tsx` composes, in the PRD §7.3 priority order: `Hero` → `ManifestStrip` → flagship `CaseStudyCard` → selected work → `Capabilities` → `ExperienceSummary` → `ResearchBlock` → `ClosingCta`. Every one is a server component. The only JavaScript the home page loads is the inline theme script, `ThemeToggle`, `CopyEmail`, and the analytics beacon (FR-H9).

### 7.3 404 under static export

Next.js emits `not-found.tsx` as `out/404.html`, which GitHub Pages serves automatically for unmatched paths. No configuration is required, but it does mean the 404 is a full page load rather than a client-side transition — which is correct for a static site.

### 7.4 Work index filtering (FR-W2)

Domain filtering is implemented without JavaScript. Filter chips are anchor links to `#filter-ecommerce` and so on; the list responds via `:target` sibling selectors that hide non-matching cards. The unfiltered list is what renders at `/work/` with no fragment, so the no-JS default is the complete list, exactly as FR-W2 requires. The filter state is in the URL, so it is shareable and back-button-correct for free.

A visible "showing N of M" line and `aria-current` on the active chip satisfy FR-AC5 (state is not conveyed by colour alone).

### 7.5 Case study template

`work/[slug]/page.tsx` renders the eight FR-C sections in fixed order, pulling short fields from the typed record and the `approach` body from the MDX module. Section order is not parameterised — deviating from the structure is a content bug per PRD §8.4, so the template does not offer the option.

Layout above 1024px is the PRD §10.4 asymmetric split: a 7-column prose measure and a 3-column sticky rail carrying period, role, organisation, stack tags, reading time, and metric footnotes. The rail is `position: sticky` with a scroll-margin offset; below 1024px it collapses to a block above the prose. Implemented with CSS grid and a single media query — the DOM order is identical in both layouts, so the reading order for a screen reader never diverges from the visual order.

### 7.6 About

Renders `aboutBio` prose, the full `roles` timeline, `education`, the publication block with its plain-language summary, and `earlierProjects`. FR-A7 (photograph or nothing) is handled by an optional `siteConfig.photo` field: when absent, the layout renders a text-only header rather than a placeholder silhouette.

### 7.7 Résumé

`/resume/` renders from the same `roles`, `education`, `publications`, and `capabilities` modules as the rest of the site. FR-R1's "no separately maintained copy that can drift" is satisfied structurally: there is no second data source to drift from. The PDF (§10.4) is generated from this page, which extends the same property to the download.

### 7.8 Contact

Direct channels render first (FR-CT1): the email as selectable text plus `CopyEmail`, then LinkedIn and GitHub. The form is secondary.

`ContactForm` posts to a third-party static-form endpoint (Web3Forms or Formspree — decision deferred, §18). Design points:

- It is a real `<form>` with a `method="POST"` `action` attribute, so it submits without JavaScript. Progressive enhancement intercepts submission only to render inline success and failure states.
- Spam controls (FR-CT4): a honeypot field hidden with CSS (not `type="hidden"`, which bots read), a `renderedAt` timestamp checked against a minimum time-to-submit, and the provider's captcha where available.
- Validation errors are associated by `aria-describedby`, announced in an `aria-live="assertive"` region, and marked with both text and an icon — never colour alone (FR-CT5).
- The failure state prints the raw email address as a fallback (FR-CT6).
- Labels are persistent and visible; no placeholder-only labels (FR-AC6).

---

## 8. SEO and metadata

### 8.1 Metadata generation

`src/lib/seo.ts` exports `buildMetadata({ title, description, path, ogImage, type })`, returning a Next.js `Metadata` object. Every route calls it; no route hand-writes metadata. This centralisation is what makes FR-SEO1's title formula and FR-SEO3's canonical rule enforceable rather than aspirational.

Title formula (FR-SEO1):

| Route type | Format |
|---|---|
| Home | `Farhan Shehzad — AI Automation & Integration Engineer` |
| Case study | `<Title> — Case study — Farhan Shehzad` |
| Other | `<Page> — Farhan Shehzad` |

A unit test asserts every route's title is ≤ 60 characters where the PRD says "where possible", and reports (not fails) the exceptions.

Descriptions are hand-written per route and stored beside the content, never templated from body text (FR-SEO2). The validator warns on any description outside 140–160 characters.

### 8.2 Canonicals

`metadataBase` is set from `SITE_URL` in the root layout, and every page passes its own `path`. Canonical URLs are therefore absolute and derived from one constant (FR-SEO3). Because `trailingSlash: true`, canonicals include the trailing slash so they match exactly what the CDN serves — a mismatch here is a classic duplicate-content own-goal.

### 8.3 Structured data

`src/lib/jsonld.ts` builds typed objects, serialised into `<script type="application/ld+json">`:

| Schema | Route | PRD |
|---|---|---|
| `Person` | Home | FR-SEO5 — name, jobTitle, url, sameAs, alumniOf, knowsAbout, address (city/country only) |
| `ScholarlyArticle` | About publication block | FR-SEO6 — includes the DOI |
| `TechArticle` | Each case study | FR-SEO7 |
| `BreadcrumbList` | Case studies | Navigational clarity |

The builders are typed against `schema-dts` types at development time only; the emitted output is plain JSON.

### 8.4 Sitemap and robots

`src/app/sitemap.ts` and `robots.ts` are Next.js's native metadata routes, which export correctly under `output: 'export'`. The sitemap enumerates routes from the same content modules the pages use, so a new case study appears in the sitemap without a second edit (NFR-13).

`lastmod` comes from `src/generated/build-meta.json` (§8.5) rather than build time, so re-running a build does not falsely bump every page's modification date.

### 8.5 Build metadata (FR-G7)

`scripts/build-meta.ts` shells out to `git log -1 --format=%cI` for the repository and, per content file, `git log -1 --format=%cI -- <path>`, writing the result to `src/generated/build-meta.json`. That file is gitignored and regenerated in `prebuild`.

Because CI checkouts default to a shallow clone, the workflows set `fetch-depth: 0`. Without it, per-file dates are wrong or missing — a subtle failure that silently degrades sitemap quality, so the script logs a warning when it detects a shallow clone.

### 8.6 `/llms.txt` (FR-SEO10)

A hand-written plain-text summary at the site root: who Farhan is, what the site contains, which claims are verifiable and where. Its existence is a small bet that AI assistants are now a real discovery surface for hiring research. It is manually maintained; the validator warns if it has not been touched in a release where case-study content changed.

---

## 9. Open Graph image generation

### 9.1 Approach (ADR-005)

PRD §17 places OG generation at `src/app/og/[...slug]/route.tsx`. Route handlers are heavily constrained under `output: 'export'` — they must be static `GET`s and the ergonomics fight the exporter. The same output is achievable with less machinery as a plain build script.

`scripts/generate-og.ts` runs before `next build`:

1. Enumerates routes from the content modules.
2. Renders a JSX template through `satori` into SVG, using the site's own fonts loaded from disk as `ArrayBuffer`s.
3. Rasterises to a 1200x630 PNG with `@resvg/resvg-js`.
4. Writes `public/og/<route>.png`.

Output is gitignored and regenerated on each build, so an OG image can never drift from the title it depicts.

### 9.2 Template

The site's own typography and the manifest-strip motif (PRD FR-SEO4): Archivo display title, Public Sans role line, a JetBrains Mono footer row with the domain, on `--paper` with a `--signal` rule. Two-line title truncation with a measured ellipsis, so a long case-study title degrades predictably rather than overflowing.

### 9.3 Caching

Generation is skipped when the target PNG exists and is newer than both the template and the content module that produced it. A cold generation of ten images costs a few seconds; the cache keeps incremental builds inside the NFR-10 90-second budget.

---

## 10. Assets

### 10.1 Budgets

| Scope | Budget | Source |
|---|---|---|
| Home page total weight | ≤ 400 KB including fonts | PRD §11.4 |
| Case study with schematic | ≤ 600 KB | PRD §11.4 |
| Fonts | ≤ 3 files, ≤ 120 KB total | NFR-7 |
| Home JavaScript, gzipped | ≤ 90 KB | NFR-6 |

Enforced by `lighthouserc.json` resource-size assertions, so exceeding a budget fails CI rather than being noticed later.

### 10.2 Images

`next/image` optimisation needs a server, so `images.unoptimized: true` and optimisation moves to `scripts/optimise-images.ts`: sharp reads each source in `assets/images/`, emits AVIF and WebP derivatives at defined widths into `public/images/`, and writes intrinsic dimensions to a manifest.

A thin `<Image>` wrapper reads that manifest to emit `<picture>` with correct `width`/`height` (preventing layout shift, NFR-3), `loading="lazy"` below the fold, and `fetchpriority="high"` on the single LCP image if one exists.

At present the site has almost no raster images — deliberately. The schematics are SVG and the design carries no photography beyond an optional portrait. The pipeline exists so that adding one later does not become an excuse to skip optimisation.

### 10.3 Fonts (ADR-006)

Archivo (display), Public Sans (body), JetBrains Mono (utility) — PRD §10.3.

Loaded through `next/font/google`, which **downloads the font files at build time and serves them from the site's own origin**. There is no runtime request to a third-party font host, so the privacy and connection-cost objections in PRD §10.3 are fully addressed, and NFR-7's subsetting requirement is handled automatically (`subsets: ['latin']`, variable axes only).

This is recorded as an ADR because the name `next/font/google` reads like a CDN dependency and is not one. The alternative — manually downloading, subsetting with `glyphhanger`, and self-hosting WOFF2 files — produces a near-identical result with a manual maintenance step, and was rejected on that basis. If the build environment must ever be fully network-isolated, `next/font/local` with committed WOFF2 files is the drop-in replacement.

`display: 'swap'` and preload on the display and body faces; JetBrains Mono is not preloaded, since the manifest strip is below the LCP element.

### 10.4 Résumé — no PDF (FR-R2 and FR-R4 dropped)

There is no résumé PDF and no generator script. `/resume/` is the résumé, per the owner's decision on 28 Aug 2026 (**ADR-011**).

What carries the requirement instead is the print stylesheet (§6.8), which is consequently promoted from P1 to **P0**: it is now the only route from this site to a file. It must therefore satisfy the PRD Appendix C constraints directly — single column, real text, standard headings, no layout tables, no meaning carried by icons — because a browser print of `/resume/` is what a recruiter will attach to a submission.

The ATS constraints were always properties of the page's markup rather than of the PDF step, so dropping the generator does not weaken them. What is lost is control over pagination and PDF metadata (CV-P5), neither of which a browser print exposes.

### 10.5 Schematics

Hand-authored SVG under `public/schematics/`, inlined by the `Schematic` component so they inherit CSS variables and theme correctly. Authoring rules (PRD §10.6): generic component labels only, two colours plus `--signal` for the single component Farhan built, monospace labels, no gradients, no icon-set icons, legible at 320px, `<title>` and `<desc>` present, and a visible text summary beneath.

The five schematics are not drawn in this phase; each case study has a `schematic?` field left undefined, and the component renders nothing when it is absent.

---

## 11. Accessibility implementation

WCAG 2.2 Level AA is a launch gate (PRD §15). Each requirement maps to a concrete implementation and, where possible, to an automated check.

| PRD ID | Implementation | Automated check |
|---|---|---|
| FR-AC1 | No custom focus management anywhere; native elements throughout. No modals, so no focus traps exist to get wrong | axe (partial) |
| FR-AC2 | Global `:focus-visible` rule: 2px `--signal` outline, 2px offset. Never `outline: none` without a replacement | Manual + contrast test |
| FR-AC3 | `header`/`nav`/`main`/`footer` in `layout.tsx`; skip link is the first focusable element | axe |
| FR-AC4 | `alt` required by the `Image` wrapper's types; `Schematic` requires `title`, `desc`, `summary` props | TypeScript + axe |
| FR-AC5 | Live badges, filter chips, and form errors all carry text or `aria-current` in addition to colour | Manual |
| FR-AC6 | Persistent visible `<label>`s; ESLint `jsx-a11y/label-has-associated-control` | ESLint |
| FR-AC7 | `aria-live="polite"` for the copy-email toast; `aria-live="assertive"` for form errors | Manual |
| FR-AC8 | Fluid layout, `max-width` in `ch`, no fixed pixel widths on containers; verified at 320px and 200% zoom | Manual + LHCI viewport |
| FR-AC9 | Minimum 24x24px target size enforced by a shared `.tap-target` utility applied to every interactive element | Manual |
| FR-AC10 | Manual NVDA (Windows/Firefox) and VoiceOver (iOS/Safari) pass before launch | Manual, checklist item |
| FR-AC11 | `ThemeToggle` uses `aria-pressed` plus a text label | axe (partial) |

Two structural decisions do more for accessibility than any of the individual rules. First, **the site has no client-side routing, no modals, and no custom widgets** — the interaction surface is links, buttons, a disclosure, and a form, all native. Second, **the DOM order matches the visual order in every layout**, including the case-study rail, so reading order and tab order are the same at every breakpoint.

Automated coverage catches roughly 30–40% of real accessibility defects. The manual pass in FR-AC10 is therefore a launch blocker, not a formality, and is listed as such in §15.3.

---

## 12. Performance

### 12.1 Targets and enforcement

| NFR | Target | Enforced by |
|---|---|---|
| NFR-1 | Lighthouse ≥ 95 in all four categories, mobile | `lighthouserc.json` assertion, blocking |
| NFR-2 | LCP ≤ 1.8s (4G throttle) | LHCI assertion |
| NFR-3 | CLS ≤ 0.05 | LHCI assertion; structurally addressed by explicit image dimensions and `font-display: swap` with preloaded faces |
| NFR-4 | INP ≤ 200ms | Trivially met — there is almost no interactivity to be slow |
| NFR-5 | TTFB ≤ 600ms | Inherited from the Pages CDN |
| NFR-6 | ≤ 90 KB gzipped JS on home | **Currently ~104 KB — see 12.2 and ADR-010** |
| NFR-10 | Build ≤ 90s in CI | Workflow step timeout |

LHCI runs against the built `out/` served locally, over four representative URLs: home, work index, a case study, and about.

### 12.2 NFR-6 is currently missed, by about 14 KB

The architecture is right: every component is a server component unless it demonstrably needs a browser API, which is true of exactly two — `ThemeToggle` (localStorage) and `CopyEmail` (clipboard). Both are leaves. Application code contributes roughly 1.4 KB gzipped to the home page.

The budget is missed anyway, because the framework baseline is larger than the budget:

| Chunk | Gzipped | Note |
|---|---|---|
| React + Next runtime (`4bd1b696`) | 54.2 KB | Framework |
| Shared app chunk (`255`) | 46.8 KB | Framework |
| Route + layout + webpack + main-app | ~3.4 KB | Mostly framework |
| **Total on `/`, modern browsers** | **~104 KB** | Budget: **90 KB** |
| Legacy polyfills | 39.5 KB | Loaded `noModule`; the NFR-8 browser matrix never fetches it |

Measured against the first production build, 28 Aug 2026. See **ADR-010** for what this means and what the options are. Deleting both client components would recover under 2 KB, so there is no tuning path from here to 90 KB.

CI still prints the client bundle inventory and asserts on resource size, but the asserted threshold is the measured baseline plus a small allowance, not 90 KB — a gate that is red on every commit teaches people to ignore it. The purpose of the assertion is to catch a *regression*: a new `'use client'` that adds real weight shows up immediately.

### 12.3 NFR-9: JavaScript disabled

100% of content must render without JavaScript. This is verified in CI by loading each route in a Playwright context with `javaScriptEnabled: false` and asserting that the page's main landmark contains the expected heading and a minimum text length. The components that could plausibly break this rule — `ManifestStrip`, `MetricWithBasis`, `CopyEmail`, `ContactForm`, and the work-index filter — are each designed around it, per §6 and §7.

---

## 13. Privacy, security, and legal

### 13.1 Posture

No cookies, no accounts, no personal data collected by the site itself, and no server to compromise. The attack surface is the two third parties (analytics, form provider) and the supply chain.

### 13.2 Content Security Policy (FR-P3)

GitHub Pages cannot set response headers, so CSP is delivered via `<meta http-equiv="Content-Security-Policy">` in the root layout. Baseline:

```
default-src 'self';
script-src 'self' 'sha256-<theme-script-hash>' <analytics-origin>;
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
font-src 'self';
connect-src 'self' <analytics-origin> <form-endpoint>;
form-action <form-endpoint>;
frame-ancestors 'none';
object-src 'none';
base-uri 'self';
```

Notes on the compromises, which should be understood rather than glossed:

- `frame-ancestors` and `sandbox` are **ignored** in a meta-delivered CSP. Clickjacking protection is therefore not available on this host. The mitigation is that the site has no authenticated state and no destructive actions, so framing it achieves nothing. This is an accepted risk, recorded here rather than left implicit.
- `style-src 'unsafe-inline'` is required because Next.js injects inline styles. Hashing them is not practical across a build.
- The theme script is hashed at build time by a small step that reads the emitted script text and rewrites the CSP meta tag, so `'unsafe-inline'` is never needed for `script-src`.

### 13.3 Supply chain (FR-P5)

`npm audit --audit-level=high` is a blocking CI step. Dependabot is configured in `.github/dependabot.yml` for both npm and GitHub Actions, weekly, grouped into one PR for minors and patches so the noise stays manageable. Actions are pinned by major version tag; the deploy workflow's actions are first-party GitHub actions.

### 13.4 Analytics (FR-AN1..AN4)

Cookieless and privacy-first: GoatCounter, Umami, or Plausible — the choice is deferred and listed in §18. Whichever is chosen must satisfy: script ≤ 2 KB, `defer`, and no rendering dependency on it loading (FR-AN3). Custom events (FR-AN4) are `resume_download`, `contact_submit`, `email_copy`, `outbound_proglo`, `outbound_doi`, `case_study_75_scroll`.

The integration point is a single `src/components/Analytics.tsx` that renders the provider's script tag, plus a `track(event)` helper that no-ops when the provider is absent. Nothing else in the codebase knows which provider is in use, so switching is a one-file change.

Because no cookies are set and no personal data is collected, no consent banner is shown (FR-AN2), and `/privacy` states this plainly.

### 13.5 Secrets (FR-P4)

There are none. The deploy uses the workflow's built-in `GITHUB_TOKEN`. The form provider's access key is public by design and is committed with a comment explaining why, so a reader does not mistake it for a leak.

### 13.6 Licensing (FR-P8)

Source code MIT; site content © Farhan Shehzad, all rights reserved. Both are stated in `LICENSE` and repeated in the README. The split matters: the code being reusable is a small gift to other developers, while the case studies and biography are not material anyone should be repurposing.

---

## 14. CI/CD

### 14.1 Continuous integration (`.github/workflows/ci.yml`)

Runs on pull requests and on pushes to `main`. Jobs, with `verify` fanning out after `build`:

| Job | Steps | Gate |
|---|---|---|
| `verify` | `tsc --noEmit`, ESLint, `validate:content`, unit tests | Blocking |
| `build` | `npm ci`, `npm run build`, upload `out/` as an artifact | Blocking |
| `a11y` | Serve `out/`, run axe-core over every route | Blocking on any violation |
| `perf` | Serve `out/`, Lighthouse CI mobile preset over four routes | Blocking below 95 in any category |
| `links` | Internal link check; external check; flagship `liveUrl` check | Blocking internal and flagship; warning external |
| `nojs` | Playwright with `javaScriptEnabled: false` over every route | Blocking |
| `audit` | `npm audit --audit-level=high` | Blocking |

`concurrency` cancels superseded runs on the same ref. Node 22 with `actions/setup-node` npm caching; `fetch-depth: 0` for the git-date metadata (§8.5).

### 14.2 Deployment (`.github/workflows/deploy.yml`)

Triggered on push to `main` and by `workflow_dispatch`.

```yaml
permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false
```

Build job → `actions/upload-pages-artifact` with `path: out` → deploy job with `environment: github-pages` → `actions/deploy-pages`.

`cancel-in-progress: false` is deliberate: cancelling a half-finished Pages deployment can leave the environment in an inconsistent state, and the cost of letting a superseded deploy finish is a few seconds.

Target: under three minutes from merge to live (PRD §18.2).

### 14.3 Branch protection

`main` is protected; changes land via pull request (PRD §18.2). Required checks: `verify`, `build`, `a11y`, `perf`, `links`, `nojs`, `audit`.

Sequencing note: protection must be enabled **after** the initial scaffold push, since a protected branch with required checks blocks the first push that would create those checks.

### 14.4 Rollback

Two documented paths, both in the README:

1. **Re-run the previous successful deployment** — Actions → Deployments → the last good run → "Re-run all jobs". Fastest; roughly one build cycle.
2. **Revert the commit** — `git revert <sha>` and merge, which redeploys through the normal path and leaves the history honest about what happened.

Reverting is preferred when the cause is known, because re-running an old deployment leaves `main` in the broken state.

---

## 15. Testing strategy

### 15.1 Unit tests (`node:test` with `tsx`)

No test framework dependency; Node's built-in runner is enough for the surface being tested.

| Target | Assertions |
|---|---|
| `validate-content.ts` | Each rule CV-0..CV-10 fires on a crafted-bad fixture and stays silent on a good one. **These are the most important tests in the repository** |
| `seo.ts` | Title formulae, canonical construction, description length bounds |
| `jsonld.ts` | Required fields present per schema type |
| Contrast | Recomputes every §6.3 pair from the tokens and asserts the ratio thresholds |
| `getCaseStudies()` | Sort order stability, prev/next wrap-around behaviour |

### 15.2 Integration and end-to-end

Playwright, against the served `out/` directory rather than a dev server, so the tests exercise exactly what deploys:

- Every route returns 200 and renders its `<h1>`.
- No-JS pass (§12.3).
- Theme toggle persists across reload with no flash (a screenshot comparison of the first painted frame).
- Copy-email writes to the clipboard and announces.
- Contact form: success path, failure path, honeypot rejection.
- Responsive rendering at 320 / 768 / 1280 / 1920 with no horizontal overflow.

### 15.3 Manual gates (launch blockers)

Not everything that matters is automatable. Before launch:

- [ ] NVDA on Windows Firefox, full pass (FR-AC10)
- [ ] VoiceOver on iOS Safari, full pass (FR-AC10)
- [ ] Every page proofread aloud (PRD §19.1)
- [ ] OG images checked in a card validator on at least three routes
- [ ] `VALIDATE_STRICT=1 npm run validate:content` clean — no `TODO(Q*)` markers remain
- [ ] Every Tier B/C metric's basis re-read against PRD §6.4's four required elements
- [ ] Résumé PDF text-extracted and checked for ATS parseability
- [ ] Device matrix per PRD §19.2

---

## 16. Repository layout and standards

### 16.1 Layout

```
farhanshehzad155.github.io/
├─ .github/
│  ├─ workflows/{ci.yml,deploy.yml}
│  └─ dependabot.yml
├─ assets/images/               # sources; optimised into public/ at build
├─ docs/
│  ├─ PRD-portfolio-farhan-shehzad.md
│  └─ TRD-portfolio-farhan-shehzad.md
├─ public/
│  ├─ .nojekyll                 # critical: stops Jekyll stripping _next/
│  ├─ llms.txt
│  ├─ farhan-shehzad-resume.pdf
│  ├─ og/                       # generated, gitignored
│  └─ schematics/*.svg
├─ scripts/
│  ├─ validate-content.ts
│  ├─ build-meta.ts
│  ├─ optimise-images.ts
│  ├─ generate-og.ts
│  ├─ generate-resume-pdf.ts
│  └─ check-links.ts
├─ src/
│  ├─ app/                      # routes per §7.1
│  ├─ components/
│  ├─ content/
│  ├─ generated/                # build-meta.json, gitignored
│  ├─ lib/
│  └─ styles/globals.css
├─ eslint.config.mjs
├─ lighthouserc.json
├─ next.config.mjs
├─ package.json
├─ tsconfig.json
├─ LICENSE
└─ README.md
```

### 16.2 Deviations from PRD §17

| PRD §17 | This document | Reason |
|---|---|---|
| `src/app/og/[...slug]/route.tsx` | `scripts/generate-og.ts` | ADR-005 — route handlers fight `output: 'export'` |
| `src/lib/validate-content.ts` only | Split into a pure `src/lib` function and a `scripts/` CLI | Makes the rules unit-testable |
| — | Added `src/generated/`, `assets/`, `docs/` | Build outputs, image sources, and specification documents need homes |
| — | Added `/privacy` and `/stack` routes | FR-P1 requires the first; the second is PRD-optional but cheap |

### 16.3 Standards

- TypeScript `strict: true` plus `noUncheckedIndexedAccess`; **no `any` in application code** (ESLint `no-explicit-any` as an error).
- ESLint flat config with `@typescript-eslint` and `jsx-a11y` recommended sets.
- Prettier, 100-column, single quotes, semicolons, trailing commas.
- **Conventional Commits.** The repository is public and PRD FR-P6 says every commit is written on the assumption a hiring engineer will read it — so commit messages explain *why*, not *what changed*, which the diff already shows.
- The README is a deliverable, not an afterthought (PRD §17). It must let a reader add a case study in under ten lines of instruction.

---

## 17. Deployment runbook

### 17.1 First-time GitHub setup

Prerequisites the repository cannot create for itself:

1. GitHub account `farhanshehzad155`, with `farhanshehzad155@gmail.com` added and **verified** — unverified, commits do not attribute to the profile.
2. A **public** repository named exactly **`farhanshehzad155.github.io`**. For a user site the name *is* the routing mechanism; any other name changes the URL and would require `basePath`. Public is also required by FR-P6, and Pages on a private repository needs a paid plan.
3. Push authentication: `gh auth login`, or an SSH key, or a PAT with `repo` **and `workflow`** scope. The `workflow` scope is required to push `.github/workflows/`.
4. **Settings → Pages → Build and deployment → Source: "GitHub Actions"** (not "Deploy from a branch"). This is the single most common cause of a silent non-deploy.
5. Actions enabled. The first successful run creates the `github-pages` environment automatically.
6. Settings → Pages → **Enforce HTTPS**, once the certificate provisions.

Then:

7. Enable branch protection on `main` — *after* the first push (§14.3).
8. Enable Dependabot alerts and security updates.
9. Create the separate profile-README repository `farhanshehzad155/farhanshehzad155` (name equals handle, no suffix — distinct from the Pages repository, no conflict) per PRD Appendix B.
10. Complete the profile fields: bio, location, website → the Pages URL (GH-7).

### 17.2 Routine deployment

Branch → PR → CI green → merge to `main` → `deploy.yml` → live in under three minutes.

### 17.3 Custom domain migration (PRD Q9, §11.5)

When a domain is purchased:

1. Add `public/CNAME` containing the apex domain, one line, no scheme.
2. DNS at the registrar:
   - Apex `A` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Apex `AAAA` → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - `www` `CNAME` → `farhanshehzad155.github.io.`
3. Settings → Pages → Custom domain → enter the apex → wait for the DNS check.
4. Wait for the Let's Encrypt certificate, then tick **Enforce HTTPS**.
5. Change `SITE_URL` in `src/lib/constants.ts` — one edit, which propagates to canonicals, OG tags, sitemap, and JSON-LD.
6. Update the LinkedIn featured link and resubmit the sitemap to Search Console.

`basePath` never enters the picture, in either configuration. That is the payoff of ADR-007.

---

## 18. Open technical questions

Content questions live in PRD §22. These are the ones that block or shape code.

| # | Question | Blocks | Default if unanswered |
|---|---|---|---|
| T1 | Analytics provider: GoatCounter, Umami, or Plausible? | FR-AN1..AN4, the CSP `connect-src` | Ship without analytics; `Analytics.tsx` no-ops |
| T2 | Form provider: Web3Forms or Formspree? | FR-CT3, CSP `form-action` | Ship direct channels only; the form is P1 |
| T3 | Custom domain (PRD Q9)? | `SITE_URL`, `public/CNAME` | `farhanshehzad155.github.io` |
| T4 | Any public repositories to feature (PRD Q8)? | FR-W3 Tier A evidence cards | None surfaced |
| T5 | Availability status and what he is open to (PRD Q12)? | FR-G8 chip copy | Chip hidden (`available: false`) |
| T6 | Professional photograph (PRD Q13)? | FR-A7 about layout | Text-only header |
| T7 | Confirmed MDPI DOI and ORCID/Scholar URLs (PRD Q11)? | FR-SEO5 `sameAs`, FR-SEO6 | Publication rendered without DOI link; CV-1c blocks a Tier A claim with no URL |
| T8 | Metric bases for the two ~80% claims (PRD Q4, Q5)? | FR-CV4, FR-OF3 | Metrics stay Tier D with no number (§4.5) |

T7 and T8 are worth noticing together: the validator's design means an unanswered question degrades the site to a weaker but honest claim automatically. Nothing silently ships as an unsupported number.

---

## 19. Architecture decision records

PRD Appendix D records ADR-001 through ADR-004 (Next.js over Astro; GitHub Pages over Vercel; typed content modules over a CMS; no testimonials at v1). Those stand unchanged. The following are added by this document.

### ADR-005 — OG images generated by a build script, not a route handler

**Context.** PRD §17 places OG generation at `src/app/og/[...slug]/route.tsx`. Under `output: 'export'`, route handlers must be static `GET`s with fully enumerated params, and the exporter's constraints make a catch-all image route awkward to keep working across Next.js upgrades.

**Decision.** Generate OG images in `scripts/generate-og.ts` using `satori` and `@resvg/resvg-js`, writing PNGs into `public/og/` during `prebuild`.

**Consequences.** Simpler and faster; cannot break the export; the images are inspectable on disk before deploy. Costs: generated files must be gitignored and regenerated, and the template is plain JSX rendered by satori rather than by React DOM, so a subset of CSS is supported. Both are acceptable for a fixed template.

### ADR-006 — Fonts through `next/font`, self-hosted at build time

**Context.** PRD §10.3 requires self-hosted, subset, preloaded variable WOFF2 and explicitly rejects a third-party font CDN on connection-cost and privacy grounds.

**Decision.** Use `next/font/google` for Archivo, Public Sans, and JetBrains Mono.

**Consequences.** The requirement is met: `next/font/google` downloads the files **at build time** and serves them from the site's own origin, with automatic subsetting and preload. There is no runtime third-party request, so the privacy objection does not apply despite the package name. Cost: the build needs network access to fetch fonts on a cold cache. If that ever becomes unacceptable, `next/font/local` with committed WOFF2 files is a drop-in replacement requiring a manual subsetting step.

### ADR-007 — GitHub user site rather than a project repository

**Context.** GitHub Pages can serve `<handle>.github.io` from a repository of the same name (a "user site", served at the domain root) or `<handle>.github.io/<repo>` from any repository (a "project site", served from a subpath).

**Decision.** User site: repository `farhanshehzad155.github.io`.

**Consequences.** No `basePath` or `assetPrefix`, so every internal URL is root-relative and correct in development, in the export, and behind a future custom domain — the class of bug where assets 404 only in production simply does not arise. Migration to a custom domain becomes a one-constant change. Cost: it consumes the account's single user-site repository slot, and the repository name is not descriptive. Both are minor next to eliminating path-prefix bugs.

### ADR-008 — `trailingSlash: true`

**Context.** A static export can emit either `work.html` or `work/index.html`. GitHub Pages resolves a directory request to `index.html` but does not rewrite an extensionless path to a sibling `.html` file.

**Decision.** `trailingSlash: true`, emitting `work/index.html`.

**Consequences.** Every route resolves on direct navigation and hard refresh, not only via client-side transitions — the most common failure mode for a Next.js export on Pages. Canonical URLs must include the trailing slash to match what is served (§8.2), which the centralised `buildMetadata()` handles in one place.

### ADR-009 — Content validation as a pure function plus a thin CLI

**Context.** PRD §9.2 requires build-time validation. The obvious implementation is a script that reads content and exits non-zero.

**Decision.** Split it: `src/lib/validate-content.ts` is a pure function returning a report; `scripts/validate-content.ts` prints and exits.

**Consequences.** The rules become unit-testable, so "does CV-1 actually fire?" is answered by a test rather than by trusting the implementation. Given that these rules are the mechanism protecting the site's central claim to honesty, they are the part of the codebase most deserving of tests. Cost: one extra file.

### ADR-010 — NFR-6 (90 KB JS) is not achievable on Next.js App Router, and the PRD anticipated this

**Context.** NFR-6 budgets 90 KB of gzipped JavaScript on the home page. The first production build ships ~104 KB to a modern browser, of which ~103 KB is the React 19 and Next.js App Router runtime and ~1.4 KB is application code. The site already does everything the budget assumes: two client components, both leaves, no animation library, no icon pack, no state management. There is no tuning path from 104 KB to 90 KB — deleting both client components recovers under 2 KB.

This is not a surprise. PRD ADR-001 chose Next.js knowing the trade-off and wrote the exit condition into the record: *"Revisit if the JS budget (NFR-6) cannot be met."* This ADR is that revisit.

**Options considered.**

1. **Switch to Astro.** Would ship close to zero JavaScript and meet the budget comfortably. Rejected for the same reason PRD ADR-001 rejected it: the site is a work sample for the Next.js and TypeScript skills claimed on the profile, and it mirrors the Proglo Shipping front end. Trading the positioning argument for 14 KB is a bad trade.
2. **Accept the miss and amend NFR-6 to 110 KB.** Honest, and it keeps the gate useful as a regression detector rather than a permanently red light.
3. **Leave NFR-6 at 90 KB and treat it as aspirational.** Rejected. A gate nobody can pass is a gate everybody learns to ignore, and it would undermine the other gates alongside it.

**Decision.** Option 2. NFR-6 is amended to **≤ 110 KB gzipped on the home page**, with the note that ~103 KB of that is framework floor and the real signal is movement in the remaining headroom.

**Consequences.** The user-facing performance targets that actually matter — LCP, CLS, INP, and the Lighthouse score — are unaffected and remain at their PRD values; those are what a visitor experiences, and a static page with no blocking work meets them regardless. What is lost is the ability to claim a sub-90 KB page. What is kept is the framework the site exists to demonstrate.

This requires a PRD amendment logged in PRD section 22. It is the one place where the implementation could not meet the specification as written, and it is recorded here rather than quietly satisfied by measuring something more flattering.

### ADR-011 — No résumé PDF; the site is the résumé

**Context.** PRD FR-R2 requires a downloadable one-page PDF at a stable path, and user story US-2 (P0) has the recruiter persona downloading it to attach to a submission. FR-R4 adds a generator script. On 28 Aug 2026 the owner decided against a PDF: the website itself is the résumé.

**Decision.** Remove the PDF, the download buttons on the home, résumé and contact pages, the `resumePdfPath` field from `SiteConfig`, and the planned `scripts/generate-resume-pdf.ts`. The home page's secondary CTA becomes "Read the résumé", pointing at `/resume/`.

**Consequences, stated plainly because this one has a real cost.**

FR-R2 is a P0 requirement and US-2 is a P0 user story, and both are now unmet. Persona P1 — the technical recruiter who screens forty profiles a day — is described in the PRD as someone who "will not read a case study" and needs "a downloadable résumé". Agency and in-house recruiters frequently need a file to upload into an ATS, and asking them to print a web page adds friction at exactly the moment the PRD says attention is thinnest (30–90 seconds).

Against that: a PDF is a second artifact that drifts from the site unless it is regenerated on every content change, and FR-R4's generator was already deferred to a manual step. A résumé that is wrong is worse than one that takes an extra click.

**Mitigation.** The print stylesheet (§6.8) is promoted to P0 and must produce a clean, ATS-parseable document from `/resume/`. The page states "Print this page for a PDF copy" so the route is discoverable rather than assumed.

**Revisit if** inbound recruiter contact underperforms the PRD §4.3 target of ≥8 qualified contacts in 90 days, or if a recruiter asks for a file. Restoring it is small: re-add `resumePdfPath`, generate the PDF from this page, restore the buttons.

This requires a PRD amendment logged in PRD §22, alongside the NFR-6 amendment from ADR-010.

---

## Appendix A — npm scripts

| Script | Command | Notes |
|---|---|---|
| `dev` | `next dev` | No prebuild; fast iteration |
| `build` | `next build` | `prebuild` runs validation, meta, images, OG |
| `prebuild` | `npm run validate:content && npm run build:meta && npm run build:images && npm run build:og` | Cannot be skipped |
| `validate:content` | `tsx scripts/validate-content.ts` | `VALIDATE_STRICT=1` promotes warnings to errors |
| `build:meta` | `tsx scripts/build-meta.ts` | Needs full git history |
| `build:images` | `tsx scripts/optimise-images.ts` | Cached by mtime |
| `build:og` | `tsx scripts/generate-og.ts` | Cached by mtime |
| `build:resume` | `tsx scripts/generate-resume-pdf.ts` | Manual; needs Playwright |
| `check:links` | `tsx scripts/check-links.ts` | CI; needs network |
| `lint` | `eslint .` | |
| `typecheck` | `tsc --noEmit` | |
| `test` | `node --import tsx --test src/**/*.test.ts` | |
| `serve` | `npx serve out` | Local check of the exported output |

## Appendix B — Content update playbook

Adding a case study, in full:

1. Create `src/content/case-studies/<slug>.ts` exporting a `CaseStudy`.
2. Create `src/content/case-studies/<slug>.mdx` with the approach narrative.
3. Add the import to `src/content/case-studies/index.ts`.
4. Run `npm run build`. Fix whatever the validator objects to.

Nothing else. The route, sitemap entry, OG image, work-index card, home-page card, and previous/next links all derive from the content modules (NFR-13). If any of those ever requires a manual edit, that is a bug in this architecture, not a step in this playbook.
