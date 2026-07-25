# Workflow

## Prerequisites (once per machine)

```bash
cd ~/AI/projects/karolinejangola/app
npm install
npx playwright install chromium   # required by the prerender build step
```

## Edit → build → publish

1. **Edit source** under `app/src/`. Copy and config live as typed data in `app/src/data/` — most content changes are one line there:
   - `content.ts` (section copy), `treatments.ts`, `testimonials.ts`, `faq.ts`, `data/blog/*` (articles), `site.ts` (phone, email, endpoints), `seo.ts` (per-page head + JSON-LD).
2. **Preview** while editing: `cd app && npm run dev`.
3. **Build**: `cd app && npm run build` (tsc → vite → Playwright prerender of all routes; regenerates `sitemap.xml`). Blog routes are derived automatically from the `/blog` page, so a new post in `app/src/data/blog/` is prerendered + added to the sitemap with no extra step.
4. **Publish to the served root**: `npm run publish:site` (copies `app/dist/` → repo root; asserts `CNAME`).
5. **Verify**: check the rebuilt root in a browser; confirm tracking/SEO if you touched `lib/` or `seo.ts`.

## Deploy

Deploy is a `git push` of `main` — GitHub Pages serves the repo root, so **pushing `main` publishes live** (the site runs Google Ads; treat pushes as production releases). Merge to `main`, then push only when ready.

## Test

`cd app && npm run test` (Vitest — pins the WhatsApp conversion URLs to their exact live values).

## Notes

- The repo-root `index.html`/`assets/`/`blog/**`/`sitemap.xml`/`404.html` are **generated** — never hand-edit them; change the source and rebuild.
- Ground truth for the original site is captured in `docs/reference/current-site-inventory.md`.
