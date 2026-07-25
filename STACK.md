# Stack

## Core

| Layer | Technology |
|-------|------------|
| Framework | React 18 |
| Build | Vite 5 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 (design tokens as CSS custom properties) |
| Routing | React Router 6 |
| Prerender/SEO | Playwright (build-time static snapshot of all routes) |
| Test | Vitest |
| Hosting | GitHub Pages (serves the repo root; custom domain via `CNAME`) |

## Design

- **Fonts:** DM Serif Display (headings) + DM Sans (body), via Google Fonts `@import`.
- **Palette:** sage `#4f7260`, terracotta `#c97a5e`, cream `#f8f5f1`, warm-dark text `#3e3531` (full token table in `docs/reference/current-site-inventory.md` §4).

## Notes

- Source lives in `app/`; the repo root holds the **generated** build output that GitHub Pages serves.
- `npm run build` requires chromium: `npx playwright install chromium` (once per machine/CI).
- Node 24 / npm 11 verified.
