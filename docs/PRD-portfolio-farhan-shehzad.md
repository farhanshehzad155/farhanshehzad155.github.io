# Product Requirements Document
## Personal Engineering Portfolio — Farhan Shehzad

| Field | Value |
|---|---|
| Product name | `farhanshehzad.dev` (working title) — personal engineering portfolio |
| Document version | 1.0 |
| Status | Draft for approval |
| Date | 28 August 2026 |
| Owner / Product | Farhan Shehzad |
| Engineer | Farhan Shehzad |
| Primary surface | Static site on GitHub Pages, custom domain |
| Secondary surface | GitHub profile README (`farhanshehzad/farhanshehzad`) |
| Repository | `github.com/<handle>/portfolio` (public) |

---

## 1. Document control

### 1.1 Purpose
This document is the single source of truth for building and launching the portfolio. It defines scope, content, evidence standards, functional and non-functional requirements, the content model, the design system, the technical architecture, and the acceptance criteria. Any change to scope after approval is logged in §22.

### 1.2 Terminology
- **Case study** — a long-form page about one body of work, with context, constraints, approach, and outcome.
- **Evidence tier** — the confidence classification attached to every factual claim on the site (§6.3).
- **Artifact** — anything a visitor can independently verify: a live URL, a DOI, a public repo, a published package.
- **Surface** — a distinct place a visitor may encounter the work (site, GitHub profile, LinkedIn, PDF résumé).

### 1.3 Related inputs
- LinkedIn profile export (roles, dates, skills, publication) — provided.
- `progloshipping.com` — live production product, publicly reachable, includes a public API documentation route at `/docs`.
- MDPI *Mathematics* (2022) publication, "Binned Term Count: An Alternative to Term Frequency for Text Categorization".

---

## 2. Executive summary

Farhan is an AI/automation engineer with a five-year delivery record across recruitment tech, e-commerce, and marketing operations. The bulk of that work is invisible: internal automations, client-owned n8n workflows, private integrations, and pipelines running inside other companies' accounts. None of it can be linked to.

That creates a specific problem this site has to solve: **prove depth without being able to show most of the artifacts.**

The site therefore has two jobs. First, it anchors credibility on the small set of things that *are* verifiable and linkable — the Proglo Shipping platform, the peer-reviewed publication, and any public repositories. Second, it converts the non-linkable automation work into readable engineering narrative, so a reader judges the reasoning rather than looking for a screenshot that will never exist.

The output is a fast, static, accessible site: one home page that establishes position in under fifteen seconds, four to five case studies that carry the depth, and a contact path that works without a backend.

---

## 3. Problem statement and opportunity

### 3.1 Current state
- Discovery happens entirely on LinkedIn, where the format flattens five years of work into bullet lists that read identically to every other profile.
- The profile carries strong quantitative claims (~80% reduction in CV anonymization effort; ~80% reduction in order-fulfillment effort; 500+ products across 20+ stores; 50+ delivered solutions) with no supporting narrative. Unsupported numbers of that size invite skepticism rather than confidence.
- The one live, public, production system he contributed to (Proglo Shipping) is mentioned only as a company name in an experience entry. A reader cannot tell there is a real product behind it.
- Analytics show 36 profile views and 27 search appearances in a 7-day window — small but non-zero inbound interest with no destination to convert it.

### 3.2 Why now
Two of the four listed roles ended in 2026, and the current Expinder engagement is a contract. Inbound-ready positioning matters more during contract work than during permanent employment.

### 3.3 Opportunity
A recruiter spends 30–90 seconds on first contact. A hiring engineer who gets past that spends 5–15 minutes. The site must serve both: a scannable top layer that answers *what is he, what has he shipped, is he available*, and a deep layer that answers *can he actually design a system*.

---

## 4. Goals, non-goals, success metrics

### 4.1 Goals
| ID | Goal |
|---|---|
| G1 | Communicate a clear professional position — AI automation and integration engineer who ships production systems — within 15 seconds of page load. |
| G2 | Make the verifiable work unmissable: Proglo Shipping, the MDPI publication, public repositories. |
| G3 | Turn non-linkable automation work into credible engineering case studies that survive technical scrutiny. |
| G4 | Give every quantitative claim a stated basis, so numbers read as measured rather than asserted. |
| G5 | Provide a frictionless contact path for recruiters and prospective clients. |
| G6 | Demonstrate front-end craft implicitly — the site is itself a work sample for the Next.js / TypeScript / Tailwind skills claimed. |
| G7 | Keep maintenance cost near zero: content lives in typed data files, deploys happen on push. |

### 4.2 Non-goals
| ID | Non-goal |
|---|---|
| NG1 | Not a blog or content-marketing engine at v1. Article infrastructure ships in v2 (§23). |
| NG2 | Not a client dashboard, playground, or live demo of client systems. No client data touches this site, real or masked. |
| NG3 | Not a general "hire me for anything" freelancing storefront. Positioning is narrow on purpose. |
| NG4 | No CMS, no database, no server runtime, no authentication at v1. |
| NG5 | Not a link dump of every one of the 50+ freelance deliverables. Depth over inventory. |

### 4.3 Success metrics

**Primary (outcome)**
| Metric | Target (90 days post-launch) |
|---|---|
| Qualified inbound contacts (recruiter or client, not spam) | ≥ 8 |
| Contact-page conversion from case-study readers | ≥ 4% of case-study sessions |
| Résumé PDF downloads | ≥ 40 |

**Secondary (engagement)**
| Metric | Target |
|---|---|
| Median time on any case study page | ≥ 90 seconds |
| Scroll depth ≥ 75% on the flagship Proglo case study | ≥ 35% of sessions |
| Home → case study click-through | ≥ 25% |
| Bounce on home (single event, < 10s) | ≤ 45% |

**Quality gates (must pass before launch)**
| Metric | Target |
|---|---|
| Lighthouse Performance / Accessibility / Best Practices / SEO (mobile) | ≥ 95 each |
| Largest Contentful Paint, throttled 4G | ≤ 1.8 s |
| Cumulative Layout Shift | ≤ 0.05 |
| Interaction to Next Paint | ≤ 200 ms |
| Total JavaScript, home page, gzipped | ≤ 90 KB |
| WCAG 2.2 Level AA automated violations (axe) | 0 |
| Broken internal or external links | 0 |

---

## 5. Audiences and user stories

### 5.1 Personas

**P1 — Technical recruiter / talent partner.** Screens 40 profiles a day. Skims. Needs role fit, seniority signal, stack keywords, location and availability, and a downloadable résumé. Will not read a case study.

**P2 — Hiring engineer or engineering manager.** Reached the site from a shortlist. Wants evidence of system design, trade-off reasoning, and honesty about scope. Actively looks for inflated claims. Will read one case study end to end and judge everything on it.

**P3 — Founder or agency owner sourcing contract help.** Wants to know whether Farhan has solved *their* shape of problem (e-commerce ops, recruitment ops, content pipelines). Skims outcomes, then jumps to contact.

**P4 — Peer engineer / researcher.** Arrived from the publication or GitHub. Interested in the BTC paper or a repository. Low commercial value, high credibility value — they link and mention.

### 5.2 User stories

| ID | As a… | I want to… | So that… | Priority |
|---|---|---|---|---|
| US-1 | P1 | see role, stack, and location above the fold | I can triage in 10 seconds | P0 |
| US-2 | P1 | download a one-page PDF résumé from any page | I can attach it to a submission | P0 |
| US-3 | P1 | copy the email address in one click | I can start outreach | P0 |
| US-4 | P2 | read how a system was designed, not just what it achieved | I can assess engineering judgement | P0 |
| US-5 | P2 | open a live product he worked on | I can verify the work exists | P0 |
| US-6 | P2 | understand exactly which parts he owned on a team product | I am not misled about scope | P0 |
| US-7 | P2 | see how a stated metric was measured | I can trust the number | P1 |
| US-8 | P3 | filter or scan work by domain (e-commerce, recruitment, content) | I can find a match for my problem | P1 |
| US-9 | P3 | send a message without leaving the site | contact is frictionless | P1 |
| US-10 | P4 | reach the publication DOI and abstract | I can cite or read it | P1 |
| US-11 | Any | read the site comfortably on a phone in daylight | I am not excluded by the medium | P0 |
| US-12 | Any | navigate entirely by keyboard with a screen reader | the site is usable regardless of input method | P0 |

