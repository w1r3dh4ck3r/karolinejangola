# notes.md — AI handoff journal

## 2026-07-25 — Source reconstruction (repo had NO source, only the compiled build)

**What happened:** The repo contained only the deployed build (minified `assets/index-*.js`, a `<div id="root">` SPA shell) — the original React source was never committed and was unrecoverable (no sourcemap, not on disk, likely a lost Lovable project). Reconstructed a clean **React 18 + Vite + TypeScript + Tailwind** source tree under `app/` that rebuilds to reproduce the live site. Done via the full kickoff flow (brainstorm → spec → plan → subagent-driven execution with per-task review → Opus whole-branch review → Gemini adversarial gate).

**Key decisions / non-obvious things:**
- **Ground truth = the live minified bundle, not the docs or the prerendered HTML.** `404.html`/blog prerenders were STALE (frozen 2026-03-27, old phone `5527995119177`, missing the audience split + contact form). Live content was extracted from `assets/index-NAF8EB0S.js` → `docs/reference/current-site-inventory.md`. The rebuild's fresh prerenders fix that stale-SEO bug.
- **Fonts/palette:** live uses **DM Serif Display + DM Sans + sage/terracotta**, NOT the Playfair/Inter + warm-browns in the old brand brief. Rebuilt to match live; updated `CLAUDE.md`/`STACK.md` to the as-built values.
- **Hosting is GitHub Pages**, not Cloudflare Pages (the AIBrain wiki was wrong). Server header = GitHub.com; `CNAME` = apex. Push to `main` = live deploy.
- **Build/deploy split:** source in `app/`, `npm run build` → `app/dist/` (never the root), `npm run publish:site` copies dist → repo root. Prerender (`app/scripts/prerender.mjs`) is Playwright-based (needs `npx playwright install chromium`) and derives blog routes from the rendered `/blog` DOM so new posts auto-prerender + auto-sitemap.
- **Faithful-vs-improve:** deliberately kept the live site's quirks (scroll-to-top only on mount, no reduced-motion handling, English 404 copy) — Mark's priority was "rebuild as it is; changes come after." Recommended first enhancement: scroll-to-top on client nav.
- **Preserved verbatim** (revenue-critical): gtag `AW-16583121961` + conversion `…/shGzCIOqipYcEKm4ueM9`, Formspree `f/xeevlzlb`, n8n `n8n.w1r3d.dev/webhook/visitor`, JSON-LD, GSC tag, `CNAME`.

**Verification:** clean `npm ci && npm run build` exit 0; Playwright browser-compare vs the live apex = zero deltas; all constants asserted. See `docs/reference/rebuild-verification.md`.

## 2026-07-25 — DEPLOY GOTCHA: GitHub Pages needs `.nojekyll`

The first deploy push FAILED silently at GitHub's "pages build and deployment" Actions step: **Jekyll runs by default and its Liquid parser errored on `docs/superpowers/plans/2026-07-25-source-reconstruction.md`** (a `{{q,a}` in the text reads as an unterminated Liquid `{{ }}` variable). The old bundle-only repo built fine because it had no `{{ }}` markdown; the reconstruction added docs that trip Jekyll. **Fix: a root `.nojekyll` file** (also in `app/public/.nojekyll` so rebuilds keep it) disables Jekyll → Pages serves the prebuilt files as-is. Keep `.nojekyll` forever. If a deploy ever "succeeds on push but the site doesn't update", check the `pages build and deployment` Actions run for a Jekyll/Liquid error first.

## 2026-07-25 (same day) — Content changes sprint (DONE, reviewed, on main, unpushed)

The 3 changes Mark asked for, implemented + reviewed on `main` (commits `8efdb7d` + a source-consistency follow-up):
1. **Audience split removed → unified CTA:** `#para-quem` keeps its heading but the two cards ("Para mim"/"Para meu filho/a") are replaced by one combined description + a single "Fale comigo pelo WhatsApp" button (`WA.general`). Removed `WA.paraMim`/`paraFilho`, `AudienceCard`, `CTA_LINKS`, per-card `ctaText` + their tests.
2. **ISO 9001 removed (both):** the "Quem sou eu" paragraph clause AND the stat tile. Sobre now shows one tile ("100% / atendimento online") — deliberately did NOT fabricate a replacement stat.
3. **Reach → Brazilians abroad (everywhere):** contact line, meta description (source `app/index.html` + `seo.ts`), and JSON-LD `areaServed` (now Brasil + "Brasileiros no exterior"). New wording: "Atendimento online para o Brasil e para brasileiros que vivem no exterior."

