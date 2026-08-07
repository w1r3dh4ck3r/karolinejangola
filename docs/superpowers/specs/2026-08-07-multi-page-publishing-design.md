# SP0 — Multi-page publishing capability

**Date:** 2026-08-07
**Status:** Design approved (Mark), pending spec review
**Sub-project of:** the children-&-adolescents SEO program (SP0–SP8; see notes.md handoff)

## Why this is SP0 (first, blocking)

The site's SEO program calls for a large set of new pages (service pages, an
authority page, etc.). The current build/deploy pipeline can only ship three
kinds of route as real HTML for crawlers:

- `/` → `dist/index.html` (+ `404.html`)
- `/blog` → `dist/blog/index.html`
- `/blog/:slug` → `dist/blog/<slug>/index.html`

Everything else resolves to the SPA shell (`<div id="root">`) via the server's
extensionless-path fallback. A new route added to the React router **renders
client-side but ships to Google as an empty div** — invisible, while looking
finished. Verified directly in source (2026-08-07):

- `app/src/App.tsx` — router has exactly 4 routes (`/`, `/blog`, `/blog/:slug`, `*`).
- `app/scripts/prerender.mjs` — `staticRoutes` hardcodes only `/` and `/blog`;
  per-post routes are derived by scraping the rendered `/blog` DOM for
  `/blog/<slug>` anchors; `buildSitemapEntries()` emits only `/`, `/blog`, and
  blog posts.
- `app/scripts/publish.mjs` — `GENERATED_PATHS` =
  `['assets','index.html','404.html','blog','sitemap.xml','placeholder.svg']`.
  A new top-level output dir (e.g. `tratamentos/`) would be **copied** into the
  served root but **never cleaned** on republish, so a renamed or deleted page
  would orphan a stale file live at the apex indefinitely.

SP0 turns "add a page and it reaches Google" into a real, **live-verified**
capability. Per the standing rule *don't build on an unverified instrument*, no
content page is built until this capability is proven with a throwaway page.

## Scope

**In scope:** the generic static-page publishing mechanism, proven end-to-end
with a single throwaway page, then torn down.

**Out of scope:** the actual page set, URL taxonomy, and copy (that is SP2/SP3);
blog changes (its pipeline already works and is untouched).

## Architecture — a manifest as the single source of truth

Author a page once in a TS manifest; the router, the prerenderer, the sitemap,
and the publish-cleanup all derive from it. No hardcoded route lists in the
scripts, no DOM-scraping.

### 1. Page manifest (`app/src/data/pages/index.ts`)

A TS array mirroring the existing `blog/index.ts` data pattern. Each entry
declares:

- `path` — the route/URL path (e.g. `/tratamentos/terapia-infantil`, `/como-funciona`).
- `outputDir` — the `dist/`-relative dir the prerendered HTML is written to
  (e.g. `tratamentos/terapia-infantil`), producing `<outputDir>/index.html`.
- `sectionRoot` — the top-level served-root dir the page lives under
  (e.g. `tratamentos`), or the page's own top-level file for standalone pages.
  Used to compute the publish-cleanup set (see §4).
- SEO fields: `title`, `description`, `canonical` (built from `SITE_URL`, apex).
- Enough content fields for the page component to render a real `<h1>` + body
  (kept minimal for SP0; SP3 defines the real content shape).

`canonical` derives from `SITE_URL` in `seo.ts` (already apex, `karolinejangola.com`)
so every new page inherits the correct apex host — no repeat of the
canonical-pointed-at-broken-www bug.

### 2. Router (`app/src/App.tsx`)

Add manifest-driven routes alongside the existing four. Each manifest entry maps
to a `<Route>` rendering a generic `StaticPage` component (mirrors `BlogPost.tsx`:
look the page up by path, render `<Seo>` + `<Nav>` + content + `<Footer>`, fall
back to `<NotFound>` on miss). Existing `/`, `/blog`, `/blog/:slug`, `*` routes
unchanged.

### 3. Node-readable manifest — SUPERSEDED BY THE PLAN

> **Superseded (2026-08-07):** this section proposed a build step emitting
> `dist/pages-manifest.json` from a TS manifest. The plan
> (`docs/superpowers/plans/2026-08-07-sp0-multi-page-publishing.md`) simplified
> this to its intended end: the manifest **is** a plain
> `app/src/data/pages/manifest.json`, imported by the app (typed via a cast) and
> read directly off disk by `prerender.mjs`/`publish.mjs` with `fs`. No emit
> step, no transpile, and it survives an empty (`[]`) manifest. This is what
> shipped. The design contract below (one source of truth, no DOM-scraping) is
> unchanged; only the mechanism is simpler. Read the plan for the built design.

### 4. prerender.mjs

- Read `dist/pages-manifest.json` after the existing `/` and `/blog` snapshots.
- For each manifest page: `renderPage(browser, page.path)` (wait for the
  `link[rel="canonical"][data-seo-managed]` marker, same as blog posts — these
  pages carry no JSON-LD, so no JSON-LD wait), then
  `writeSnapshot(['<outputDir>/index.html'], html)`.