---

## 6. Content strategy and evidence policy

This section is a hard requirement, not editorial guidance. It exists because the strongest thing this site can do is be visibly careful with the truth, and the fastest way to lose P2 is one claim that does not hold up.

### 6.1 Confidentiality rules (non-negotiable)

| Rule | Detail |
|---|---|
| C1 | No client or employer name appears on the site unless it already appears on the public LinkedIn profile. Currently permitted: Expinder, LeadForge, Proglo World, Karmic Seed, Sadabyte, University of Gujrat, University of the Punjab (PUCIT). |
| C2 | No end-client of an agency engagement is named at all. Refer to them by sector and shape: "a US wellness brand shipping via Amazon FBM and Shopify". |
| C3 | No screenshots of client dashboards, CRMs, inboxes, or internal tooling — not even redacted. Redaction fails more often than it works. |
| C4 | No verbatim code from private repositories. Illustrative snippets must be rewritten from scratch against a generic domain, and labelled as illustrative. |
| C5 | No real candidate, customer, order, or lead data in any form, including screenshots, tables, sample payloads, or example CSVs. All examples use synthetic data. |
| C6 | No architecture diagram that reveals a client's internal service names, hostnames, queue names, or vendor contracts. Diagrams use generic role labels ("CRM", "ATS", "object storage"). |
| C7 | Before the Proglo Shipping case study is published, written confirmation is obtained from Proglo World LLC covering: use of the product name, use of the logo, description of the stack, and the specific contribution claims. See §22. |

### 6.2 Voice and register
- First person singular. "I built", not "we leveraged".
- Plain verbs. No "spearheaded", "orchestrated", "revolutionised", "cutting-edge", "seamless".
- Specific over impressive. "Selects a carton by volumetric weight before rating" beats "intelligent packaging optimisation".
- Team work is described as team work. Where Farhan owned a slice, the slice is named and the rest is credited to the team.
- No em-dash-heavy, list-of-three cadence that reads as machine-written. Vary sentence length.

### 6.3 Evidence tiers

Every factual claim on the site is classified. The tier determines how it may be presented.

| Tier | Definition | Presentation rule |
|---|---|---|
| **A — Verifiable** | A visitor can confirm it themselves via a public link. | May be stated plainly and prominently. Must carry the link. Examples: progloshipping.com is live; the MDPI paper exists at its DOI; the public API docs route exists. |
| **B — Measured, first-party** | Farhan measured it, but the evidence is private. | Must be stated with its basis inline or in a footnote: what was measured, over what period, against what baseline. Examples: ~80% reduction in CV anonymization effort; ~80% reduction in order-fulfillment effort. |
| **C — Countable, first-party** | A count Farhan can substantiate from his own records. | Stated with a scope qualifier and a date range. Examples: 50+ delivered automation solutions (2020–2026, freelance and contract); 500+ product listings improved across 20+ stores. |
| **D — Capability** | A description of what he can do, with no attached number. | Stated as capability, never as achievement. No numbers permitted. |

**Rule:** no Tier B or C claim appears anywhere on the site without its qualifier. A number without a basis is removed rather than softened.

### 6.4 Metric footnote pattern

Every Tier B/C number renders as a `<button>` with a superscript marker that expands an inline note (details/summary or popover, keyboard accessible, no JS required for the content to be readable).

Example, for the CV anonymization claim:

> **~80% less manual effort** on CV anonymization.^m1
>
> ^m1 — *Basis: timed sample of 40 CVs before and after automation. Manual anonymization averaged ~11 minutes per CV; the assisted pipeline averaged ~2 minutes including human review. Measured over the first six weeks of production use. Figures are my own measurements on internal work, not an audited benchmark.*

Every footnote must state: what was sampled, the before and after values, the period, and an explicit note that it is a first-party measurement. If any of those cannot be honestly filled in, the metric is downgraded to Tier D and the number is dropped.

### 6.5 Handling non-linkable work

Automation work has no URL. The case study substitutes engineering narrative for artifacts, in a fixed structure (§8.4). Where a visual is needed, use a **system schematic** — a diagram of generic components and data flow, drawn as an SVG in the site's own design language, with no client-identifying labels. Schematics are drawn from the shape of the problem, not exported from any real tool.

---

## 7. Information architecture

### 7.1 Sitemap

```
/                             Home
/work                         Work index (all case studies, filterable)
/work/proglo-shipping         Flagship — live product, Tier A
/work/cv-anonymization        Recruitment document pipeline (Expinder)
/work/order-fulfillment       E-commerce fulfillment automation (Karmic Seed)
/work/content-pipeline        AI content production pipeline (LeadForge)
/work/inventory-planning      Demand-driven manufacturing planner (Karmic Seed)
/about                        Long-form bio, timeline, research, education
/stack                        Tools and how they are chosen (optional, P2)
/resume                       HTML résumé + PDF download
/contact                      Contact form + direct channels
/404                          Not found

/sitemap.xml  /robots.txt  /rss.xml (v2)  /llms.txt  /og/*.png (generated)
```

### 7.2 Navigation
- **Header:** wordmark (left); `Work`, `About`, `Résumé`, `Contact` (right). Sticky on desktop after 400px scroll, static on mobile. No hamburger above 640px.
- **Footer:** email, GitHub, LinkedIn, Google Scholar/DOI, location and timezone, last-updated date, source-code link to the repository.
- **Case study footer:** previous / next case study, and a single contact CTA.
- Maximum depth: two clicks from home to any content.

### 7.3 Priority of home-page content
1. Position statement and availability
2. Verifiable proof strip
3. Flagship case study
4. Remaining case studies
5. Capabilities / stack
6. Experience summary
7. Research
8. Contact

---

## 8. Page requirements

Requirement IDs are stable. `P0` must ship at launch; `P1` should ship at launch; `P2` may follow.

### 8.1 Global requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-G1 | Every page renders fully as static HTML with no client-side data fetching. | P0 |
| FR-G2 | Every page has a unique `<title>`, meta description, canonical URL, and generated OG image. | P0 |
| FR-G3 | Skip-to-content link is the first focusable element on every page. | P0 |
| FR-G4 | Theme respects `prefers-color-scheme` with a manual toggle persisted in `localStorage`; no flash of incorrect theme (inline script in `<head>`). | P0 |
| FR-G5 | All motion is suppressed under `prefers-reduced-motion: reduce`. | P0 |
| FR-G6 | All external links carry `rel="noopener noreferrer"` and a visually-hidden "opens in new tab" hint. | P0 |
| FR-G7 | Footer displays the content's last-updated date, sourced from git commit date at build time. | P1 |
| FR-G8 | A persistent, low-weight "Available for …" status chip reflects a single boolean in site config. | P1 |
| FR-G9 | Email address is rendered as text and as a one-click copy button with a confirmation toast. | P0 |
| FR-G10 | 404 page offers three links: Work, About, Contact. | P0 |

### 8.2 Home (`/`)

