# Content TODO inventory

Everything blocking `npm run validate:strict`, grouped by what is needed rather than by file.

**62 markers across 16 files. 8 of 13 live pages currently display TODO text to visitors.**

| Live page | Visible markers |
|---|---|
| `/about/` | 19 |
| `/work/cv-anonymization/` | 17 |
| `/work/inventory-planning/` | 17 |
| `/resume/` | 15 |
| `/work/content-pipeline/` | 15 |
| `/work/order-fulfillment/` | 15 |
| `/work/proglo-shipping/` | 13 |
| `/` (home) | 10 |

Clean already: `/work/`, `/stack/`, `/contact/`, `/privacy/`, `404`.

---

## Block A — Facts only you have

Fastest to answer, and they clear the most pages. **Start here.**

### A1. Employment dates and titles — 12 markers, 5 roles

Every date in the repository is inferred, not verified. `roles.ts` says so in a header comment.
These appear on `/about/`, `/resume/` and the home page.

For each role I need: **exact title**, **start month**, **end month**, **employment type**,
**location**, and whether it was remote.

| Role | Currently assumed | File |
|---|---|---|
| Expinder | AI Automation Engineer · Contract · 2026-01 → present · Remote | `src/content/roles.ts:25` |
| LeadForge | Automation Engineer · Contract · 2024-01 → 2026-01 · Remote | `src/content/roles.ts:40` |
| Proglo World | Full-Stack Engineer · Full-time · 2023-01 → 2026-01 · Remote | `src/content/roles.ts:55` |
| Karmic Seed | Automation Engineer · Freelance · 2022-01 → 2024-01 · Remote | `src/content/roles.ts:73` |
| Sadabyte | Software Engineer · Full-time · 2020-01 → 2022-01 · Lahore | `src/content/roles.ts:89` |

Each role also needs a **one-line summary** (`oneLine`, shown on the home page) and
**3–5 bullets** (`bullets`, shown on `/about/` and `/resume/`).

Sadabyte has **no real bullets at all** — `roles.ts:98` is the only bullet and it is a placeholder. It is the weakest
entry on the site.

The same dates are duplicated on each case study record (`period`), so I will sync them:
`proglo-shipping.ts:24`, `cv-anonymization.ts:19`, `order-fulfillment.ts:16`,
`content-pipeline.ts:15`, `inventory-planning.ts:15`.

### A2. Publication identifiers — `src/content/publications.ts:17`

- **DOI** for "Binned Term Count: An Alternative to Term Frequency for Text Categorization",
  *Mathematics* (MDPI), 2022
- **Canonical MDPI URL**

Currently both are `undefined`, so the paper renders with no link anywhere and the manifest
strip drops its "PUBLISHED" row entirely. A wrong DOI is worse than none, which is why I did
not guess.

### A3. Profile links — `src/content/site.ts:32`

- **Exact LinkedIn URL** (I assumed `linkedin.com/in/farhanshehzad155` — unverified)
- **ORCID** and/or **Google Scholar** URL, if you have them

These feed the JSON-LD `Person.sameAs` array (FR-SEO5), the footer, and the contact page.

### A4. Availability — `src/content/site.ts:22`

`available` is `false`, so the "Open to work" chip does not render and the manifest strip has
no STATUS row. I need:

- Are you open to work? (yes/no)
- If yes: full-time, contract, or both? Remote, hybrid, or onsite?

### A5. Photograph — `src/content/site.ts:40`

FR-A7 permits a professional photograph or none — no AI avatar, no illustration. Send a file,
or say "none" and I will remove the field permanently.

---

## Block B — Permissions

External, so they take calendar time. **Start these in parallel with Block A.**

### B1. Proglo World — Q1, Q2, Q3 — 7 markers

The flagship case study. `src/content/case-studies/proglo-shipping.ts`

Written confirmation needed covering: use of the **product name**, use of the **logo**,
description of the **stack**, and the specific **contribution claims**.

Then: **exactly which components did you own solo versus contribute to?** (`:47`) The current
scope statement is deliberately cautious and needs tightening to be accurate.

And Q3 (`:34`): **is the `/docs` OpenAPI spec the one you authored**, and may it be cited as
evidence? It is currently linked as evidence of your work.

> If permission is refused, FR-PS6 has a prepared fallback: rename to "a US-based multi-carrier
> shipping platform", drop the links, and promote `cv-anonymization` to flagship. Content edit
> only, no code.

### B2. Expinder — Q7 — 10 markers

`src/content/case-studies/cv-anonymization.ts` and its approach body.

How much of the CV anonymization system may be described publicly? The PRD asks for
architecture-level detail, which is usually fine, but it should be confirmed rather than
assumed given you are currently engaged there.

