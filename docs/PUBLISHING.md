# Publishing runbook

How to get this repository onto GitHub and live at `https://farhanshehzad155.github.io`.

Written to be followed top to bottom. Steps marked **[you]** need a browser or an interactive
prompt and cannot be scripted; everything else is a command you can paste.

> **Before you start:** read §0. The site currently asks search engines not to index it, on
> purpose, and you should understand why before you publish.

---

## 0. What you are about to publish

The site builds, deploys and works. The content is **structurally complete and factually
incomplete**, and that has consequences the moment it is public:

| | |
|---|---|
| **121 `TODO(...)` markers render as visible body text** | Case study pages literally display "TODO(Q7): expand once the permitted level of detail is confirmed." |
| **Every employment date is unverified** | Inferred, not confirmed against LinkedIn. Marked `TODO(LI)`. |
| **Proglo permission (PRD Q1) is outstanding** | The flagship case study names the product and links to it. |
| **OG images and the résumé PDF do not exist** | Social cards show a broken image; `/farhan-shehzad-resume.pdf` 404s. |

So `SITE_INDEXABLE` in `src/lib/constants.ts` is **`false`**. The deployed site emits
`<meta name="robots" content="noindex, nofollow, nocache">` and a `Disallow: /` robots.txt.

This is the right default. A search engine that indexes a draft can keep serving it from cache
long after the page is fixed, and "TODO(Q7)" appearing under your name in a search result
undermines the one thing this site exists to prove.

**The site is still fully reachable by anyone with the URL.** noindex is not privacy. Do not
put the link on LinkedIn or in an application until §9 is done.

If you would rather not have it publicly reachable at all yet, stop here and say so — the
alternative is to keep the repository private and run `npm run build && npm run serve` locally,
though a private repository cannot use GitHub Pages on a free plan.

---

## 1. Prerequisites **[you]**

1. **A GitHub account with the handle `farhanshehzad155`.**
   The whole setup depends on this. If your handle is different, stop and tell me — the
   repository name, `SITE_URL`, and the published address all change with it.

2. **`farhanshehzad155@gmail.com` added and verified** on that account.
   Settings → Emails. If it is not verified, your seven commits will not link to your profile,
   and the contribution graph that a recruiter looks at will stay empty.

3. Node 22+ and git — already installed and working on this machine.

---

## 2. Authenticate the GitHub CLI **[you]**

`gh` is installed (v2.97) but not logged in. This step is interactive, so run it yourself.
In Claude Code, prefix with `!` so the output lands in the conversation:

```
! gh auth login --scopes workflow
```

Answer the prompts:

| Prompt | Answer |
|---|---|
| What account do you want to log into? | **GitHub.com** |
| Preferred protocol | **HTTPS** |
| Authenticate Git with your GitHub credentials? | **Yes** |
| How would you like to authenticate? | **Login with a web browser** |

The `--scopes workflow` is not optional. Without it, the push in §4 is **rejected** with:

> refusing to allow an OAuth App to create or update workflow `.github/workflows/ci.yml`
> without `workflow` scope

Verify:

```bash
gh auth status
```

You want to see `farhanshehzad155` and a scope list containing `workflow` and `repo`.

---

## 3. Create the repository

The name must be **exactly** `farhanshehzad155.github.io`. For a GitHub *user site* the
repository name is the routing mechanism — it is what makes the site serve from the domain
root with no path prefix. Any other name changes the URL and would require a `basePath` in
`next.config.mjs`, which this project deliberately does not have (ADR-007).

```bash
gh repo create farhanshehzad155.github.io \
  --public \
  --description "Personal engineering portfolio — AI automation and integration engineer" \
  --source=. \
  --remote=origin
```

- `--public` is required: GitHub Pages on a private repository needs a paid plan, and PRD
  FR-P6 wants this public anyway.
- `--source=.` wires this directory to the new repository and adds the `origin` remote.
- **Do not** pass `--push` yet, and **do not** let GitHub add a README, `.gitignore` or
  licence. This repository already has all three, and an initialised remote makes the first
  push fail as a non-fast-forward.

<details>
<summary>Alternative: create it through the web UI</summary>