| ID | Requirement | Priority |
|---|---|---|
| FR-H1 | **Hero.** Name, one-line position statement, two-line supporting statement, availability chip, primary CTA (`See the work`), secondary CTA (`Download résumé`). | P0 |
| FR-H2 | **Manifest strip** (signature element, §10.5). A monospace band directly under the hero listing four to six verifiable facts, each a link where a link exists: live product, publication DOI, years shipping, primary stack. Renders as static content; the reveal animation is progressive enhancement. | P0 |
| FR-H3 | **Flagship card.** Proglo Shipping gets a full-width card, visually distinct from the rest, carrying a "Live product" badge and an outbound link to progloshipping.com alongside the internal case-study link. | P0 |
| FR-H4 | **Selected work.** Three to four further case study cards: title, one-line problem statement, one outcome (with tier qualifier), three stack tags, domain tag. | P0 |
| FR-H5 | **Capabilities.** Four grouped clusters (§8.7), each a heading plus a sentence plus its tools. Not a logo wall, not a skill bar chart, no percentage proficiency indicators. | P0 |
| FR-H6 | **Experience summary.** Compact list of the five roles: company, title, dates, one line. Links to `/about` for detail. | P1 |
| FR-H7 | **Research.** Single block for the MDPI publication with title, venue, year, and DOI link. | P1 |
| FR-H8 | **Closing CTA.** Contact prompt with email, LinkedIn, GitHub. | P0 |
| FR-H9 | Home page contains no client-side JavaScript beyond the theme script, copy-to-clipboard, and the analytics beacon. | P0 |

### 8.3 Work index (`/work`)

| ID | Requirement | Priority |
|---|---|---|
| FR-W1 | Lists all case studies as cards, ordered by a `featured` flag then reverse-chronologically. | P0 |
| FR-W2 | Filter chips by domain: E-commerce, Recruitment / HR tech, Content & marketing, Platform / full-stack. Filtering is CSS/URL-hash based where possible; if JS is used, the unfiltered list is the no-JS default. | P1 |
| FR-W3 | Each card shows: title, client sector, year range, one-line problem, primary outcome, stack tags, and a `Live` badge where a public artifact exists. | P0 |
| FR-W4 | A short intro paragraph sets expectations honestly — that most of the work is internal to client systems and therefore described rather than demonstrated. | P0 |

### 8.4 Case study template (`/work/[slug]`)

Every case study follows the same eight-part structure. Deviating from the structure is a content bug.

| ID | Section | Requirement | Priority |
|---|---|---|---|
| FR-C1 | Header | Title, role, organisation, period, and a one-sentence summary. If a live artifact exists, a prominent outbound button. | P0 |
| FR-C2 | Context | What the organisation does and what was happening operationally. 80–150 words. No jargon. | P0 |
| FR-C3 | Problem | The specific failure mode, in concrete terms, including what the manual process cost. | P0 |
| FR-C4 | Constraints | Budget, data sensitivity, existing vendors, team size, deadlines, what could not be changed. This section is what separates a real case study from a marketing blurb — it is mandatory. | P0 |
| FR-C5 | Approach | How the system was designed. Includes one system schematic (SVG). Names the key decisions and at least one rejected alternative with the reason for rejection. | P0 |
| FR-C6 | My contribution | Explicit scope statement. On team products, states precisely which components were owned and credits the rest to the team. | P0 |
| FR-C7 | Outcome | Results with evidence tier qualifiers and footnotes per §6.4. Includes at least one thing that did not work or had to be revised. | P0 |
| FR-C8 | Stack | The tools used, and one line on why each was chosen over the obvious alternative. | P1 |
| FR-C9 | — | Reading time estimate displayed in the header; target 4–7 minutes per case study. | P2 |
| FR-C10 | — | Previous / next navigation and a single contact CTA in the footer. | P1 |

#### 8.4.1 Case study: Proglo Shipping (flagship, `/work/proglo-shipping`)

This is the only case study backed by a live public product, so it carries the credibility load for the whole site.

**Publicly observable facts (Tier A, verified 28 Aug 2026):**
- Proglo Shipping is a live multi-carrier shipping platform for small and scaling e-commerce brands, positioned around label creation and rate comparison across USPS, UPS and LTL freight, without volume minimums.
- The marketing site advertises 30+ store integrations (Shopify, Amazon, WooCommerce among them), a mobile dashboard, and a full public API.
- A public API documentation route exists at `/docs`, client-rendered, consistent with an OpenAPI specification being served to a documentation viewer.
- Additional public routes include `/pricing`, `/blogs`, `/success-stories`, `/terms-of-service`, `/sign-up`.
- The front end is a Next.js application deployed on Vercel with Sentry instrumentation (observable from response metadata and image-optimisation URLs).

**Contribution claims to present (from the profile, pending §22 confirmation):**
- Full-stack development with Next.js, TypeScript and Go.
- Design, implementation and documentation of REST APIs in Go using OpenAPI/Swagger.
- Barcode generation and warehouse data-processing workflows.
- Google Workspace automation via Apps Script and TypeScript, including build, bundling, deployment and release tooling.
- Google Workspace administration: domain configuration and user provisioning.

| ID | Requirement | Priority |
|---|---|---|
| FR-PS1 | Header carries a `Live product` badge and an outbound button to `https://www.progloshipping.com`. | P0 |
| FR-PS2 | A scope statement appears above the fold: this is a team product; the page describes only the components Farhan owned. | P0 |
| FR-PS3 | Where the public API docs are referenced, link directly to `/docs` on the Proglo domain as verifiable evidence of the OpenAPI work. | P0 |
| FR-PS4 | The Approach section covers, at minimum: the Go service and its OpenAPI contract; how the spec was kept in sync with the implementation; the Next.js front end and its rendering strategy; the barcode/warehouse workflow; and the Apps Script build-and-release pipeline (an unusual, genuinely interesting piece of engineering — TypeScript source, bundling, versioned deployment into Apps Script). | P0 |
| FR-PS5 | No Proglo customer data, order data, internal screenshots or private endpoints appear. Public marketing imagery is used only with written permission (§22). | P0 |
| FR-PS6 | If permission for the name or logo is refused, the page falls back to "a US-based multi-carrier shipping platform" with all links removed, and the flagship slot is reassigned to the CV anonymization case study. | P0 |

#### 8.4.2 Case study: CV anonymization pipeline (`/work/cv-anonymization`)

| ID | Requirement | Priority |
|---|---|---|
| FR-CV1 | Frames the problem correctly: anonymization for fair-hiring and client-presentation purposes, at volume, with zero tolerance for leaked identifiers. | P0 |
| FR-CV2 | The Approach section must make the central architectural point explicit: LLM-based document *understanding* combined with *deterministic* data processing — the model interprets layout and context, deterministic rules perform the actual redaction, so removal is auditable and repeatable rather than probabilistic. | P0 |
| FR-CV3 | Covers failure handling: what happens on low-confidence extraction, and the human review step. Claims assisted automation, never full autonomy. | P0 |
| FR-CV4 | The ~80% metric renders with a §6.4 footnote or is removed. | P0 |
| FR-CV5 | Includes a synthetic before/after example — an invented CV, clearly labelled as synthetic. No real candidate material of any kind. | P1 |
| FR-CV6 | Names data-handling considerations (GDPR relevance, retention, where documents were processed) without disclosing Expinder's infrastructure. | P1 |

#### 8.4.3 Case study: Order fulfillment automation (`/work/order-fulfillment`)

| ID | Requirement | Priority |
|---|---|---|
| FR-OF1 | Describes the pipeline concretely: order validation → volumetric-weight-based carton selection → rate/label generation across Amazon and Shopify orders, with FedEx, DHL and ShipStation integrations. | P0 |
| FR-OF2 | The carton-selection logic is the technical centrepiece and is explained properly — why volumetric weight drives cost, and what the selection has to optimise for. | P0 |
| FR-OF3 | The ~80% effort-reduction claim carries a §6.4 footnote stating the baseline and sample. | P0 |
| FR-OF4 | Covers edge-case handling: multi-item orders, oversized items, address validation failures, carrier API errors and retries. | P1 |
| FR-OF5 | End client is referred to by sector only. | P0 |

#### 8.4.4 Case study: AI content production pipeline (`/work/content-pipeline`)

