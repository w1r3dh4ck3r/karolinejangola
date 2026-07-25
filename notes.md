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

**Next steps:**
- Nothing pushed — merged to `main` locally on 2026-07-25; awaiting Mark's push approval to deploy.
- Pending: the 3 content changes Mark originally asked for (deferred to a follow-up sprint): (1) revisit the ISO 9001 mentions, (2) remove the "Para mim / Para meu filho" audience split, (3) add "atendimento para brasileiros que vivem no exterior".
- www TLS cert fix (DNS/GitHub Pages) — see the DNS section handed to Mark.
