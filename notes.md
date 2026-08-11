# notes.md — AI handoff journal

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

## 2026-08-10 — www TLS cert RESOLVED (GitHub Support fix, verified live)

The multi-week stuck www cert is **fixed**. GitHub Support replied (2026-08-06) that they nudged
the provisioning; a cert covering www was approved. Verified live 2026-08-10 (trust the metal, not
the claim): `gh api .../pages` cert `domains` now `[apex, www]`, `state:approved`, exp 2026-11-04;
`openssl s_client` on www returns a valid **Let's Encrypt** cert with SAN covering both names — no
more `*.github.io` fallback warning. **The Support-ticket path worked; the www-primary flip we were
tempted into and held was correctly avoided** (it was a GitHub backend provisioning stall all along,
exactly as diagnosed). Caveat from Support: this hands-on help is a paid-plan perk, so a recurrence on
the free plan might not get it. Remaining: `https_enforced` is still `false` — enabling "Enforce
HTTPS" is now safe (cert covers both hosts) but is Mark's managed repo setting, offered not toggled.
Lesson updated in memory [[github-pages-stuck-www-cert]].

## 2026-08-10 — Humanized the 5 treatment card bodies (DEPLOYED + LIVE)

Mark asked to run the site copy through a "humanizer" and research the best. **Research verdict:
don't use a SaaS humanizer** — they're English-first detector-EVASION tools, no verified pt-BR
quality, none aware of Portuguese gender agreement (would break the female-grammar rule), and
several retain/train on input. Used the local **`humanizer` skill** (Wikipedia signs-of-AI-writing)
instead. Full detail + the do/don't in project memory [[site-copy-humanizing-approach]].

**Scope decision (Mark):** humanize only the **5 SP1 treatment card bodies** now. Deferred blog-body
humanizing into SP5's reframe (doing it now = overwritten later); excluded SEO meta descriptions
(SERP snippets, negligible benefit); never touched her authentic reconstructed copy (hero/Sobre/
Para quem/FAQ) or the real testimonials.

**The actual fix wasn't em-dash removal.** Karoline's own copy uses em dashes (house style), so the
real AI tell was the **repeated template** — all 5 cards read "symptom, symptom, symptom — abstract
statement. What I do." De-templated: varied each opening (statement / "Sou mãe de…" / group
observation / "Acompanho…" / conditional), kept warmth, held every constraint (mother-reader female,
child neutral, TDAH/TEA disclaimers verbatim, factual "mãe de…" lines).

**Bug the layered review caught (worth remembering):** the "Relacionamentos" card draft I approved
read "…se sentem **sozinhas**" for "crianças e adolescentes". I justified it wrongly ("agrees with
crianças") and an internal reviewer accepted it; the **Gemini gate caught it** — a mixed group takes
the **masculine-neutral** (`sozinhos`), and feminine there misgenders boys + narrows positioning.
Fixed pre-deploy. Lesson in memory [[pt-br-female-grammar-mixed-group]]: the female rule is about the
MOTHER-reader, never the child group.

**Shipped:** commits `15cf1a5` (humanize) + `4275c50` (sozinhos fix), merged to main, pushed,
**live-verified** on karolinejangola.com (Pages `built`, bundle `index-bgtvaYuI.js`): new copy served,
old templated copy gone, both disclaimers present, zero depressão/trauma/mulher/psicólog, gtag/Formspree/
apex-canonical/.nojekyll intact. Reviews: internal reviewer ✅ + Gemini gate cleared (round 2).

## 2026-08-10 — SP3: 9 `/atendimento/` pages BUILT via SDD, DEPLOYED + LIVE

Executed SP3 (the SEO program's page-build sprint) end-to-end via **subagent-driven-development**:
14 plan tasks + a final whole-branch review + a final-review fix wave, each task getting a fresh
implementer (sonnet) → task review (sonnet) → scoped re-review on fixes; opus for the whole-branch
review. Deploy commit `38dc741` (site-root publish of the SP3 branch `92bd1ea`), Pages `built`,
**live-verified** on karolinejangola.com.

**What shipped:** 9 pages under a single fixed root `/atendimento/` — 3 service (terapia-infantil,
terapia-para-adolescentes, orientação-para-pais) + 6 condition (ansiedade, TDAH, TEA, autoestima,
comportamento, relacionamento/timidez). Each prerendered with apex canonical + **BreadcrumbList**
JSON-LD; **FAQPage** + a verbatim boundary FAQ on the 3 boundary pages (TDAH/TEA/comportamento).
Infra added to StaticPage: a **visible breadcrumb** (Início›Atendimento›page — Mark chose this over
JSON-LD-only, filling spec §3's "visual" half the plan had dropped) + a tracked `<WhatsAppLink>` CTA
rendered OUTSIDE the `dangerouslySetInnerHTML` article (so the Ads conversion actually fires). Home
`#tratamentos` cards now link to their pages; a footer link list covers all 9. Publish infra gained a
permanent `atendimento` section root (closes the SP0 orphan finding). Files: `manifest.json`+`content.ts`
(the 9 pages), `seo.ts`+`pages/faq.ts` (JSON-LD), `StaticPage.tsx`, `Footer.tsx`, `treatments.ts`+
`Tratamentos.tsx`, `generated-paths.mjs`+`publish.mjs`. 30/30 tests green.

**Why the review process earned its keep (the transferable part):** the per-task + whole-branch reviews
caught **3 separate `sozinhas`-class gender bugs** (a masculine adjective glued to "seu filho ou filha":
"extrovertido", "seguro", and a bare "filho autista") — each one slips in the same way, by a keyword or
adjective agreeing with the wrong noun, and each was invisible to the implementer's own self-check. They
also caught **~5 de-templating violations** (sibling pages sharing ≥12-word verbatim runs — intro
scaffolding, closers, cross-link tails); the intro-scaffolding one recurred enough to be a *systemic*
risk, so later dispatches + the final review ran explicit cross-page n-gram sweeps. Lesson banked: when
delegating pt-BR copy, the gendered-adjective-on-child and verbatim-sibling-reuse checks must be in every
reviewer prompt, not left to the writer. Also: **don't invite "optional polish" in a fix message** — one
such invite caused an implementer to add a "de forma duradoura" efficacy overclaim (a second fix round);
keep fix instructions surgical.

**Verified safe before + after deploy:** revenue constants all intact (gtag `AW-16583121961`+conversion
label, Formspree `xeevlzlb`, n8n webhook, `.nojekyll`, CNAME=apex, apex canonical); forbidden-term sweep
clean across the 9 pages (0 `psicólog`/`depressão`/`trauma`); credential is always psicanalista/terapeuta;
the boundary pages disclaim testes/diagnóstico/laudo/plano. **Gemini adversarial gate CLEARED** (ran
`gemini-review` on all 9 page bodies with the full pt-BR/gender/claim-boundary rubric → "ALL CLEAN" —
the required sprint-completion gate, converging with the internal review chain). Claims are LOCKED; the
page **copy is a draft for Karoline's tone pass** (deferred-minors list in SESSION-STATE).

**Next:** Karoline tone-checks the 9 drafts; then SP4 (authority, BLOCKED on real credentials) or SP5
(blog engine + the deferred blog-body reframe). Housekeeping still pending: notes.md spans >3 sessions —
archive pre-2026-08-07 entries to `docs/notes-archive.md` at the next wrap-up.