| ID | Requirement | Priority |
|---|---|---|
| FR-CP1 | Describes the full chain: keyword research → topic generation → drafting → image generation → internal linking → automated publishing to Shopify and WordPress. | P0 |
| FR-CP2 | Addresses quality control head-on: how output was kept from being generic, what human review existed, and how internal linking avoided nonsense links. A reader in 2026 is sceptical of AI content pipelines; the page must earn trust rather than assume it. | P0 |
| FR-CP3 | The "500+ products across 20+ stores" figure is presented as Tier C with a date range. | P0 |
| FR-CP4 | States plainly what the pipeline was not good at. | P1 |

#### 8.4.5 Case study: Inventory and manufacturing planning (`/work/inventory-planning`)

| ID | Requirement | Priority |
|---|---|---|
| FR-IP1 | Explains the model: warehouse stock levels plus projected demand producing upcoming manufacturing requirements. | P0 |
| FR-IP2 | States the forecasting approach honestly, including how simple it was, if it was simple. An honest heuristic described well is more credible than an implied ML system. | P0 |
| FR-IP3 | Notes the adjacent competitor price-monitoring system (Python, Scrapy, cloud-scheduled) as a related build. | P1 |

### 8.5 About (`/about`)

| ID | Requirement | Priority |
|---|---|---|
| FR-A1 | Long-form first-person bio, 300–450 words, written as prose rather than as a rewritten CV. Covers how he moved from research and full-stack work into AI automation, and what kind of problem he likes. | P0 |
| FR-A2 | Full experience timeline: five roles with company, title, employment type, dates, location, and three to five bullets each. Bullets are rewritten from the LinkedIn text into plainer language — not pasted. | P0 |
| FR-A3 | Education: MPhil Computer Science, University of Gujrat (2019–2022); BS Computer Science & IT, PUCIT, University of the Punjab (2014–2018). | P0 |
| FR-A4 | Research block: the *Mathematics* (MDPI, Nov 2022) paper, with a two-to-three sentence plain-language explanation of what binned term count does and why document-length bias matters, plus the DOI link. | P0 |
| FR-A5 | Earlier projects section: Eating Assistive Robot (final year project — computer vision mouth detection in C++/Python, Raspberry Pi with servo and stepper motors, Google Assistant integration) and FitnessTime. Presented as formative work with dates, not padding. | P1 |
| FR-A6 | Location, timezone, and working-arrangement line (Lahore, Pakistan; remote / hybrid). Recruiters need this and hiding it wastes everyone's time. | P0 |
| FR-A7 | A professional photograph, or no photograph. No AI-generated avatar, no illustrated caricature. | P1 |

### 8.6 Résumé (`/resume`)

| ID | Requirement | Priority |
|---|---|---|
| FR-R1 | HTML résumé rendered from the same typed content model as the site — no separately maintained copy that can drift. | P0 |
| FR-R2 | Downloadable PDF at a stable path `/farhan-shehzad-resume.pdf`, one page, ATS-parseable: real text, single column for the body, standard section headings, no text inside images, no tables for layout. | P0 |
| FR-R3 | A dedicated print stylesheet so browser-printing the HTML résumé produces an acceptable document. | P1 |
| FR-R4 | PDF regenerated as part of the build where feasible, or a documented manual step in the README with a version stamp. | P1 |

### 8.7 Capabilities / stack (`/stack`, optional)

Skills are grouped into four clusters. Ordering within a cluster reflects actual depth, not alphabetical order.

| Cluster | Contents |
|---|---|
| **AI & agents** | LLM integration (OpenAI, Claude), AI agents, MCP servers, prompt engineering, document understanding, Claude Code, Claude Skills |
| **Automation & integration** | n8n, Google Apps Script, REST APIs, OAuth 2.0, webhooks, browser automation, Scrapy/Selenium, low-code platforms |
| **Backend & platform** | Python, FastAPI, Go, Node.js, TypeScript, OpenAPI/Swagger, Docker, Google Cloud Platform, Git |
| **Front-end** | Next.js, React, TypeScript, Tailwind CSS, HTML5, CSS3 |

| ID | Requirement | Priority |
|---|---|---|
| FR-S1 | No proficiency percentages, star ratings, or progress bars. They are unfalsifiable and read as filler. | P0 |
| FR-S2 | Each cluster carries a one-sentence statement of what he actually does with those tools. | P1 |
| FR-S3 | Where a tool is used in a published case study, it links to that case study. This is the single best credibility mechanism on the page. | P1 |
| FR-S4 | Tools he has used but would not claim depth in are either omitted or placed in a clearly-labelled "familiar with" group. | P1 |

### 8.8 Contact (`/contact`)

| ID | Requirement | Priority |
|---|---|---|
| FR-CT1 | Direct channels listed first: email (copyable), LinkedIn, GitHub. The form is a convenience, not the primary path. | P0 |
| FR-CT2 | Form fields: name, email, message, and an optional "what is this about" select (Role opportunity / Contract work / Something else). | P1 |
| FR-CT3 | Submission via a third-party static-form service (Web3Forms or Formspree). No secrets in the client bundle beyond the service's public access key. | P1 |
| FR-CT4 | Spam controls: honeypot field, time-to-submit threshold, and the provider's built-in captcha where available. | P1 |
| FR-CT5 | Accessible validation — errors are associated with inputs via `aria-describedby`, announced in a live region, and not colour-only. | P0 |
| FR-CT6 | Success and failure states are explicit. Failure state exposes the raw email address as a fallback. | P0 |
| FR-CT7 | Response-time expectation is stated ("I reply within two working days"), and it is true. | P1 |
| FR-CT8 | No JavaScript-only contact path. If JS fails, the email address is still visible and selectable. | P0 |

---

## 9. Content model

Content lives in typed TypeScript modules under `src/content/`. There is no CMS. The build fails on a schema violation, which is the point: content correctness is enforced by the compiler.

### 9.1 Core types

```ts
// src/content/schema.ts

export type EvidenceTier = 'verifiable' | 'measured' | 'counted' | 'capability';

export type Domain =
  | 'ecommerce'
  | 'recruitment'
  | 'content-marketing'
  | 'platform';

/** A claim with a number attached. Tier B and C claims MUST carry a basis. */
export interface Metric {
  /** Rendered value, e.g. "~80%" or "500+" */
  value: string;
  /** Short label, e.g. "less manual effort on CV anonymization" */
  label: string;
  tier: EvidenceTier;
  /**
   * Required for 'measured' and 'counted'. Must state what was sampled,
   * the before/after values, the period, and that it is first-party.
   * Enforced by a build-time assertion, not by convention.
   */
  basis?: string;
  /** Optional public URL that supports the claim (tier 'verifiable'). */
  evidenceUrl?: string;
}

export interface StackItem {
  name: string;
  /** Why this over the obvious alternative. One sentence. */
  rationale?: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  /** One sentence, plain language, no adjectives. */
  summary: string;
  organisation: string;
  /** Sector description used when the end client cannot be named. */
  clientSector?: string;
  role: string;
  period: { start: string; end: string | 'present' };
  domain: Domain;
  featured: boolean;
  /** Public, verifiable artifact. Presence drives the "Live" badge. */
  liveUrl?: string;
  /** Additional verifiable links: docs routes, DOIs, repos. */
  evidence?: { label: string; url: string }[];
  context: string;
  problem: string;
  constraints: string[];
  approach: string;           // MDX body
  schematic?: string;         // path to an SVG under /public/schematics
  contribution: string;       // explicit scope statement — required
  outcomes: Metric[];
  whatDidNotWork: string;     // required; empty string is a build error
  stack: StackItem[];
  readingMinutes: number;
}

export interface Role {
  company: string;
  title: string;
  employmentType: 'Contract' | 'Full-time' | 'Part-time' | 'Freelance' | 'Internship';
  start: string;              // ISO YYYY-MM
  end: string | 'present';
  location: string;
  remote: boolean;
  bullets: string[];
  caseStudySlugs: string[];
}

export interface Publication {
  title: string;
  venue: string;
  publisher: string;
  date: string;               // ISO
  doi?: string;
  url: string;
  plainSummary: string;       // two to three sentences, no jargon
}

export interface Education {
  institution: string;
  credential: string;
  field: string;
  start: string;
  end: string;
}

export interface SiteConfig {
  name: string;
  headline: string;
  location: string;
  timezone: string;
  available: boolean;
  availabilityNote: string;
  email: string;
  socials: { label: string; url: string }[];
  resumePdfPath: string;
}
```

