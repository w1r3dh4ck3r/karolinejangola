# SESSION-STATE

## Current Task
DONE: (1) source reconstruction, (2) the 3 content changes, (3) audience reposition sweep (women+children → children & adolescents only, no women). All on local `main`, **NOT pushed**.

## Key facts
- Source: `app/src/`. Build `cd app && npm run build` → `app/dist/`; `npm run publish:site` → repo root (served by GitHub Pages). Needs `npx playwright install chromium` for the prerender.
- Ground truth = the live bundle, captured in `docs/reference/current-site-inventory.md`.
- Live fonts/colors: DM Serif Display + DM Sans, sage `#4f7260` / terracotta `#c97a5e` / cream `#f8f5f1`.
- Deploy = `git push` of `main` (GitHub Pages serves root). Pushing = LIVE. Site runs Google Ads.
- `app/scripts/publish.mjs` copy-denylist blocked ALL dotfiles at repo root, which meant it threw on `.nojekyll` (added after the last successful publish) and left the root in a half-deleted state. Fixed by explicitly allowing `.nojekyll` through, same as the existing CNAME/robots.txt carve-out.

## Last Action
Audience reposition copy sweep: hero body, Sobre paragraph, Para-quem description (women clause removed), FAQ answer, one Treatments card word, 3x seo.ts descriptions, index.html meta/og/twitter descriptions, Sobre.tsx alt text, CLAUDE.md copy rule. Build + publish verified clean on served root (no "mulheres"/"pré-adolescentes" left, no regression to prior JSON-LD/Formspree/n8n/phone/exterior-reach content). Full report at `.superpowers/reposition-report.md`.

## Next Step
Awaiting Mark's decisions (nothing pushed):
1. **Push approval** to deploy `main` (use `approved-push main`).
2. **Canonical host** for the www TLS fix: www-primary (recommended — set `CNAME` to `www.karolinejangola.com`) vs apex-primary (change canonical in `seo.ts`). Immediate cert fix = re-save GitHub Pages custom domain (DNS already correct).

## Files to touch next (if apex-primary chosen, or future changes)
- `CNAME` (if www-primary) OR `app/src/data/seo.ts` canonical/og:url (if apex-primary)
- Content lives in `app/src/data/` (content.ts, treatments/testimonials/faq, blog/, site.ts, seo.ts)
- After edits: `cd app && npm run build && npm run publish:site`

<!-- session-state-sync: last written by session 1f22c527 at 2026-07-25 17:23:14 -0300 -->
