# SESSION-STATE

## Current Task
DONE + LIVE: source reconstruction (React 18 + Vite + TS + Tailwind under `app/`), the 3 content changes, and the children-&-adolescents repositioning (no women). All pushed to `origin/main` and deployed on karolinejangola.com.

## Key facts
- Source `app/src/`; content in `app/src/data/`. Build `cd app && npm run build` → `app/dist/`; `npm run publish:site` → repo root (GitHub Pages serves root). Needs `npx playwright install chromium`.
- **Keep `.nojekyll` at root forever** — GitHub Pages runs Jekyll otherwise and fails on `{{ }}` in docs. `publish.mjs` has a `.nojekyll` copy carve-out (its dotfile denylist otherwise half-deletes root).
- Deploy = `git push` of `main` = LIVE. Site runs Google Ads. If a push doesn't go live, check `gh api repos/w1r3dh4ck3r/karolinejangola/pages` status; POST `.../pages/builds` to force.
- Positioning is now **children & adolescents only** (no women). Fonts DM Serif Display/DM Sans; sage/terracotta.

## Last Action
Repositioned copy (mulheres e crianças → crianças e adolescentes site-wide), pushed, live-verified. Wrap-up committed + pushed.

## Next Step (all Mark's; none blocking)
- **NEXT SESSION — remove the health-plan reimbursement claim.** `app/src/data/faq.ts:21` ("Você atende por plano de saúde?" answer) currently says: `Atualmente atendo apenas de forma particular. Porém, emito recibo para que você possa solicitar reembolso ao seu plano de saúde, caso ele ofereça essa possibilidade.` → DELETE the second sentence (the `Porém, emito recibo … essa possibilidade.` clause about emitting a recibo/comprovante for reembolso), keeping only `Atualmente atendo apenas de forma particular.`. Then rebuild + publish + push.
- Mark rewrites the 5 treatments cards; swap the 2 adult-women testimonials (Ana Carolina, Lívia).
- Female-grammar call: hero H1 "…sozinha" still female-addressed; decide mothers vs neutral parent. `CLAUDE.md` female-grammar rule left pending.
- www TLS: Mark DID the Pages re-save + Enforce HTTPS (~18:20); cert state `dns_changed`, provisioning (async, up to 24h). Re-check www cert later; if still `*.github.io` fallback after ~24h, remove/re-add custom domain again. Apex is valid/safe throughout. Optional later: flip to www-primary (CNAME + publish guard).

## Files to touch next
- Health-plan reimbursement removal: `app/src/data/faq.ts` (line ~21).
- Treatments: `app/src/data/treatments.ts` (+ `Tratamentos.tsx` if layout). Testimonials: `app/src/data/testimonials.ts`.
- www flip: `CNAME`, `app/public/CNAME`, `app/scripts/publish.mjs` guard, `app/src/data/seo.ts` canonical if needed.
- After edits: `cd app && npm run build && npm run publish:site`, then `approved-push main`.

<!-- session-state-sync: last written by session 1f22c527 at 2026-07-25 18:40:13 -0300 -->