### 9.2 Build-time content validation

| ID | Rule | Failure mode |
|---|---|---|
| CV-1 | Every `Metric` with tier `measured` or `counted` has a non-empty `basis` of at least 60 characters. | Build fails |
| CV-2 | Every `CaseStudy` has a non-empty `contribution` and `whatDidNotWork`. | Build fails |
| CV-3 | Every `CaseStudy.constraints` array has at least two entries. | Build fails |
| CV-4 | `liveUrl` and every `evidence.url` returns HTTP 200 in CI. | CI warns; blocks release on the flagship |
| CV-5 | No content string matches the denylist of banned company names (end clients) maintained in `src/content/denylist.ts`. | Build fails |
| CV-6 | Exactly one `CaseStudy` has `featured: true` and a `liveUrl`. | Build fails |

Validation is implemented with Zod schemas plus a small custom rule file, executed in a `prebuild` script and in CI.

---

## 10. Design system

### 10.1 Design thesis

The subject is a person who builds systems that move things: orders, documents, candidates, data. The natural visual world is the **dispatch board** — manifests, label printers, tracking readouts, monospace records of things that shipped. That is the direction: quiet, dense, technical, with the confidence of a system that works rather than the polish of a marketing page.

Three looks are deliberately avoided because they are the current defaults for AI-built portfolios and read as such: warm cream backgrounds with high-contrast serif display and a terracotta accent; near-black backgrounds with a single acid-green accent; and broadsheet layouts with hairline rules and zero border radius. Where this brief left an axis free, it is spent somewhere else.

### 10.2 Palette

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#101418` | Primary text (light theme), background (dark theme) |
| `--paper` | `#EEF0F2` | Page background (light theme) — cool, not cream |
| `--steel` | `#5A6672` | Secondary text, metadata, captions |
| `--line` | `#C9CED4` | Rules, borders, table separators |
| `--signal` | `#FFB000` | The single accent. Used for the manifest strip, live badges, focus rings, and nothing else |
| `--depth` | `#1F6F6B` | Links and interactive text; deep teal, distinguishable from the accent |

Dark theme inverts `--ink` and `--paper`, lifts `--steel` to `#98A3AE`, drops `--line` to `#252C33`, and holds `--signal` and `--depth` (with `--depth` lightened to `#3FA39D` for contrast).

Contrast requirements: body text ≥ 7:1 (AAA) in both themes; secondary text ≥ 4.5:1; `--signal` is never used for text on `--paper` — it is a surface and border colour only.

### 10.3 Typography

| Role | Face | Notes |
|---|---|---|
| Display | **Archivo** (variable, width axis) | Set expanded and tight-tracked at large sizes. Carries the headline personality without reaching for a serif. |
| Body | **Public Sans** (variable) | Open, plain, institutional. Reads as documentation rather than marketing. |
| Utility / data | **JetBrains Mono** | Manifest strip, metrics, eyebrows, stack tags, dates, footnote markers. |

Type scale (rem, 1rem = 16px): `0.75 / 0.875 / 1 / 1.25 / 1.5 / 2 / 2.75 / 4`. Body copy at 1.0625rem with a 1.65 line height and a 68-character measure. Headings use tighter line heights (1.1–1.25) and negative tracking above 2rem.

Fonts are self-hosted as variable WOFF2, subset to Latin, preloaded for the display and body faces, `font-display: swap`. No third-party font CDN — it costs a connection and a privacy footnote.

### 10.4 Layout

Twelve-column grid, 1200px max content width, 72ch max prose width. Vertical rhythm on an 8px base. Generous section spacing (96–128px desktop, 56–72px mobile). Breakpoints: 480 / 640 / 768 / 1024 / 1280.

Case study pages use an asymmetric two-column layout above 1024px: prose in a 7-column measure, with metadata, stack tags and metric footnotes in a 3-column sticky rail. Below 1024px the rail collapses above the prose.

Border radius: 4px on interactive elements, 0 on structural containers. Shadows: none. Depth is expressed with `--line` borders and background steps, which suits the dispatch-board direction and costs nothing in rendering.

### 10.5 Signature element — the manifest strip

A full-width monospace band under the hero, styled like a printed manifest or a departure board: left-aligned key, dotted leader, right-aligned value, one row per fact.

```
SHIPPED ······················· progloshipping.com  ↗
PUBLISHED ····················· Mathematics, MDPI 2022  ↗
BUILDING SINCE ················ 2020
PRIMARY STACK ················· Python · TypeScript · Go
BASED ························· Lahore, PK — UTC+5
STATUS ························ Open to AI engineering roles
```

Rows animate in as a staggered page-load sequence (30ms stagger, 200ms per row, ease-out), reading like a board updating. Under `prefers-reduced-motion` all rows appear at once. The strip is fully present in the HTML; the animation is enhancement only.

The same visual language recurs at exactly two other points — case study metadata headers and the metric footnote markers — and nowhere else. One idea, used three times, is a system; used everywhere, it is a texture.

### 10.6 System schematics

Each automation case study carries one hand-authored SVG schematic showing components and data flow. Rules: generic component labels only; two colours (`--ink` and `--steel`) plus `--signal` for the single component Farhan built; monospace labels; no gradients, no icons from an icon set, no 3D. Schematics are legible at 320px width and carry a `<title>` and `<desc>` for screen readers plus a text summary beneath.

### 10.7 Motion

| Element | Motion | Duration |
|---|---|---|
| Manifest strip | Staggered row reveal on load | 200ms/row, 30ms stagger |
| Section headings and cards | Fade + 8px rise on scroll into view, once | 320ms |
| Schematics | Path draw-in on first view | 600ms |
| Links and buttons | Colour and underline-offset transition | 120ms |
| Theme toggle | No transition (avoids a full-page repaint flash) | — |

Everything above is disabled under `prefers-reduced-motion: reduce`. No parallax, no cursor followers, no scroll hijacking, no auto-playing video.

---

## 11. Technical architecture

### 11.1 Stack decision

**Selected: Next.js 15 (App Router) with `output: 'export'`, TypeScript in strict mode, Tailwind CSS v4, MDX for case study bodies.**

Rationale: the site is itself a work sample for the Next.js / TypeScript / Tailwind skills claimed on the profile, and it mirrors the Proglo Shipping front-end stack. A static export removes every runtime concern and deploys cleanly to GitHub Pages.

Alternatives considered:
- **Astro 5** — technically the better fit for a content site (less JavaScript by default) but does not demonstrate the claimed stack. Rejected on positioning, not on merit.
- **Plain HTML + a build script** — fastest possible, but produces no evidence of framework competence.
- **Next.js with a Node runtime on Vercel** — unnecessary; nothing on this site needs a server.

Recorded as ADR-001 (§Appendix D).

### 11.2 Dependencies (target: fewer than 15 production dependencies)

| Package | Purpose |
|---|---|
| `next`, `react`, `react-dom` | Framework |
| `typescript` | Types, strict mode |
| `tailwindcss` v4 | Styling |
| `@next/mdx`, `remark-gfm`, `rehype-slug`, `rehype-autolink-headings` | Case study content |
| `zod` | Content schema validation |
| `satori` + `resvg-js` (or `@vercel/og` at build time) | OG image generation |
| `next-sitemap` or a custom script | Sitemap and robots |

