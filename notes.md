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
