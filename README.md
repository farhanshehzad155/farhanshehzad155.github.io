# farhanshehzad155.github.io

Personal engineering portfolio for **Farhan Shehzad** — AI automation and integration engineer.

A static Next.js site, deployed to GitHub Pages on merge to `main`. No server, no database, no CMS.

- **Live:** https://farhanshehzad155.github.io
- **Content TODOs:** [`docs/CONTENT-TODO.md`](docs/CONTENT-TODO.md) — what is still needed, and where it goes
- **Publishing:** [`docs/PUBLISHING.md`](docs/PUBLISHING.md) — how to push this to GitHub and go live
- **Specification:** [`docs/PRD-portfolio-farhan-shehzad.md`](docs/PRD-portfolio-farhan-shehzad.md)
- **Technical design:** [`docs/TRD-portfolio-farhan-shehzad.md`](docs/TRD-portfolio-farhan-shehzad.md)

---

## The thing that makes this repository unusual

Most of Farhan's work is confidential — internal pipelines and private integrations inside other companies' systems. None of it can be linked to. So the site cannot prove its claims by showing artifacts, and has to be careful with the truth instead.

That care is enforced by the build, not by good intentions.

Every factual claim carries an **evidence tier**, and `npm run build` fails if a claim is presented above the tier its evidence supports:

| Tier | Meaning | Rule the build enforces |
|---|---|---|
| `verifiable` | A visitor can confirm it via a public link | Must carry `evidenceUrl` |
| `measured` | A first-party measurement | Must carry a `basis` of ≥ 60 characters stating what was sampled, before/after, period |
| `counted` | A first-party count | Same |
| `capability` | A description of what he can do | **No digits permitted anywhere in the value** |

So a number with no stated basis is not a code-review comment here. It is a red build. The rules live in one readable file, [`src/lib/validate-content.ts`](src/lib/validate-content.ts), and each one has a unit-testable failure case.

```
$ npm run validate:content

  CV-1
    cv-anonymization → outcomes[1].basis
      tier 'measured' requires a basis of at least 60 characters (found 0). It must state
      what was sampled, the before and after values, the period, and that it is a
      first-party measurement. If that cannot be written honestly, drop the number and use
      tier 'capability' instead. See PRD section 6.4.
```

---

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build        # validates content, then exports to out/
npm run serve        # serve the exported site exactly as Pages will
```

Node 22 LTS (see `.nvmrc`). Node 24 also works locally; CI pins 22 for reproducibility.

---

## Adding a case study

Four steps, no code changes.

1. Create `src/content/case-studies/<slug>.ts` exporting a `CaseStudy` — copy an existing one as the shape.
2. Create `src/content/case-studies/approach/<slug>.mdx` with the approach narrative.
3. Add both to `src/content/case-studies/records.ts` and `index.ts`.
4. Run `npm run build` and fix whatever the validator objects to.

The route, the sitemap entry, the work-index card, the home-page card and the previous/next links all derive from the content modules. If any of them ever needs a manual edit, that is a bug in the architecture, not a fifth step.

---

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Development server. Skips the prebuild for speed. |
| `npm run build` | `prebuild` (validate + metadata) then `next build` → `out/` |
| `npm run serve` | Serve `out/` locally, exactly as GitHub Pages will |
| `npm run validate:content` | The evidence-policy gate. Errors block the build. |
| `npm run validate:strict` | Warnings block too. **The release gate** — see below. |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint, including `jsx-a11y` |
| `npm run build:meta` | Regenerates git-derived dates for the footer and sitemap |

---

## Current status: not ready to launch

The site builds, deploys, and every route renders. The content is **structurally complete and factually incomplete**, on purpose.

`npm run validate:strict` currently reports around 38 outstanding items. Each maps to a question in PRD section 22 that only Farhan can answer:

| Marker | Blocks | Question |
|---|---|---|
| `TODO(LI)` | All employment dates and titles | Reconcile against the LinkedIn profile. Dates are factual claims and none of the ones in this repository are verified. |
| `TODO(Q1)`, `TODO(Q2)` | The whole Proglo case study | Written permission from Proglo World, and the precise ownership boundary |
| `TODO(Q4)`, `TODO(Q5)` | Both ~80% metrics | The measurement basis. **Until supplied, the numbers are absent** — the claims sit at tier `capability` with no figure at all, rather than appearing with a placeholder. |
| `TODO(Q7)` | The CV anonymization case study | Permission from Expinder on the level of detail |
| `TODO(Q11)` | The publication link | Confirm the MDPI DOI. Currently unlinked, because a wrong DOI is worse than none. |
| `TODO(content)` | Various | Prose that needs writing rather than inventing |

Launch also requires, and none of these exist yet:

- **OG images.** Every page emits `og:image` tags pointing at `/og/*.png`, and those files are not generated yet — `scripts/generate-og.ts` is phase 4. Until it runs, social cards will show a broken image. This is the most visible of the gaps.
- **The résumé PDF** (`FR-R2`). `/resume/` links to `/farhan-shehzad-resume.pdf`, which 404s until `npm run build:resume` exists and has been run.
- The five SVG schematics (`FR-C5`), a contact-form provider (`FR-CT3`, TRD T2), an analytics provider (`FR-AN1`, TRD T1), and the manual NVDA and VoiceOver passes (`FR-AC10`).
- The four remaining CI gates — axe, Lighthouse, link checking, and the no-JS pass — are specified in the workflow file as a commented block and are not yet wired.

**The site is publishable at every commit** in the sense that it contains no claim its author cannot support. It is not *finished*.

---

## Deployment

Merge to `main` → `.github/workflows/deploy.yml` → live in under three minutes.

**One-time setup, without which the workflow runs green and nothing appears:**

> Settings → Pages → Build and deployment → Source: **GitHub Actions** (not "Deploy from a branch").

The full first-time checklist is in [TRD section 17.1](docs/TRD-portfolio-farhan-shehzad.md).

### Rollback

1. **Re-run the last good deployment** — Actions → the previous successful *Deploy* run → "Re-run all jobs". Fastest, but leaves `main` in the broken state.
2. **Revert the commit** — `git revert <sha>`, open a PR, merge. Slower by one build, and preferred when the cause is known, because it leaves the history honest.

### Moving to a custom domain

1. Change `SITE_URL` in [`src/lib/constants.ts`](src/lib/constants.ts).
2. Add `public/CNAME` containing the apex domain, one line, no scheme.
3. Point DNS at GitHub Pages, set the domain in Settings → Pages, then tick Enforce HTTPS once the certificate provisions.

That is the whole migration. `basePath` never enters the picture, because this deploys as a GitHub *user site* served from the domain root (ADR-007).

---

## Known deviation from the specification

**NFR-6 is missed.** The PRD budgets 90 KB of gzipped JavaScript on the home page; the build ships ~104 KB, of which ~103 KB is the React and Next.js App Router runtime and ~1.4 KB is application code.

There is no tuning path to 90 KB — deleting both client components recovers under 2 KB. PRD ADR-001 anticipated this and wrote the exit condition in advance ("revisit if the JS budget cannot be met"); [ADR-010](docs/TRD-portfolio-farhan-shehzad.md) is that revisit and amends the budget to 110 KB. The user-facing targets that actually matter — LCP, CLS, INP, Lighthouse — are unaffected.

---

## Licence

- **Source code:** MIT. Take anything useful.
- **Site content** — prose, case studies, biography, CV, schematics: © 2026 Farhan Shehzad, all rights reserved.

See [`LICENSE`](LICENSE).
