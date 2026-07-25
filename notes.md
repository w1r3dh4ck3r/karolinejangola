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
- **Remove health-plan reimbursement claim** (`app/src/data/faq.ts:21`): the "Você atende por plano de saúde?" answer says she emits a recibo for plano-de-saúde reembolso — Mark wants that clause GONE. Delete the `Porém, emito recibo … caso ele ofereça essa possibilidade.` sentence; keep only `Atualmente atendo apenas de forma particular.` Then rebuild+publish+push.
- Treatments copy — Mark rewrites himself (the 5 cards still have adult framing incl. "Relacionamentos"; only the one `pré-adolescentes` word was swapped).
- Swap the two adult-women testimonials (Ana Carolina, Lívia) — kept for now.
- Female-grammar decision: some copy still addresses a female reader (hero H1 "Você não precisa carregar tudo **sozinha**"); now that the reader is a parent, decide keep-as-mothers vs neutral. `CLAUDE.md` female-grammar rule left untouched pending this.
- **www TLS:** Mark DID the Pages custom-domain re-save + enabled Enforce HTTPS (2026-07-25 ~18:20). As of then, Pages cert state = `dns_changed` (GitHub re-provisioning); cert still lists apex only, `www` still serves the `*.github.io` fallback (https 000). GitHub cert provisioning is async (minutes–24h) — **re-check `www` later**: `echo | openssl s_client -servername www.karolinejangola.com -connect www.karolinejangola.com:443 | openssl x509 -noout -subject` should show `CN = www.karolinejangola.com` (or apex SAN incl. www). If it's still fallback after ~24h, remove/re-add the custom domain again. Apex (`https://karolinejangola.com`) is valid + safe throughout. DNS is correct (apex→Pages IPs, www→w1r3dh4ck3r.github.io). Optional later: flip to www-primary (`CNAME` + `publish.mjs` guard → `www.karolinejangola.com`) once www's cert is live.
- `docs/reference/current-site-inventory.md` is a point-in-time capture of the ORIGINAL site — its "mulheres e crianças" positioning is pre-repositioning history, noted at its top.