### B3. Karmic Seed and LeadForge — Q14 — `src/content/roles.ts:84`

Both engagements have ended. Any objection to being named in case studies? (PRD rule C1
permits it; this is a courtesy check.)

---

## Block C — Metric bases

**There are currently no numbers anywhere on the site.** Every outcome sits at tier
`capability`. That is deliberate — a number without a basis fails the build — but it also means
the site's strongest claims are missing.

To restore each number I need four things: **what was sampled**, **before and after values**,
**over what period**, and confirmation it is your own measurement.

| Claim | Restores to | PRD |
|---|---|---|
| ~80% less manual effort on CV anonymization | `cv-anonymization.ts` outcomes | Q4 |
| ~80% less effort per order in fulfillment | `order-fulfillment.ts` outcomes | Q5 |
| 500+ listings across 20+ stores | `content-pipeline.ts` outcomes | Q6 |
| 50+ delivered automation solutions | Home / about | Q6 |

Example of a basis that passes (≥60 chars, all four elements):

> Timed sample of 40 CVs before and after automation. Manual anonymization averaged ~11 minutes
> per CV; the assisted pipeline averaged ~2 minutes including human review. Measured over the
> first six weeks of production use. My own measurement on internal work, not an audited
> benchmark.

If a basis cannot be reconstructed honestly, say so and the claim stays qualitative. A missing
number costs less than a challenged one.

---

## Block D — Case study prose — 25 `TODO(content)` markers

Each case study needs the same five things. Bold = **currently shows placeholder text on the
live site**.

| Case study | Needs |
|---|---|
| **Proglo Shipping** | **problem**, **constraints[3]**, **whatDidNotWork**, approach body (5 sections: Go service, spec sync, Next.js rendering, barcode workflow, Apps Script pipeline), plus a rejected alternative |
| **CV anonymization** | **constraints[3]**, **whatDidNotWork**, approach body (mechanics, confidence/human review, rejected alternative, data handling) |
| **Order fulfillment** | **context** (80–150 words), **constraints[3]**, **whatDidNotWork**, approach body (carton selection method, rejected alternative, edge cases) |
| **Content pipeline** | **context**, **contribution** (human review step), **constraints[3]**, **whatDidNotWork**, approach body (quality controls, rejected alternative) |
| **Inventory planning** | **context**, **contribution** (the actual forecasting method), **constraints[2]**, **whatDidNotWork**, approach body (model, method, rejected alternative, price monitor) |

Three of these recur and are worth calling out:

**`whatDidNotWork` is required on all five** (rule CV-2). Name one thing that failed or had to
be revised. This is the section a hiring engineer looks for, and its absence is what makes a
case study read as marketing.

**A rejected alternative is required in every approach body** (FR-C5). What you considered and
did not do, and why.

**The forecasting method in `inventory-planning`** (`:28`) — FR-IP2 asks you to state plainly
how simple it was. If it was a moving average with a lead-time buffer, say exactly that. An
honest heuristic described well beats an implied ML system.

### Also in Block D

- **`src/content/site.ts:60`** — the `/about/` bio stops mid-paragraph at "That turned into five
  years of automation work. TODO(content): continue…". Needs 300–450 words total, first person.
  **This is the single most visible placeholder on the site.**
- **`src/content/projects.ts:19`** — FitnessTime has no description. One honest sentence, or cut
  the entry.

---

## Block E — Missing assets

Not text, but they are launch blockers and two of them are visibly broken right now.

| Asset | Status | Blocks |
|---|---|---|
| **OG images** (`/og/*.png`) | Not generated. Every page emits `og:image` pointing at a 404, so any link you share shows a broken card. | FR-SEO4 |
| **Résumé PDF** (`/farhan-shehzad-resume.pdf`) | Does not exist. The Download button on `/resume/` 404s. | FR-R2, `resume/page.tsx:69` |
| **5 SVG schematics** | Not drawn. Each case study renders without one. | FR-C5 |
| **Analytics provider** | Undecided — GoatCounter, Umami, or Plausible? | FR-AN1, TRD T1 |
| **Contact form provider** | Undecided — Web3Forms or Formspree? | FR-CT3, TRD T2 |

The first three I can build once the content exists. The last two are your choice.

---

## Suggested order

1. **Block A** — an hour with your LinkedIn open clears 12 markers and most of `/about/` and
   `/resume/`.
2. **Block B** — send the emails today; they gate the flagship.
3. **Block D** — the bulk of the writing. One case study at a time.
4. **Block C** — as the measurements come back.
5. **Block E** — I generate these once D is stable.

Send me any block in any format. Rough notes are fine; I will write them up to the PRD's voice
rules (§6.2) and run them past the validator.