Explicitly excluded: UI component libraries, animation libraries (CSS and the Web Animations API are sufficient), icon packs beyond a handful of inlined SVGs, state management, form libraries, analytics SDKs.

### 11.3 Rendering and data flow

All pages are statically generated at build time from typed modules in `src/content/`. `generateStaticParams` enumerates case study slugs. There is no runtime data fetching, no API route, and no environment-dependent rendering.

### 11.4 Assets

- Images: AVIF with WebP fallback, explicit width and height on every `<img>`, `loading="lazy"` below the fold, `fetchpriority="high"` on the single LCP image if one exists.
- Because `next/image` optimisation requires a server, images are pre-optimised at build time by a script and served statically. This is documented in the README.
- SVG schematics are inlined (they need CSS variables for theming), not referenced via `<img>`.
- Total page weight budget: ≤ 400 KB for the home page including fonts, ≤ 600 KB for a case study with a schematic.

### 11.5 Hosting and domain

- GitHub Pages from the `gh-pages` branch (or GitHub Actions Pages deployment), with a `CNAME` file for the custom domain.
- Custom domain recommended: `farhanshehzad.dev` or similar. HTTPS enforced via GitHub Pages' Let's Encrypt integration.
- `.nojekyll` file present to prevent Jekyll processing of `_next/`.
- Apex plus `www` both configured; `www` redirects to apex.
- Fallback if a custom domain is not purchased: `<handle>.github.io`. All canonical URLs and OG tags read from a single `SITE_URL` constant so the switch is one edit.

---

## 12. Non-functional requirements

| ID | Requirement | Target |
|---|---|---|
| NFR-1 | Lighthouse mobile scores | ≥ 95 across Performance, Accessibility, Best Practices, SEO |
| NFR-2 | Largest Contentful Paint (Moto G Power, 4G throttle) | ≤ 1.8 s |
| NFR-3 | Cumulative Layout Shift | ≤ 0.05 |
| NFR-4 | Interaction to Next Paint | ≤ 200 ms |
| NFR-5 | Time to First Byte from GitHub Pages CDN | ≤ 600 ms |
| NFR-6 | JavaScript shipped, home page, gzipped | ≤ 90 KB |
| NFR-7 | Fonts | ≤ 3 files, ≤ 120 KB total, subset and preloaded |
| NFR-8 | Browser support | Last 2 versions of Chrome, Safari, Firefox, Edge; iOS Safari 16+; Android Chrome 110+ |
| NFR-9 | Content renders and is fully readable with JavaScript disabled | 100% of content |
| NFR-10 | Build time | ≤ 90 s in CI |
| NFR-11 | Accessibility standard | WCAG 2.2 Level AA, zero automated axe violations, manual screen reader pass |
| NFR-12 | Availability | Inherited from GitHub Pages; no self-managed infrastructure |
| NFR-13 | Content update cost | A new case study is one MDX file plus one content entry; no code changes required |

---

## 13. SEO, metadata, and structured data

| ID | Requirement | Priority |
|---|---|---|
| FR-SEO1 | Title formula — Home: `Farhan Shehzad — AI Automation & Integration Engineer`. Case study: `<Title> — Case study — Farhan Shehzad`. Other: `<Page> — Farhan Shehzad`. All ≤ 60 characters where possible. | P0 |
| FR-SEO2 | Unique meta description per page, 140–160 characters, written by hand, never templated from body text. | P0 |
| FR-SEO3 | Canonical URL on every page, absolute, derived from `SITE_URL`. | P0 |
| FR-SEO4 | Open Graph and Twitter Card tags on every page, with a build-generated 1200×630 image using the site's own typography (title + role + manifest-strip motif). | P0 |
| FR-SEO5 | JSON-LD `Person` on the home page: name, jobTitle, url, sameAs (LinkedIn, GitHub, ORCID/Scholar), alumniOf, knowsAbout, address (city and country only). | P0 |
| FR-SEO6 | JSON-LD `ScholarlyArticle` on the publication block, with DOI. | P1 |
| FR-SEO7 | JSON-LD `CreativeWork` (or `TechArticle`) per case study. | P1 |
| FR-SEO8 | `sitemap.xml` and `robots.txt` generated at build. Sitemap includes `lastmod` from git. | P0 |
| FR-SEO9 | Semantic heading hierarchy: exactly one `<h1>` per page, no skipped levels. | P0 |
| FR-SEO10 | `/llms.txt` at the root summarising who he is and what the site contains, since AI assistants are now a real discovery surface for hiring research. | P2 |
| FR-SEO11 | Target queries to satisfy in copy without stuffing: "AI automation engineer", "n8n developer", "workflow automation engineer", "LLM integration engineer", "Python automation engineer remote". | P1 |

---

## 14. Analytics and measurement

| ID | Requirement | Priority |
|---|---|---|
| FR-AN1 | Privacy-first, cookieless analytics — GoatCounter, Umami (self-hosted or cloud), or Plausible. No Google Analytics. | P0 |
| FR-AN2 | No consent banner is required, and none is shown, because no cookies are set and no personal data is collected. This is stated in the privacy note. | P0 |
| FR-AN3 | Analytics script ≤ 2 KB, loaded with `defer`, and its failure must not affect rendering. | P0 |
| FR-AN4 | Custom events: `resume_download`, `contact_submit`, `email_copy`, `outbound_proglo`, `outbound_doi`, `case_study_75_scroll`. | P1 |
| FR-AN5 | A monthly review checkpoint against the §4.3 metrics, recorded in the repository. | P2 |

---

## 15. Accessibility

WCAG 2.2 Level AA is a launch gate, not a nice-to-have.

| ID | Requirement |
|---|---|
| FR-AC1 | Full keyboard operability; logical tab order; no keyboard traps. |
| FR-AC2 | Visible focus indicator on every interactive element: 2px `--signal` outline with a 2px offset, meeting the 3:1 non-text contrast requirement against both themes. |
| FR-AC3 | Landmark regions (`header`, `nav`, `main`, `footer`) and a skip link. |
| FR-AC4 | All images have meaningful `alt`, or `alt=""` when decorative. Schematics have `<title>`, `<desc>`, and a text-equivalent summary in the page. |
| FR-AC5 | Colour is never the only means of conveying information (applies to live badges, filter states, and form errors). |
| FR-AC6 | Form inputs have persistent visible labels, not placeholder-only labels. |
| FR-AC7 | Live regions announce toast confirmations (email copied) and form submission results. |
| FR-AC8 | Text reflows to 320px width without horizontal scrolling and remains usable at 200% zoom. |
| FR-AC9 | Target size ≥ 24×24 CSS pixels for all pointer targets (WCAG 2.2 §2.5.8). |
| FR-AC10 | Manual test pass with VoiceOver on iOS Safari and NVDA on Windows Firefox before launch. |
| FR-AC11 | The theme toggle exposes state via `aria-pressed` and does not rely on an icon alone. |

---

## 16. Privacy, security, legal

| ID | Requirement |
|---|---|
| FR-P1 | A short privacy note at `/privacy` (or in the footer) stating: what analytics are used, that no cookies are set, what the contact form provider receives, and how long messages are retained. |
| FR-P2 | No third-party scripts beyond analytics and the form provider. No embedded fonts, maps, videos, or chat widgets. |
| FR-P3 | Content Security Policy delivered via `<meta http-equiv>` (GitHub Pages cannot set headers): `default-src 'self'`, explicit allowances for the analytics and form endpoints, `object-src 'none'`, `base-uri 'self'`. |
| FR-P4 | No secrets in the repository. The form provider's public key is public by design and documented as such. |
| FR-P5 | Dependabot enabled; `npm audit` runs in CI and fails the build on high or critical advisories. |
| FR-P6 | The repository is public. Every commit is written on the assumption a hiring engineer will read it. |
| FR-P7 | Logos or trademarks of any employer appear only with written permission (§22). Where permission is absent, use text. |
| FR-P8 | Site content is © Farhan Shehzad; the source code is MIT licensed. Both stated in the README. |