1. github.com → **New repository**
2. Name: `farhanshehzad155.github.io` — Visibility: **Public**
3. **Leave "Add a README file", ".gitignore" and "license" all unticked.**
4. Create, then:

```bash
git remote add origin https://github.com/farhanshehzad155/farhanshehzad155.github.io.git
```
</details>

Verify:

```bash
git remote -v
```

---

## 4. Push

```bash
git push -u origin main
```

Seven commits go up. This immediately triggers **both** workflows — `CI` and `Deploy` — because
each runs on push to `main`.

The `Deploy` run will **fail at the last step** on this first push, and that is expected: Pages
is not configured yet, so `actions/deploy-pages` has nothing to deploy into. §5 fixes it.

Verify:

```bash
gh run list --limit 5
```

---

## 5. Turn on Pages **[you]**

**This is the step people miss.** Skip it and the Deploy workflow either fails or goes green
while the URL keeps returning 404, with no obvious cause.

Go to:

> **Settings → Pages → Build and deployment → Source**

Set it to **GitHub Actions**. Not "Deploy from a branch".

<details>
<summary>Alternative: set it from the CLI</summary>

```bash
gh api --method POST \
  repos/farhanshehzad155/farhanshehzad155.github.io/pages \
  -f build_type=workflow
```

If it returns `409 Conflict`, Pages already exists — use `--method PUT` instead.
</details>

---

## 6. Deploy

The failed run from §4 needs re-running now that Pages exists:

```bash
gh run list --workflow=deploy.yml --limit 1
gh run rerun <run-id>
```

Or simply:

```bash
gh workflow run deploy.yml
```

Watch it:

```bash
gh run watch
```

Two jobs: **build** (validates content, builds, uploads `out/`) then **deploy**. The first
successful run creates the `github-pages` environment automatically.

Expect the whole thing to take two to three minutes. The first-ever deploy can take up to ten
minutes to become reachable while DNS and the certificate settle.

---

## 7. Verify the live site

Open **https://farhanshehzad155.github.io**

Work down this list. Each item catches a specific, known failure mode:

- [ ] **The page is styled.** Unstyled text means `public/.nojekyll` did not make it — Jekyll
      strips the `_next/` directory. It is committed, so this should not happen, but it is the
      classic Pages failure and worth one glance.
- [ ] **Navigate to `/work/`, then hard-refresh (Ctrl+F5).** Still works? Good — that confirms
      `trailingSlash: true` is doing its job (ADR-008). A 404 here is the second classic
      failure.
- [ ] **Open a case study, hard-refresh.** Same check, for a `generateStaticParams` route.
- [ ] **Visit a nonsense URL** like `/nope/`. You should get the custom 404, not GitHub's.
- [ ] **Toggle the theme, reload.** It should persist with no flash of the wrong theme.
- [ ] **Check `/robots.txt`** shows `Disallow: /` — confirms the §0 guard is live.
- [ ] **View source on the home page**, confirm `<meta name="robots" content="noindex...">`.
- [ ] **Disable JavaScript and reload.** All content still readable (NFR-9).
- [ ] **Open it on your phone.**

Known and expected at this stage: broken social-card images, and `/farhan-shehzad-resume.pdf`
returning 404 from the résumé page.

---

## 8. Harden the repository **[you]**

Do these **after** the first successful push, in this order.

### 8a. Enforce HTTPS
Settings → Pages → tick **Enforce HTTPS** (available once the certificate provisions).

### 8b. Branch protection
Settings → Rules → Rulesets → New branch ruleset, targeting `main`:
- Require a pull request before merging
- Require status checks to pass: `Types, lint, content`, `Build and export`, `Dependency audit`

> Order matters. Those checks do not exist as selectable options until CI has run at least
> once, which is why this comes after §4. And once protection is on you can no longer push
> straight to `main` — every change needs a branch and a PR, including yours.

### 8c. Dependabot
Settings → Code security → enable **Dependabot alerts** and **Dependabot security updates**.
The schedule itself is already committed in `.github/dependabot.yml`.

### 8d. Profile README **[you]**
Create a **second, separate** repository named exactly `farhanshehzad155` — the handle with no
suffix. This is distinct from the Pages repository and there is no conflict between them.

```bash
gh repo create farhanshehzad155 --public --description "Profile README"
```