Reviewed (approved, no regression: conversion/Formspree/n8n intact, both JSON-LD types, old phone absent, single og/twitter tags; visual check of the single stat tile + unified section passed).

**Next steps:**
- **Nothing pushed.** All work (reconstruction + these 3 changes) sits on local `main`, ahead of `origin/main`. Awaiting Mark's push approval to deploy (push of `main` = live via GitHub Pages).
- Mark to pick canonical host for the TLS fix: www-primary (recommended — matches existing canonical tags; I'd set `CNAME` to `www.karolinejangola.com`) vs apex-primary (change canonical in `seo.ts`). Immediate cert fix = re-save the GitHub Pages custom domain (DNS already correct).
- Optional enhancement not done: scroll-to-top on client-side nav (kept faithful to the old bundle's mount-once behavior).

## 2026-07-25 (same day) — Audience reposition: children & adolescents only, no women

Practice repositioning: dropped "women" from every audience descriptor, site now speaks to children & adolescents exclusively (parents/guardians as readers). Precise word-level sweep, no touch to testimonials or other treatment-card copy:
- `content.ts`: hero body ("para mulheres e crianças" → "para crianças e adolescentes"), Sobre paragraph ("crianças e pré-adolescentes" → "crianças e adolescentes"), Para-quem description (removed the women clause entirely, kept only the children/adolescents sentence).
- `faq.ts`: "Para quem é indicado" answer ("mulheres adultas e crianças/pré-adolescentes" → "crianças e adolescentes").
- `treatments.ts`: one word in the "Terapia de Jovens" card body ("pré-adolescentes" → "adolescentes") — rest of that card left for the owner to rewrite separately.
- `seo.ts` (3x) + `app/index.html` (meta description, og:description, twitter:description): "especializada em mulheres e crianças" → "especializada em crianças e adolescentes".
- `Sobre.tsx` portrait alt text: "especializada em crianças e mulheres" → "especializada em crianças e adolescentes".
- `CLAUDE.md`: Copy Rules target-audience line updated to children & adolescents / parents-guardians. Female-grammar rule left untouched (separate review, per brief).

**Bug found + fixed along the way:** `app/scripts/publish.mjs`'s copy-denylist blocked every dotfile at repo root unconditionally, so it threw on `.nojekyll` (which is legitimately published content, copied from `app/public/.nojekyll`) and left the repo root half-deleted (index.html/assets/blog/sitemap.xml/404.html all removed, nothing copied back) on the first `publish:site` run since `.nojekyll` was added (commit `dc961e2`). Fixed by adding an explicit `.nojekyll` carve-out in `isCopyDenylisted`, same pattern already used implicitly for CNAME/robots.txt. Re-ran publish — root fully restored, exit 0.

**Verification:** `npm run build` exit 0, `npm run publish:site` exit 0 (18 files copied), `npx vitest run` 4/4 pass. Served root: 0 hits for "mulheres e crianças", "mulheres adultas", "pré-adolescentes"; "crianças e adolescentes" present (5x); no regression — "para brasileiros que vivem no exterior" still present, ProfessionalService + FAQPage JSON-LD both present, Formspree/n8n/conversion-label/AW-id intact in `assets/*.js`, old phone `5527995119177` absent.

**Next steps:** (superseded — see the DEPLOYED entry below). Full task report: `.superpowers/reposition-report.md`.

## 2026-07-25 — DEPLOYED + live (supersedes the "nothing pushed" notes above)

Everything this session is now **pushed to `origin/main` and LIVE** on karolinejangola.com (GitHub Pages): the source reconstruction, the 3 content changes, the `.nojekyll` fix, the `publish.mjs` dotfile-denylist fix, and the children-&-adolescents repositioning (no women). Live-verified after each deploy (bundle hash flip + content greps).

**Deploy pipeline is healthy now** — push `main` → Pages auto-builds → live in ~1–2 min. (Earlier this session the first deploy stalled twice: the Jekyll/`.nojekyll` failure left Pages in an `errored` state that stopped auto-building; recovered by `.nojekyll` + `gh api --method POST repos/w1r3dh4ck3r/karolinejangola/pages/builds`. If a future push doesn't go live, check `gh api .../pages` status and POST a build.)

**Open (Mark's, none blocking):**
- **[DONE 2026-07-25]** Removed the health-plan reimbursement claim (`app/src/data/faq.ts`): the "Você atende por plano de saúde?" answer is now just `Atualmente atendo apenas de forma particular.` — built, published, pushed (`0f49069`), live-verified (reembolso/recibo = 0).
- Treatments copy — Mark rewrites himself (the 5 cards still have adult framing incl. "Relacionamentos"; only the one `pré-adolescentes` word was swapped).
- Swap the two adult-women testimonials (Ana Carolina, Lívia) — kept for now.
- Female-grammar decision: some copy still addresses a female reader (hero H1 "Você não precisa carregar tudo **sozinha**"); now that the reader is a parent, decide keep-as-mothers vs neutral. `CLAUDE.md` female-grammar rule left untouched pending this.
- **www TLS:** Mark DID the Pages custom-domain re-save + enabled Enforce HTTPS (2026-07-25 ~18:20). As of then, Pages cert state = `dns_changed` (GitHub re-provisioning); cert still lists apex only, `www` still serves the `*.github.io` fallback (https 000). GitHub cert provisioning is async (minutes–24h) — **re-check `www` later**: `echo | openssl s_client -servername www.karolinejangola.com -connect www.karolinejangola.com:443 | openssl x509 -noout -subject` should show `CN = www.karolinejangola.com` (or apex SAN incl. www). If it's still fallback after ~24h, remove/re-add the custom domain again. Apex (`https://karolinejangola.com`) is valid + safe throughout. DNS is correct (apex→Pages IPs, www→w1r3dh4ck3r.github.io). Optional later: flip to www-primary (`CNAME` + `publish.mjs` guard → `www.karolinejangola.com`) once www's cert is live.
- `docs/reference/current-site-inventory.md` is a point-in-time capture of the ORIGINAL site — its "mulheres e crianças" positioning is pre-repositioning history, noted at its top.

## 2026-08-01 — www TLS: diagnosed as a GitHub-side bug, Support ticket filed (supersedes the 2026-07-25 www TLS bullet above)

The www security warning was still live a full week after the 2026-07-25 re-save, so the "re-check after 24h / remove-re-add again / flip to www-primary" plan from that entry is **wrong** — none of it fixes this. What it actually is:

**Root cause = GitHub Pages backend certificate-provisioning stall, NOT client-side.** Verified everything on our end is clean: apex → the 4 Pages A records (no AAAA, no stray CNAME); `www` → CNAME `w1r3dh4ck3r.github.io`; CAA authorizes `letsencrypt.org` (www inherits github.io's CAA; apex has none). The Pages API cert has been stuck `dns_changed` with `domains:['karolinejangola.com']` — **www never added** — apex serves a valid LE cert, www serves the `*.github.io` fallback → the browser warning.

**What I did (durable changes to the live Pages state):** removed + re-added the Pages custom domain via the API and forced a build. This **cleared a `status: errored` build state** (leftover from the old Jekyll/`.nojekyll` failure) that had likely been blocking provisioning for the whole week; Pages status is now `built`, custom domain back to apex (`karolinejangola.com`), `https_enforced:false`. Cert still apex-only 45+ min later.

**Dead end avoided (research, primary GitHub sources):** the www-primary flip does NOT reliably fix this. Matches an active 2026 Pages backend bug (July 19–20 incident; community discussions #202318, #200447) where the stuck state is **domain-scoped** — one report tried both apex- and www-primary and stayed stuck either way; www-primary risks **mirroring the warning onto the apex** (our one working host). GitHub staff explicitly say to **stop removing/re-adding** (it resets their internal timer). I built the www-primary flip locally (CNAME + `app/public/CNAME` + `publish.mjs` guard; `seo.ts` canonical was already www) then **reverted it — never pushed.**

**Outcome:** Mark **filed a GitHub Support ticket ~17:00** (portal has no Pages category, so it went under Repository features → Branches; GitHub's own AI triage confirmed our DNS is correct and there's no self-service fix). **Now waiting on GitHub's reply.**

**Next:** when GitHub replies (or periodically), re-check `www` cert — `echo | openssl s_client -servername www.karolinejangola.com -connect www.karolinejangola.com:443 | openssl x509 -noout -subject` (want CN=www or apex SAN incl. www) and `gh api repos/w1r3dh4ck3r/karolinejangola/pages` (want cert `domains` to include www). Do NOT flip to www-primary or cycle remove/re-add while the ticket is open. Apex stays valid/safe throughout. Small chance the errored-clear lets it self-heal <24h.

## 2026-08-04 — Canonical was pointing at the broken host (fixed + live); GitHub Support stalled, escalation drafted

Re-verified the www cert 3 days after the ticket: **no movement** — Pages API still `dns_changed`/"Requesting a new certificate", `domains:['karolinejangola.com']` (www never added). DNS+CAA re-confirmed clean. GitHub Support replied with a canned "read the help articles" non-answer, so the ticket never reached a human who can see the stalled provisioning job.

**The find this session (missed by every prior session): SEO canonical pointed at the broken host.** `SITE_URL` in `app/src/data/seo.ts` was `https://www.karolinejangola.com` while the Pages primary domain (CNAME) is the apex. So every page's `<link rel=canonical>`, og:url and JSON-LD `url`/`image` advertised the one host that throws a cert warning, while the apex serves a valid LE cert. Prior TLS sessions were entirely focused on the GitHub-side cert and never checked what URL the site itself was publishing.

**Fix (commit `79ed3df`, live-verified):** repointed to apex in 5 spots — `seo.ts:6` (the single source that propagates through `prerender.mjs` to all canonical/OG/JSON-LD) plus the 4 placeholder literals in `app/index.html` (canonical, og:url, og:image, twitter:image). Built + published; served root has ZERO www; live homepage confirmed serving apex canonical + og:url after Pages build went `built`. **Deliberately did NOT touch CNAME / `app/public/CNAME` / the `publish.mjs` guard — this is NOT the forbidden "www-primary flip"**, just aligning the advertised canonical with the working primary host.

**Decisions (Mark):** (1) pushed the fix; (2) **Google Ads point at the apex** → the broken www is LOW-severity: paid traffic lands on the valid apex, only someone manually typing `www` hits the warning. That reframes the whole thing — no emergency, no need for the Cloudflare-in-front option (deferred; it's a real nameserver migration and not worth it while the apex works). (3) Path for the cert itself = **press the GitHub ticket**: escalation reply written to `docs/github-support-www-cert-escalation.md` (hard API evidence + verified DNS/CAA, explicit ask to escalate to the Pages team to re-trigger provisioning for www) for Mark to paste into the existing thread.

**Left for later (noticed, not fixed):** `seo.ts:29` JSON-LD `serviceType` still lists "Terapia para Mulheres" — a leftover from before the children-&-adolescents repositioning.

## 2026-08-07 — SEO program kicked off; SP0 (multi-page publishing) built + shipped

Mark pasted an external 15-item SEO/conversion review of the site. Triaged it against the LIVE source rather than taking it at face value — and the whole review was written for a **women+children** practice, which directly contradicts the 2026-07-25 repositioning to **children & adolescents only**. So every women-facing item (a "Terapia para Mulheres" page, women keywords, women blog topics) was rejected on positioning. Also flagged: the review assumed **Vitória/ES** for local SEO, but the phone DDD is **79 = Sergipe**, and a number doesn't prove where she practices — so local SEO is BLOCKED on Mark giving the real city. And refused to invent authority items (ISO 9001 was removed on purpose; won't fabricate credentials/stats/reviews).

**Decisions (Mark):** keep children-&-adolescents only; build the FULL program (40 pages/100 articles); reader addressed as **the mother/guardian in female grammar** (so CLAUDE.md's female-grammar rule stays, just reframed from patient to mother — no rule edit). The program is too big for one spec → decomposed into **SP0–SP8** (SP0 publishing capability → SP1 positioning consistency → SP2 IA/keyword-map → SP3 build pages → SP4 authority → SP5 blog engine → SP6 local/GMB → SP7 lead magnet → SP8 CWV).

**Why SP0 first (the feasibility gate the advisor caught):** the prerender/publish pipeline was **blog-only** — `prerender.mjs` hardcoded `/` + `/blog` and scraped `/blog` for post slugs; `App.tsx` had 4 routes; `publish.mjs`'s `GENERATED_PATHS` didn't cover new page dirs. Building 40 service pages on that would ship them to Google as empty `<div id="root">` shells while looking finished. SP0 makes "register a page → it ships as prerendered HTML w/ apex canonical + sitemap entry, cleaned on republish" a real, verified capability.

**SP0 design + build:** a single **plain-JSON manifest** (`app/src/data/pages/manifest.json`) is the source of truth, read by the app (typed) AND by the Node scripts via `fs` — this SUPERSEDED the spec's original "build-emits `dist/pages-manifest.json`" idea (simpler, no transpile, survives an empty `[]`). Built via subagent-driven-development: 7 TDD tasks (manifest → content → `staticPageSeo` → `StaticPage`+routes → prerender enumerate + extracted `lib/sitemap.mjs` → publish cleanup + extracted `lib/generated-paths.mjs` → local verify + teardown), each with a task review; Opus whole-branch review returned merge-Yes.

**Verification was LOCAL, by Mark's choice** — rather than deploy a throwaway `/_smoke` page to the live Ads site twice, served the built `dist/` with `python3 -m http.server` (which resolves `/_smoke/` → `_smoke/index.html`, mimicking Pages) and curled it: real prerendered HTML, apex canonical, sitemap entry. The one genuinely-remote unknown (does GitHub serve a dir/index.html as real HTML?) is already answered by the live blog posts, which use the identical mechanism. Then emptied the manifest → ships **dormant** (no routes until SP3).

**Known limitation to carry into SP3 (parked finding):** `publish.mjs` cleans only sectionRoots CURRENTLY in the manifest, so a page **removed** from the manifest orphans its already-published dir. Fix in SP2/SP3 by putting service pages under a **fixed** sectionRoot (a permanent `GENERATED_PATHS` entry, wiped+recopied like `blog/`) so per-page removal self-cleans. Deferred minors, recorded here since the SDD scratch ledger was removed after merge: dead `SITE_URL` in `prerender.mjs`; two inaccurate code comments (`pages/index.ts` cast rationale; and one more); `generated-paths.mjs` gives an opaque `TypeError` on a malformed/non-array manifest (fails safe, non-deleting); and post-teardown the `manifest`/`content` tests iterate empty arrays so they pass vacuously until SP3 repopulates the manifest. None block anything; clean up opportunistically in SP3.

**Preserved verbatim** (revenue/deploy-critical, re-verified after the republish): gtag `AW-16583121961` + conversion label, Formspree `f/xeevlzlb`, n8n webhook, `.nojekyll`, `CNAME`=apex, apex canonical.

## 2026-08-09 — SP2 (SEO IA/keyword-map) speced + approved; SP3 build plan written

Karoline answered the 4 intake questions that had blocked SP2 → recorded verbatim + structured in `docs/reference/practice-facts.md` (authoritative content source). Ran SP2 as a full brainstorm→spec cycle; Mark approved all sections. Then wrote the SP3 build plan. **Docs only — no app/site changes, SP3 not yet executed.**

**Key decisions (the why):**
- **psicanalista/terapeuta, NEVER "psicólogo/a".** Web research (CRP-03, ONP, Jusbrasil, FEBRAPSI — see `docs/reference/keyword-research-2026-08-09.md` §1) confirmed "psicólogo/a" is a CRP-protected title (Lei 4.119/1962; 5.766/1971); psicanálise/psicoterapia are unregulated. Targeting "psicólogo infantil" demand = false-advertising risk + implies diagnóstico/laudo/testes she doesn't do. So titles/H1/JSON-LD stay on psicanalista/terapeuta.
- **Hard claim boundary drives the taxonomy.** She does NOT diagnose, screen, issue laudos, or take planos. High-volume TDAH/TEA searches split into acompanhamento-intent (hers) vs diagnóstico/laudo/teste-intent (NOT hers) → those are negative keywords, disclaimed via a shared boundary FAQ. TDAH/TEA/comportamento pages are *fortalecimento emocional*, never assessment.
- **IA = Hybrid**, 9 pages (3 service + 6 condition) under a **single fixed section root `/atendimento/`** — chosen specifically to close the SP0 orphan finding (fixed root wiped+recopied like `blog/`). P0/P1/P2 demand tiers.
- **No depressão/trauma pages** — not in her stated list (the live `treatments.ts`/`seo.ts` still list them + adult/women framing → SP1's job).
- National online positioning, **no geo pages** (SP6 owns local/GMB; real city still unconfirmed).

**Two SP3 gotchas found by reading the code (in spec §4–§5 + plan Tasks 2–3):**
- Static pages emit **zero JSON-LD** today (`staticPageSeo` returns none, though `Seo` already supports a `jsonLd` array) → plan adds BreadcrumbList(all) + FAQPage(TDAH/TEA/comportamento).
- Page bodies are injected via `dangerouslySetInnerHTML`, so an in-body `<a onClick>` **won't fire the Ads conversion** → `StaticPage` must render a real `<WhatsAppLink>` CTA below the article (inline-onclick snippet documented for any in-body CTA).

**⚠️ Sequencing:** program order was SP1→SP2→SP3; we ran SP2 ahead because it unblocked. **SP1 still pending** and SP3's Task 13 (home hub-card links) depends on SP1's rewritten cards; the live home also still has adult/women leftover copy. Recommended **SP1 before executing SP3**; Tasks 1–12+14 are SP1-independent.

**Next steps:** Mark chose (end of session) to **wrap up + shut down**; SP3 execution deferred. On resume: pick SP1-first vs execute-SP3 (see SESSION-STATE). Karoline can tone-check the 9 page copy drafts (claims are locked, wording soft). Housekeeping: notes.md now spans >3 sessions — archive pre-2026-08-07 entries to `docs/notes-archive.md` next session.

## 2026-08-10 — SP1 (positioning consistency) BUILT, REVIEWED, DEPLOYED + LIVE

Mark chose SP1 before SP3. Full kickoff cycle (brainstorm→spec→plan→SDD execute→Gemini gate). Removes the women/adult leftovers so every surface targets **children & adolescents (8–19), reader = mother/guardian in female grammar**, honoring the hard claim boundary (no diagnóstico/laudo/testes/planos; never the CRP title "psicólogo/a"). **Merged to `main` (ff), pushed, live-verified** on karolinejangola.com (commit `ff29776`, Pages `built`).

**What changed:** `treatments.ts` — all 5 cards replaced with her real conditions (Ansiedade / TDAH / Relacionamentos e vida social / TEA (autismo) / Autoestima e comportamento), dropping the Depressão + Trauma cards; the TDAH/TEA cards **explicitly state "não faço diagnóstico nem laudo"** (copy = legal protection). `seo.ts` — serviceType drop "Terapia para Mulheres" + add "Terapia para Adolescentes"; knowsAbout drop Depressão/Trauma; descriptions "Tratamento…depressão, trauma" → "Acompanhamento de ansiedade, TDAH, TEA, autoestima…". `faq.ts` Q5 — drop depressão/traumas, add the 8–19 range. Blog `como-saber` — scrubbed the two worst adult lines (§3/§7) only.

**The catch the reviews earned (why multi-layer review matters):** the data-file edits alone did NOT fix the site. `app/index.html` carried a hardcoded, **non-seo-managed `<meta name="keywords">`** served on every page reading *"psicóloga online Brasil, …depressão… terapia para mulheres"* — a **served CRP-title violation** the guard test (which imports the TS modules, not the HTML) never saw. Caught by the Task-3 whole-artifact reviewer → Task 4 scrubbed lines 8/10/17 and **extended the guard to `readFileSync('index.html')`**. Classic "audit the artifact, not the config": data clean, served HTML wasn't. The Gemini gate then caught two more guard-coverage holes (missing `/psicólog/i` on the data-file check; no assertion that description == og:description) → both fixed. All 27 tests pass; guards now cover data files + index.html.

**Decisions (Mark):** hero H1 "sozinha" KEPT — it's correct female grammar for the mother-reader (overrode the stale "reframe hero" note). Testimonials Ana Carolina/Lívia "Paciente adulta" KEPT for now (real adult-women quotes, can't be honestly relabeled → accepted, known inconsistency). Deployed live (Ads site) with explicit approval.

**Deferred to SP5 (non-blocking):** blog BODY prose still says "depressão"/"psicólogo" in `terapia-online-funciona` + `como-saber` (the "psicólogo" there is a generic profession reference, not applied to Karoline) — full blog reframe is SP5's job; SP1 only touched the 2 worst lines by design. Also a nice-to-have: a guard tripwire asserting the TDAH/TEA disclaimer text survives.

**Next:** SP3 (build the 9 `/atendimento/` pages) — Task 13 now unblocked by SP1's rewritten cards.
