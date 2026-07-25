# SESSION-STATE

## Current Task
DONE: (1) source reconstruction (React 18 + Vite + TS + Tailwind under `app/`, reproduces the live site) and (2) the 3 content changes. All on local `main`, **NOT pushed**.

## Key facts
- Source: `app/src/`. Build `cd app && npm run build` → `app/dist/`; `npm run publish:site` → repo root (served by GitHub Pages). Needs `npx playwright install chromium` for the prerender.
- Ground truth = the live bundle, captured in `docs/reference/current-site-inventory.md`.
- Live fonts/colors: DM Serif Display + DM Sans, sage `#4f7260` / terracotta `#c97a5e` / cream `#f8f5f1`.
- Deploy = `git push` of `main` (GitHub Pages serves root). Pushing = LIVE. Site runs Google Ads.

## Last Action
Content changes done + reviewed (unified para-quem CTA, ISO 9001 removed, reach extended to Brazilians abroad). Source/served output consistent.

## Next Step
Awaiting Mark's decisions (nothing pushed):
1. **Push approval** to deploy `main` (use `approved-push main`).
2. **Canonical host** for the www TLS fix: www-primary (recommended — set `CNAME` to `www.karolinejangola.com`) vs apex-primary (change canonical in `seo.ts`). Immediate cert fix = re-save GitHub Pages custom domain (DNS already correct).

## Files to touch next (if apex-primary chosen, or future changes)
- `CNAME` (if www-primary) OR `app/src/data/seo.ts` canonical/og:url (if apex-primary)
- Content lives in `app/src/data/` (content.ts, treatments/testimonials/faq, blog/, site.ts, seo.ts)
- After edits: `cd app && npm run build && npm run publish:site`
