# farhanshehzad155.github.io

Personal engineering portfolio for **Farhan Shehzad** — AI automation and integration engineer.

A static Next.js site, deployed to GitHub Pages on merge to `main`. No server, no database, no CMS.

- **Live:** https://farhanshehzad155.github.io
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

## Current status: live, indexed, and not finished

Every page carries real content. No placeholder text renders anywhere, dates and titles are confirmed, and the site is open to search engines (`SITE_INDEXABLE` in `src/lib/constants.ts`).

`npm run validate:strict` still reports **9 warnings**, none of which are inaccuracies. They are quality gaps, in rough order of how much they cost:

| Rule | Count | What it means |
|---|---|---|
| `CV-15` | 3 | Three role bullets carry a number — two `~80%` and one `50+` — without the measured basis PRD §6.3 requires. **This is the one worth closing.** Supply what was sampled, before and after, and over what period (PRD Q4, Q5, Q6), and the numbers move into the case study outcomes where they render with a footnote and the build can enforce them. |
| `CV-2b` | 5 | No case study has a "what did not work" section (FR-C7). It cannot be inferred — only the person who built the thing knows — so the section is omitted rather than fabricated. It is what a hiring engineer looks for, and its absence is the biggest single weakness on the site. |

Still outstanding, and not blocking:

- **OG images.** Every page emits `og:image` pointing at `/og/*.png`, and those are not generated yet (`scripts/generate-og.ts`, phase 4). Any link shared on social shows a broken card.
- The five SVG schematics (`FR-C5`), a contact-form provider (`FR-CT3`, TRD T2), an analytics provider (`FR-AN1`, TRD T1), and the manual NVDA and VoiceOver passes (`FR-AC10`).
- Four CI gates — axe, Lighthouse, link checking, and the no-JS pass — are specified as a commented block in the workflow and not yet wired.
- Written permission from Proglo World (PRD Q1) and Expinder (Q7). Both case studies describe only Farhan's own work using his own words, and both companies already appear on his public LinkedIn, but the PRD asks for written confirmation and it has not been obtained.

---

## Deployment

Merge to `main` → `.github/workflows/deploy.yml` → live in under three minutes.

**One-time setup, without which the workflow runs green and nothing appears:**

> Settings → Pages → Build and deployment → Source: **GitHub Actions** (not "Deploy from a branch").

The full first-time checklist is in [TRD section 17.1](docs/TRD-portfolio-farhan-shehzad.md).

### Branch protection

`main` is protected by a repository ruleset, because merging to `main` deploys to the live site. Direct pushes are rejected. Every change goes through a pull request:

```bash
git switch -c my-change
# ... edit, commit ...
git push -u origin my-change
gh pr create --fill
# CI runs (~90s). Merge once the three checks are green.
```

The rules: no force-push, no branch deletion, a pull request is required (zero approvals — you can merge your own), and three checks must pass: `Types, lint, content`, `Build and export`, `Dependency audit`.

Admin bypass is set to `pull_request` rather than `always`, and the difference is not cosmetic. Under `always`, a direct `git push` to `main` **succeeds** and merely prints the rule violations as a warning, which makes the whole ruleset advisory. Under `pull_request` the push is genuinely rejected, and the bypass only lets you merge a PR whose checks are failing — an emergency valve that still leaves a reviewable record.

If CI is broken for an unrelated reason and something must ship, disable the ruleset in Settings → Rules, push, then re-enable it. Deliberate and visible beats a permanent hole.

### Rollback

1. **Re-run the last good deployment** — Actions → the previous successful *Deploy* run → "Re-run all jobs". Fastest, but leaves `main` in the broken state.
2. **Revert the commit** — `git revert <sha>`, open a PR, merge. Slower by one build, and preferred when the cause is known, because it leaves the history honest.

### Moving to a custom domain

1. Change `SITE_URL` in [`src/lib/constants.ts`](src/lib/constants.ts).
2. Add `public/CNAME` containing the apex domain, one line, no scheme.
3. Point DNS at GitHub Pages, set the domain in Settings → Pages, then tick Enforce HTTPS once the certificate provisions.

That is the whole migration. `basePath` never enters the picture, because this deploys as a GitHub *user site* served from the domain root (ADR-007).

---

## Known deviations from the specification

**FR-R2 dropped: there is no résumé PDF.** The site is the résumé. This leaves the P0 user story US-2 (recruiter downloads a PDF to attach to a submission) unmet; the print stylesheet is promoted to P0 as the mitigation. Owner decision, recorded as [ADR-011](docs/TRD-portfolio-farhan-shehzad.md).

**NFR-6 is missed.** The PRD budgets 90 KB of gzipped JavaScript on the home page; the build ships ~104 KB, of which ~103 KB is the React and Next.js App Router runtime and ~1.4 KB is application code.

There is no tuning path to 90 KB — deleting both client components recovers under 2 KB. PRD ADR-001 anticipated this and wrote the exit condition in advance ("revisit if the JS budget cannot be met"); [ADR-010](docs/TRD-portfolio-farhan-shehzad.md) is that revisit and amends the budget to 110 KB. The user-facing targets that actually matter — LCP, CLS, INP, Lighthouse — are unaffected.

---

## Licence

- **Source code:** MIT. Take anything useful.
- **Site content** — prose, case studies, biography, CV, schematics: © 2026 Farhan Shehzad, all rights reserved.

See [`LICENSE`](LICENSE).