---

## 17. Repository structure and engineering standards

```
portfolio/
├─ .github/
│  └─ workflows/
│     ├─ ci.yml                 # typecheck, lint, content validation, build, axe, Lighthouse CI
│     └─ deploy.yml             # build + publish to GitHub Pages
├─ public/
│  ├─ farhan-shehzad-resume.pdf
│  ├─ schematics/*.svg
│  ├─ fonts/*.woff2
│  ├─ CNAME
│  └─ .nojekyll
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx
│  │  ├─ page.tsx               # home
│  │  ├─ work/page.tsx
│  │  ├─ work/[slug]/page.tsx
│  │  ├─ about/page.tsx
│  │  ├─ resume/page.tsx
│  │  ├─ contact/page.tsx
│  │  ├─ not-found.tsx
│  │  └─ og/[...slug]/route.tsx  # build-time OG generation
│  ├─ components/
│  │  ├─ ManifestStrip.tsx
│  │  ├─ CaseStudyCard.tsx
│  │  ├─ MetricWithBasis.tsx     # enforces the §6.4 footnote pattern
│  │  ├─ Schematic.tsx
│  │  ├─ ThemeToggle.tsx
│  │  └─ CopyEmail.tsx
│  ├─ content/
│  │  ├─ schema.ts
│  │  ├─ site.ts
│  │  ├─ roles.ts
│  │  ├─ publications.ts
│  │  ├─ education.ts
│  │  ├─ denylist.ts
│  │  └─ case-studies/*.mdx
│  ├─ lib/
│  │  ├─ validate-content.ts
│  │  └─ seo.ts
│  └─ styles/
│     └─ globals.css             # Tailwind v4 theme tokens
├─ scripts/
│  ├─ optimise-images.ts
│  └─ check-links.ts
├─ README.md
├─ LICENSE
└─ package.json
```

**Standards:** TypeScript `strict: true`, no `any` in application code, ESLint with `@typescript-eslint` and `jsx-a11y`, Prettier, Conventional Commits, and a README that explains how to add a case study in under ten lines. The README is read by hiring engineers more often than any code file; it is treated as a deliverable.

---

## 18. CI/CD and deployment

### 18.1 Continuous integration (on every pull request)

| Step | Gate |
|---|---|
| `tsc --noEmit` | Blocking |
| ESLint (including `jsx-a11y`) | Blocking |
| Content validation (§9.2) | Blocking |
| `next build` | Blocking |
| `axe-core` scan against the built output for every route | Blocking on any violation |
| Lighthouse CI, mobile preset | Blocking below 95 on any category |
| Internal + external link check | Blocking on internal, warning on external, blocking on the flagship's `liveUrl` |
| `npm audit --audit-level=high` | Blocking |

### 18.2 Deployment

- `main` is protected; changes land via pull request.
- Merge to `main` triggers `deploy.yml`: build → upload artifact → `actions/deploy-pages`.
- Deploy time target: under three minutes from merge to live.
- Rollback: re-run the previous successful deployment, or revert the commit. Both documented in the README.

---

## 19. QA and acceptance criteria

### 19.1 Launch acceptance checklist

**Content**
- [ ] Every Tier B/C metric on the site has a visible, complete basis footnote.
- [ ] Every case study has a non-empty `contribution` and a `whatDidNotWork` section.
- [ ] No end-client name appears anywhere (denylist check passes).
- [ ] Proglo Shipping permission confirmed in writing, or the fallback in FR-PS6 is in effect.
- [ ] All dates, titles, and employment types match the LinkedIn profile exactly.
- [ ] The publication link resolves to the MDPI article.
- [ ] The résumé PDF matches the site content and parses correctly in a text extractor.
- [ ] Every page proofread aloud; no phrase from the LinkedIn bullets is pasted verbatim.

**Functional**
- [ ] All routes render at 320px, 768px, 1280px and 1920px without layout defects.
- [ ] Site is fully readable with JavaScript disabled.
- [ ] Theme toggle persists and produces no flash on reload.
- [ ] Contact form: success path, failure path, spam controls, and the no-JS fallback all verified.
- [ ] Email copy button works and announces via a live region.
- [ ] 404 page reachable and useful.

**Quality gates**
- [ ] Lighthouse ≥ 95 on all four categories, mobile, on Home / Work / a case study / About.
- [ ] Zero axe violations on every route.
- [ ] Manual VoiceOver (iOS) and NVDA (Windows) pass.
- [ ] Zero broken links.
- [ ] OG image renders correctly in a card validator for at least three routes.
- [ ] HTTPS enforced; custom domain resolving on apex and `www`.

### 19.2 Device and browser matrix
iPhone (Safari, latest and −1), Android (Chrome, latest), macOS (Safari, Chrome, Firefox), Windows (Chrome, Edge, Firefox). Additional passes: 200% zoom, dark mode, reduced motion, and a slow-4G throttle.

---

## 20. Delivery plan

| Phase | Scope | Estimate |
|---|---|---|
| **0 — Content** | Write all case study copy, gather metric bases, confirm permissions, finalise the bio. Content is the critical path and is done first, on purpose. | 4–6 days |
| **1 — Foundation** | Repo, Next.js + Tailwind + MDX setup, design tokens, typography, layout primitives, theme, CI skeleton. | 2–3 days |
| **2 — Core pages** | Home (with manifest strip), Work index, case study template, About. | 3–4 days |
| **3 — Depth** | All five case studies populated, schematics drawn, metric footnote component, résumé HTML + PDF, contact form. | 3–4 days |
| **4 — Polish and gates** | OG generation, SEO and JSON-LD, analytics, accessibility pass, Lighthouse tuning, link checking, cross-browser QA. | 2–3 days |
| **5 — Launch** | Domain, DNS, HTTPS, GitHub profile README, LinkedIn featured-link update, submit to Google Search Console. | 1 day |

**Total: 15–21 working days** at part-time pace. Phases 1 and 2 can compress significantly; phase 0 should not.

### 20.1 Definition of done
A phase is done when its acceptance items pass in CI, not when the code is written.

---

## 21. Risks

| ID | Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| R1 | Proglo World declines permission to name the product or describe the work. | High — removes the only Tier A product artifact. | Medium | Ask early (phase 0). Prepare the FR-PS6 fallback. Consider whether a former manager will instead provide a written reference that can be quoted with permission. |
| R2 | Metric bases cannot be honestly reconstructed for the ~80% claims. | Medium — the headline numbers must be dropped. | Medium | Reconstruct from whatever records exist. If impossible, restate as a qualitative outcome ("cut a multi-hour daily task to minutes") with no number. A missing number costs less than a challenged one. |
| R3 | Case studies read as generic because the interesting details are confidential. | High — the site fails its main job. | Medium | Depth goes into constraints, trade-offs and rejected alternatives, which are rarely confidential. Reasoning is the product here, not implementation detail. |
| R4 | The site over-indexes on automation and under-sells full-stack capability (or vice versa), narrowing inbound. | Medium | Medium | Positioning is deliberately "AI automation and integration engineer who ships production systems". The Proglo case study carries the full-stack proof. Revisit after 90 days against §4.3. |
| R5 | Scope creep into a blog, playground, or interactive demos. | Medium — delays launch indefinitely. | High | v1 scope is frozen at this document. Everything else is §23. |
| R6 | Static export limitations (no `next/image` optimisation, no headers) degrade quality scores. | Low | Medium | Pre-optimise images in the build script; deliver CSP via meta tag; both are already specified. |
| R7 | Content drifts out of sync with LinkedIn and the résumé. | Low | High | Single content model drives site and HTML résumé. A quarterly reminder to reconcile with LinkedIn is added to the README. |
| R8 | Contact form abused by scrapers or spam. | Low | High | Honeypot, timing threshold, provider captcha, and the direct email remains the primary path. |

---

## 22. Open questions and verification checklist

