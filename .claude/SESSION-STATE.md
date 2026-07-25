# SESSION-STATE

## Current Task
Source reconstruction COMPLETE. Repo had only the compiled build; rebuilt clean React 18 + Vite + TS + Tailwind source under `app/` that reproduces the live site. Merged to `main` locally on 2026-07-25; NOT pushed.

## Key facts
- Source: `app/src/`. Build `cd app && npm run build` → `app/dist/`; `npm run publish:site` → repo root (served by GitHub Pages). Needs `npx playwright install chromium` for the prerender.
- Ground truth = the live bundle, captured in `docs/reference/current-site-inventory.md`. The old `404.html`/blog prerenders were stale.
- Live fonts/colors: DM Serif Display + DM Sans, sage `#4f7260` / terracotta `#c97a5e` / cream `#f8f5f1`.
- Deploy = `git push` of `main` (GitHub Pages serves root). Pushing = live. Site runs Google Ads.

## Last Action
Updated stale docs (ARCHITECTURE/STACK/WORKFLOW/CLAUDE.md) + notes.md; merged reconstruct-source → main locally.

## Next Step
Await Mark's push approval to deploy. Then the deferred content changes: (1) ISO 9001 text, (2) remove audience split (Para mim / Para meu filho), (3) add "brasileiros no exterior" copy.

## Files to touch next (for the deferred content changes)
- `app/src/data/content.ts` (audience split cards, ISO text in sobre paragraphs + stat tile, contact/footer "atendimento" line)
- `app/src/sections/ParaQuem.tsx` (remove/adjust the audience-split section), `app/src/sections/Sobre.tsx` (ISO stat tile)
- `app/src/data/seo.ts` if the "no exterior" scope changes areaServed/description
- After edits: `cd app && npm run build && npm run publish:site`