- Extend `buildSitemapEntries()` to append one `<url>` per manifest page
  (apex `loc` from `canonical`; `changefreq: 'monthly'`, `priority: '0.8'` for
  service/top pages — final priorities are an SP2 concern, a sane default here).
- Keep the existing "refuse to publish an empty blog" guard. Add an analogous
  guard only if the manifest is expected non-empty; for SP0 the manifest has the
  one smoke page.

### 5. publish.mjs

Preserve the safety model (fixed allowlist deletion; hard denylist; never
"delete everything except"). Extend the **generated set** to include each
manifest page's `sectionRoot`, read from `dist/pages-manifest.json`:

- Compute `generatedPaths = GENERATED_PATHS ∪ { every sectionRoot in the manifest }`.
- Guard every added path against `isDenylisted()` exactly as the existing loop
  does (a `sectionRoot` colliding with `docs`/`app`/`.git`/`CNAME`/a dotfile
  must still throw, not delete).
- This makes republish clean orphaned page dirs. Standalone top-level pages
  (their own `index.html`-style output) register their file/dir as `sectionRoot`
  so they, too, are cleaned.

`CNAME`, `robots.txt`, `.nojekyll`, and the CNAME post-publish safety check are
untouched.

## Data flow

```
pages/index.ts (TS manifest)
   │  authored once
   ├─► App.tsx routes ──────────────► client-side rendering
   └─► emit-pages-manifest ─► dist/pages-manifest.json
                                   │
                                   ├─► prerender.mjs ─► dist/<outputDir>/index.html + sitemap.xml entries
                                   └─► publish.mjs   ─► cleanup set includes each sectionRoot
                                                        dist/** copied to repo root ─► GitHub Pages ─► live
```

## Definition of done (live-verified, per "unverified instrument" rule)

1. A throwaway page (`path: '/_smoke'`, `outputDir: '_smoke'`, `sectionRoot: '_smoke'`,
   trivial `<h1>` carrying the unique sentinel string `SP0-SMOKE-SENTINEL`) is
   registered in the manifest.
2. `cd app && npm run build && npm run publish:site` succeeds; `dist/_smoke/index.html`
   exists and contains the sentinel + the correct apex canonical; `sitemap.xml`
   contains `https://karolinejangola.com/_smoke`.
3. Pushed via `approved-push main`; Pages build reaches `built`.
4. **Live check:** `curl -s https://karolinejangola.com/_smoke/` returns HTML
   containing the sentinel `<h1>` and `<link rel="canonical" href="https://karolinejangola.com/_smoke">`
   — NOT the bare `<div id="root">` shell. `curl -s https://karolinejangola.com/sitemap.xml`
   lists the `/_smoke` URL.
5. **Teardown:** remove `/_smoke` from the manifest; rebuild, publish, push;
   verify `curl` of `/_smoke/` no longer serves it (404/SPA fallback) **and** the
   served-root `_smoke/` dir is gone (proves publish-cleanup works), and the
   sitemap no longer lists it.

Only when step 4 passes is the capability proven; step 5 proves cleanup. SP2/SP3
then build real pages on this mechanism.

## Invariants preserved (revenue / deploy-critical)

- gtag `AW-16583121961` + conversion `AW-16583121961/shGzCIOqipYcEKm4ueM9`,
  Formspree `f/xeevlzlb`, n8n `n8n.w1r3d.dev/webhook/visitor` — verbatim, untouched.
- `.nojekyll` at root (and `app/public/.nojekyll`) — untouched; Jekyll stays off.
- `CNAME` = `karolinejangola.com`; the `publish.mjs` CNAME safety check — untouched.
- Canonical/SITE_URL host = apex (`karolinejangola.com`) — new pages inherit it.
- No change to the `/blog` pipeline, the router's existing 4 routes, or `Seo.tsx`.

## Verification commands (outside the LLM)

```
cd app && npm run build                                              # exit 0; logs "wrote dist/_smoke/index.html"
grep -q 'SP0-SMOKE-SENTINEL' dist/_smoke/index.html                  # prerendered content present
grep -q 'href="https://karolinejangola.com/_smoke"' dist/_smoke/index.html  # apex canonical
grep -q 'karolinejangola.com/_smoke' dist/sitemap.xml                # sitemap entry
npm run publish:site                                                 # exit 0; cleanup + copy
# after approved-push main + Pages build reaches "built":
curl -s https://karolinejangola.com/_smoke/ | grep -q 'SP0-SMOKE-SENTINEL'   # real HTML, not the SPA shell
curl -s https://karolinejangola.com/sitemap.xml | grep -q '_smoke'
# teardown: remove /_smoke from manifest, rebuild+publish+push, then:
curl -s https://karolinejangola.com/_smoke/ | grep -qv 'SP0-SMOKE-SENTINEL'  # gone; publish-cleanup removed the dir
```