Add a `README.md` following PRD Appendix B: under 300 words, no badge walls, no streak cards,
no contribution snake.

### 8e. Profile fields **[you]**
Settings → Public profile: bio, location, and website → `https://farhanshehzad155.github.io`
(GH-7). Hold the website field until §9 if you would rather not point at a draft.

---

## 9. Going properly live

Do **not** do this yet. This is the checklist for when the content is finished.

1. `npm run validate:strict` passes with **zero** warnings. It currently reports 38.
2. The launch checklist in TRD §15.3 is complete — NVDA and VoiceOver passes, OG images
   generated, résumé PDF generated, every page proofread aloud.
3. PRD §22 answered, in particular Q1 (Proglo permission), Q4 and Q5 (the two metric bases),
   and the LinkedIn date reconciliation.
4. Set `SITE_INDEXABLE = true` in `src/lib/constants.ts`.
5. Commit, push, let it deploy.
6. Confirm `/robots.txt` now reads `Allow: /` and the noindex meta tag is gone.
7. Submit `https://farhanshehzad155.github.io/sitemap.xml` to Google Search Console.
8. Add the link to LinkedIn (featured section) and to your GitHub profile.

---

## 10. Custom domain (optional, PRD Q9)

Only if you buy one.

1. Create `public/CNAME` containing the apex domain, one line, no scheme:
   ```
   farhanshehzad.dev
   ```
2. At your registrar:

   | Type | Name | Value |
   |---|---|---|
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | AAAA | `@` | `2606:50c0:8000::153` |
   | AAAA | `@` | `2606:50c0:8001::153` |
   | AAAA | `@` | `2606:50c0:8002::153` |
   | AAAA | `@` | `2606:50c0:8003::153` |
   | CNAME | `www` | `farhanshehzad155.github.io.` |

3. Settings → Pages → Custom domain → enter the apex → wait for the DNS check.
4. Wait for the certificate, then re-tick **Enforce HTTPS**.
5. Change `SITE_URL` in `src/lib/constants.ts` to the new origin. One edit — it propagates to
   canonicals, OG tags, the sitemap and JSON-LD.
6. Commit and push. Re-submit the sitemap to Search Console under the new domain.

`basePath` is never involved, in either configuration. That is the payoff of ADR-007.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Push rejected, "updates were rejected" | The remote was initialised with a README or licence | `git pull --rebase origin main`, resolve, push again. Or delete and recreate the repo empty. |
| `refusing to allow an OAuth App to create or update workflow` | `gh auth login` ran without `workflow` scope | `gh auth refresh -h github.com -s workflow` |
| Deploy workflow green, URL 404s | Pages Source is not "GitHub Actions" | §5 |
| Deploy job fails at `actions/deploy-pages` | Pages never enabled, or the `github-pages` environment is missing | §5, then re-run |
| Site loads as unstyled text | `.nojekyll` missing from `out/` | Confirm `public/.nojekyll` is committed; rebuild |
| Every route 404s except `/` | `trailingSlash` disabled | Must stay `true` in `next.config.mjs` |
| CSS and JS 404 with a doubled path | Someone added a `basePath` | Remove it. A user site serves from root. |
| Build fails on "Content validation" | An evidence-policy rule fired | Read the message; it names the slug, the field and the PRD section |
| Commits do not appear on your profile | Email not verified, or the wrong author | `git log --format='%an <%ae>'` should show `farhanshehzad155@gmail.com` |
| Actions do not run at all | Actions disabled for the repository | Settings → Actions → General → Allow all actions |

---

## Quick reference

```bash
# One-time
gh auth login --scopes workflow                    # interactive
gh repo create farhanshehzad155.github.io --public --source=. --remote=origin
git push -u origin main
#   then: Settings > Pages > Source: GitHub Actions
gh workflow run deploy.yml

# Every time after
git switch -c my-change
# ... edit ...
npm run build          # validates content, then builds
git commit -am "feat: ..." && git push -u origin my-change
gh pr create --fill
# merge -> deploys automatically

# Useful
gh run watch                   # follow the current run
gh run list --limit 5          # recent runs
npm run validate:strict        # the release gate
npm run serve                  # serve out/ exactly as Pages will
```