These must be resolved before or during phase 0. Each blocks specific requirements.

| # | Question | Blocks | Owner |
|---|---|---|---|
| Q1 | Written permission from Proglo World LLC to name the product, link to it, describe the stack, and state the contribution claims. Confirm whether the logo may be used. | FR-PS1–FR-PS6 | Farhan |
| Q2 | Confirm exactly which Proglo components were owned solo versus contributed to, so FR-PS2 is precise. | FR-PS2 | Farhan |
| Q3 | Is the Proglo API documentation route (`/docs`) the OpenAPI spec Farhan authored, and may it be cited as evidence? | FR-PS3 | Farhan |
| Q4 | Reconstruct the basis for the ~80% CV anonymization figure: sample size, before/after timings, period. | FR-CV4 | Farhan |
| Q5 | Reconstruct the basis for the ~80% order fulfillment figure. | FR-OF3 | Farhan |
| Q6 | Confirm the date range and definition behind "50+ automation solutions" and "500+ products across 20+ stores". | FR-CP3 | Farhan |
| Q7 | Permission from Expinder to describe the CV anonymization system at the level of detail in §8.4.2. | FR-CV1–CV6 | Farhan |
| Q8 | Are there any public repositories worth featuring? If yes, they become Tier A evidence and should be surfaced on `/work`. | FR-W3 | Farhan |
| Q9 | Domain choice and purchase. | §11.5 | Farhan |
| Q10 | Is the GitHub handle `farhanshehzad` available/held? Determines the profile README repository name. | Appendix B | Farhan |
| Q11 | Confirm the MDPI DOI and ORCID/Google Scholar URLs. | FR-A4, FR-SEO6 | Farhan |
| Q12 | Availability status and what he is actually open to (full-time, contract, both). | FR-G8 | Farhan |
| Q13 | Professional photograph available, or omit? | FR-A7 | Farhan |
| Q14 | LeadForge and Karmic Seed: any objection to being named in case studies, given both engagements have ended? | §8.4.3–8.4.5 | Farhan |

---

## 23. Out of scope for v1 / future roadmap

| Version | Item | Rationale |
|---|---|---|
| v1.1 | Writing section with 3–5 technical articles and RSS | Compounding SEO and credibility, but only worth doing if he will actually write |
| v1.1 | `/stack` page expanded into an opinionated "how I choose tools" essay | Differentiates from every other portfolio's logo grid |
| v1.2 | A genuinely interactive demo — e.g. a small in-browser document-redaction toy on synthetic data | Only if it can be built without touching any client system |
| v1.2 | Case study filtering by tool as well as domain | Useful once there are more than eight case studies |
| v2 | Multilingual (English + German), given the Expinder engagement is German-market | Only if German-market targeting becomes a priority |
| v2 | Testimonials with named attribution and permission | High value, but depends on relationships and consent |
| Never | Skill percentage bars, hit counters, animated cursor trails, "downloading my brain" copy | — |

---

## Appendix A — Copy deck (v1 drafts)

### A.1 Hero

**Headline options**

1. `I build the systems that do the repetitive work.`
2. `AI automation that survives contact with production.`
3. `Five years of turning manual operations into software.`

**Recommended:** option 1 for the `<h1>`, with the positioning line as the subhead.

**Subhead**

> AI automation and integration engineer. I design agents, pipelines and integrations for recruitment, e-commerce and marketing operations — from requirements through to the part where it runs unattended.

**Supporting line**

> Python, TypeScript and Go. Currently building recruitment AI at Expinder, remotely from Lahore.

**CTAs:** `See the work` (primary) · `Download résumé` (secondary)

### A.2 Work index intro

> Most of what I build lives inside other companies' systems — internal pipelines, private integrations, workflows running against client accounts. There is no public URL for any of it. So these are written as case studies rather than demos: the problem, what constrained the solution, what I decided and why, and what actually changed. Where something is public, I have linked it.

### A.3 About opening

> I started in research. My MPhil work was on text categorisation — specifically on a term weighting method that reduces the bias long documents introduce into classification, which ended up published in *Mathematics* in 2022. Somewhere in the middle of that I noticed I enjoyed the plumbing more than the models: getting data out of one system, into a shape something else could use, reliably, at three in the morning without anyone watching.
>
> That turned into five years of automation work. [continues]

### A.4 Metric presentation examples

> **~80%** less manual effort on CV anonymization ^m1
> **~80%** less effort per order in fulfillment ^m2
> **500+** product listings improved across 20+ stores, 2022–2026 ^m3

Each marker expands to a full basis statement per §6.4. If a basis cannot be written honestly, the number is deleted and the outcome is described qualitatively instead.

### A.5 Availability chip

> **Open to work** — AI engineering and automation roles, remote or hybrid.

### A.6 Contact

> Email is the fastest way to reach me. I reply within two working days.
>
> If you are hiring: the résumé is a one-page PDF. If you are looking for contract help, tell me what the manual process currently costs you and I will tell you whether it is worth automating.

### A.7 404

> **Nothing routed here.**
> That link does not match anything on the site. Try the work, the about page, or just email me.

---

## Appendix B — GitHub profile README specification

The profile README (`github.com/<handle>/<handle>`) is a secondary surface and should be short. It is not a second portfolio.

| ID | Requirement |
|---|---|
| GH-1 | Under 300 words. One screen on desktop. |
| GH-2 | Opening: one line of positioning, one line of what he is currently building. |
| GH-3 | Three to five bullets of shipped work, each with a link where one exists. |
| GH-4 | Stack listed as plain text, grouped. No badge walls, no shields.io rows, no trophy widgets, no streak cards, no "contribution snake". |
| GH-5 | One prominent link to the portfolio site, one to LinkedIn, one to the publication. |
| GH-6 | Pinned repositories: the portfolio repo plus any public work. Each pinned repo has a real README with a description, a screenshot or diagram, and setup instructions. |
| GH-7 | Profile fields completed: bio, location, website, and the "Available for hire" flag if applicable. |

---

## Appendix C — Résumé PDF specification

| ID | Requirement |
|---|---|
| CV-P1 | One page. Two if the publication and projects genuinely warrant it, never three. |
| CV-P2 | Sections in order: name and contact, summary (2 lines), experience, skills, education, publication. |
| CV-P3 | ATS-safe: selectable text, no text in images, no multi-column body, no tables for layout, standard section headings, no icons carrying meaning. |
| CV-P4 | Generated from the same content model as the site (§9), so it cannot drift. |
| CV-P5 | Filename `farhan-shehzad-resume.pdf`, PDF metadata title and author set. |
| CV-P6 | Every metric on the résumé matches the site exactly, including its qualifier. Different numbers in two places is the fastest way to lose a technical reader. |

---

## Appendix D — Decision records

**ADR-001 — Next.js static export over Astro.**
Astro would ship less JavaScript for a content-first site. Next.js is chosen anyway because the site is a work sample for a claimed skill and mirrors the Proglo Shipping front end. The performance gap is closed by shipping almost no client JavaScript regardless of framework. Revisit if the JS budget (NFR-6) cannot be met.

**ADR-002 — GitHub Pages over Vercel.**
Vercel would give image optimisation, headers, and preview deployments for free. GitHub Pages is chosen because the brief specifies a GitHub-hosted showcase, it keeps the repository and the deployment in one place, and nothing on the site needs a server. Costs: manual image optimisation and meta-tag CSP, both specified in §11.4 and §16.

**ADR-003 — Typed TypeScript content modules over a CMS or plain Markdown front matter.**
The evidence policy (§6) only has teeth if it is machine-enforced. A CMS cannot fail a build when a metric is missing its basis; a typed schema plus Zod can. This is the mechanism that keeps the site honest as content is added over time.

**ADR-004 — No testimonials at v1.**
Testimonials require consent and relationship management, and unverifiable quotes read worse than none. Deferred to v2, with attribution and written permission required.
