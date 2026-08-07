# SP0 — Multi-page Publishing Capability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make "register a page and it reaches Google as real prerendered HTML with an apex canonical + sitemap entry" a working, live-verified capability, proven with a throwaway `/_smoke` page and then torn down.

**Architecture:** A plain `app/src/data/pages/manifest.json` is the single source of truth for page routing metadata. The React app imports it (typed via a `PageMeta` cast) to generate routes and per-page `<Seo>`; the two Node build scripts (`prerender.mjs`, `publish.mjs`) read the same JSON off disk with `fs`. No hardcoded route lists, no DOM-scraping, and the scripts tolerate an empty manifest.

**Tech Stack:** React 18 + React Router 6, Vite 5, TypeScript 5.6 (`tsc -b`), Playwright-driven prerender, Vitest (Node env, no jsdom installed — tests are pure-function only), plain Node ESM scripts.

## Global Constraints

- **Positioning:** children & adolescents only; reader addressed as the mother/guardian in **female Portuguese grammar**. (SP0 ships no user-visible copy beyond a throwaway sentinel, but the constraint stands for any page title/description authored here.)
- **Revenue/deploy constants — verbatim, never touched:** gtag `AW-16583121961`, conversion `AW-16583121961/shGzCIOqipYcEKm4ueM9`, Formspree `f/xeevlzlb`, n8n `n8n.w1r3d.dev/webhook/visitor`.
- **`.nojekyll`** stays at repo root and in `app/public/.nojekyll`. Jekyll must remain off.
- **`CNAME` = `karolinejangola.com`** (apex). The `publish.mjs` CNAME post-publish safety check is untouched.
- **Canonical host = apex.** `SITE_URL` in `app/src/data/seo.ts` is `https://karolinejangola.com`; every new page derives its canonical from it. No `www`.
- **Do not modify** the existing `/`, `/blog`, `/blog/:slug`, `*` routes; the blog prerender/sitemap path; or `app/src/components/Seo.tsx`.
- **Git:** work on branch `feat/sp0-multi-page-publishing` (create with a bare `git checkout -b` — gate-exempt). Per-task commits are local to that branch. The **only** push to `main` is the Task 7 live deploy, which requires Mark's explicit approval via `approved-push main`.
- **Build command:** `cd app && npm run build` (= `tsc -b && vite build && node scripts/prerender.mjs`). Prerender needs `npx playwright install chromium` once per machine.

---

### Task 1: Page manifest data model + seed smoke entry

**Files:**
- Create: `app/src/data/pages/types.ts`
- Create: `app/src/data/pages/manifest.json`
- Create: `app/src/data/pages/index.ts`
- Modify: `app/tsconfig.json` (add `resolveJsonModule`)
- Test: `app/src/data/pages/manifest.test.ts`

**Interfaces:**
- Produces: `PageMeta` interface `{ slug: string; path: string; outputDir: string; sectionRoot: string; title: string; description: string }`; `pages: PageMeta[]` (the manifest, typed). Both the app and — via the raw JSON file — the Node scripts consume these.

- [ ] **Step 1: Write the failing test**

`app/src/data/pages/manifest.test.ts`:
```ts
import { describe, expect, it } from 'vitest'
import { pages } from './index'

describe('pages manifest', () => {
  it('every entry has the required non-empty string fields', () => {
    for (const p of pages) {
      for (const key of ['slug', 'path', 'outputDir', 'sectionRoot', 'title', 'description'] as const) {
        expect(typeof p[key], `${p.slug}.${key}`).toBe('string')
        expect(p[key].length, `${p.slug}.${key}`).toBeGreaterThan(0)
      }
    }
  })

  it('path has a leading slash and sectionRoot is its first URL segment', () => {
    for (const p of pages) {
      expect(p.path.startsWith('/'), p.slug).toBe(true)
      expect(p.path.slice(1).split('/')[0], p.slug).toBe(p.sectionRoot)
    }
  })

  it('slugs and paths are unique', () => {
    expect(new Set(pages.map((p) => p.slug)).size).toBe(pages.length)
    expect(new Set(pages.map((p) => p.path)).size).toBe(pages.length)
  })

  it('seeds the SP0 smoke page', () => {
    expect(pages.some((p) => p.slug === '_smoke')).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && npx vitest run src/data/pages/manifest.test.ts`
Expected: FAIL — cannot resolve `./index`.

- [ ] **Step 3: Create the data model**

`app/src/data/pages/types.ts`:
```ts
export interface PageMeta {
  /** Stable key, also used to look up page content. */
  slug: string
  /** Route + URL path, leading slash. e.g. '/_smoke', '/tratamentos/terapia-infantil'. */
  path: string
  /** dist-relative output dir for the prerendered snapshot -> `<outputDir>/index.html`. */
  outputDir: string
  /** Top-level served-root dir publish.mjs must clean on republish (path's first segment). */
  sectionRoot: string
  /** Page <title> (brand suffix appended by staticPageSeo). */
  title: string
  /** Meta description. */
  description: string
}
```

`app/src/data/pages/manifest.json`:
```json
[
  {
    "slug": "_smoke",
    "path": "/_smoke",
    "outputDir": "_smoke",
    "sectionRoot": "_smoke",
    "title": "Smoke SP0",
    "description": "SP0 capability smoke page — temporary, removed after verification."
  }
]
```

`app/src/data/pages/index.ts`:
```ts
import type { PageMeta } from './types'
import manifestRaw from './manifest.json'

// Cast keeps the type stable even when manifest.json is `[]` (post-teardown),
// where resolveJsonModule would otherwise infer `never[]`.
export const pages: PageMeta[] = manifestRaw as PageMeta[]
```

- [ ] **Step 4: Enable JSON imports for `tsc -b`**

In `app/tsconfig.json`, add `"resolveJsonModule": true` inside `compilerOptions` (e.g. directly after the `"jsx": "react-jsx",` line):
```json
    "jsx": "react-jsx",
    "resolveJsonModule": true,
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd app && npx vitest run src/data/pages/manifest.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 6: Verify the type-checker accepts the JSON import**

Run: `cd app && npx tsc -b`
Expected: exit 0, no errors.

- [ ] **Step 7: Commit**

```bash
git add app/src/data/pages/types.ts app/src/data/pages/manifest.json app/src/data/pages/index.ts app/tsconfig.json app/src/data/pages/manifest.test.ts
git commit -m "feat(sp0): page manifest data model + seed smoke entry"
```

---

### Task 2: Page content map

**Files:**
- Create: `app/src/data/pages/content.ts`
- Test: `app/src/data/pages/content.test.ts`

**Interfaces:**
- Consumes: `pages` from `./index` (Task 1).
- Produces: `pagesContent: Record<string, string>` — slug → inner HTML for the page body. SP3 expands it; SP0 seeds only `_smoke`.

- [ ] **Step 1: Write the failing test**

`app/src/data/pages/content.test.ts`:
```ts
import { describe, expect, it } from 'vitest'
import { pages } from './index'
import { pagesContent } from './content'

describe('pagesContent', () => {
  it('has a content entry for every manifest page', () => {
    for (const p of pages) {
      expect(pagesContent[p.slug], p.slug).toBeTruthy()
    }
  })

  it('smoke page carries the SP0 sentinel', () => {
    expect(pagesContent['_smoke']).toContain('SP0-SMOKE-SENTINEL')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && npx vitest run src/data/pages/content.test.ts`
Expected: FAIL — cannot resolve `./content`.

- [ ] **Step 3: Create the content map**

`app/src/data/pages/content.ts`:
```ts
// slug -> inner HTML rendered inside StaticPage's <article>. Kept minimal for
// SP0 (capability proof); SP3 replaces the smoke entry with real page bodies.
export const pagesContent: Record<string, string> = {
  _smoke: '<p>SP0-SMOKE-SENTINEL</p>',
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd app && npx vitest run src/data/pages/content.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add app/src/data/pages/content.ts app/src/data/pages/content.test.ts
git commit -m "feat(sp0): page content map with smoke sentinel"
```

---

### Task 3: `staticPageSeo` helper

**Files:**
- Modify: `app/src/data/seo.ts` (add helper; import `PageMeta`)
- Test: `app/src/data/seo.test.ts`

**Interfaces:**
- Consumes: `SITE_URL`, `OG_IMAGE` (module-private, already in `seo.ts`), `SeoProps` (from `../components/Seo`), `PageMeta` (Task 1).
- Produces: `staticPageSeo(page: PageMeta): SeoProps` — title `"<page.title> | Karoline Jangola"`, description `page.description`, canonical `` `${SITE_URL}${page.path}` `` (apex), `og.image = OG_IMAGE`.

- [ ] **Step 1: Write the failing test**

`app/src/data/seo.test.ts`:
```ts
import { describe, expect, it } from 'vitest'
import { staticPageSeo } from './seo'
import type { PageMeta } from './pages/types'

const page: PageMeta = {
  slug: 'x',
  path: '/tratamentos/x',
  outputDir: 'tratamentos/x',
  sectionRoot: 'tratamentos',
  title: 'Terapia X',
  description: 'Desc X',
}

describe('staticPageSeo', () => {
  it('builds an apex canonical from the page path', () => {
    expect(staticPageSeo(page).canonical).toBe('https://karolinejangola.com/tratamentos/x')
  })

  it('suffixes the brand onto the title and passes the description through', () => {
    const seo = staticPageSeo(page)
    expect(seo.title).toBe('Terapia X | Karoline Jangola')
    expect(seo.description).toBe('Desc X')
  })

  it('never emits a www host', () => {
    expect(staticPageSeo(page).canonical).not.toContain('www.')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && npx vitest run src/data/seo.test.ts`
Expected: FAIL — `staticPageSeo` is not exported.

- [ ] **Step 3: Add the helper**

In `app/src/data/seo.ts`, add the import near the top (with the other type imports):
```ts
import type { PageMeta } from './pages/types'
```
and append at the end of the file:
```ts
/** Static manifest page (`/tratamentos/*`, `/como-funciona`, …) — canonical
 *  derives from SITE_URL (apex) so every page inherits the working host. */
export function staticPageSeo(page: PageMeta): SeoProps {
  return {
    title: `${page.title} | Karoline Jangola`,
    description: page.description,
    canonical: `${SITE_URL}${page.path}`,
    og: { image: OG_IMAGE },
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd app && npx vitest run src/data/seo.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add app/src/data/seo.ts app/src/data/seo.test.ts
git commit -m "feat(sp0): staticPageSeo helper (apex canonical)"
```

---

### Task 4: `StaticPage` component + manifest-driven router

**Files:**
- Create: `app/src/components/StaticPage.tsx`
- Modify: `app/src/App.tsx`

**Interfaces:**
- Consumes: `pages` (Task 1), `pagesContent` (Task 2), `staticPageSeo` (Task 3), existing `Nav`, `Footer`, `Seo`, `NotFound`.
- Produces: `<StaticPage slug={string} />`; one `<Route>` per manifest entry in `App.tsx`.

No unit test — this task's deliverable is verified by the build passing (below) and, end-to-end, by Task 7's live check. jsdom is not installed and adding it just to assert a route renders is out of scope (YAGNI).

- [ ] **Step 1: Create the component**

`app/src/components/StaticPage.tsx` (classes mirror `pages/BlogPost.tsx`):
```tsx
import Footer from './Footer'
import Nav from './Nav'
import Seo from './Seo'
import NotFound from '../pages/NotFound'
import { pages } from '../data/pages'
import { pagesContent } from '../data/pages/content'
import { staticPageSeo } from '../data/seo'

export default function StaticPage({ slug }: { slug: string }) {
  const page = pages.find((p) => p.slug === slug)
  if (!page) return <NotFound />

  return (
    <>
      <Seo {...staticPageSeo(page)} />
      <Nav />
      <main className="min-h-screen bg-background pb-20 pt-24">
        <div className="container mx-auto max-w-3xl px-6 md:px-12">
          <h1 className="mb-8 font-serif text-3xl leading-tight text-foreground md:text-4xl">
            {page.title}
          </h1>
          <article
            className="prose-blog"
            dangerouslySetInnerHTML={{ __html: pagesContent[slug] ?? '' }}
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Wire the routes**

In `app/src/App.tsx`, add two imports:
```tsx
import StaticPage from './components/StaticPage'
import { pages } from './data/pages'
```
and inside `<Routes>`, between the `/blog/:slug` route and the `*` route, insert:
```tsx
        {pages.map((p) => (
          <Route key={p.slug} path={p.path} element={<StaticPage slug={p.slug} />} />
        ))}
```

- [ ] **Step 3: Verify type-check + build pass**

Run: `cd app && npx tsc -b && npx vite build`
Expected: exit 0. (`vite build` alone here — prerender is exercised in Task 5.)

- [ ] **Step 4: Verify the existing suite still passes**

Run: `cd app && npx vitest run`
Expected: PASS — the reconstruction's existing tests plus Tasks 1–3.

- [ ] **Step 5: Commit**

```bash
git add app/src/components/StaticPage.tsx app/src/App.tsx
git commit -m "feat(sp0): StaticPage component + manifest-driven routes"
```

---

### Task 5: Prerender enumerates manifest pages + sitemap

**Files:**
- Create: `app/scripts/lib/sitemap.mjs` (extract the sitemap-entry builder so it is unit-testable)
- Modify: `app/scripts/prerender.mjs`
- Test: `app/scripts/lib/sitemap.test.mjs`

**Interfaces:**
- Produces: `buildSitemapEntries(postSlugs: string[], pages: PageMeta[]): { loc, changefreq, priority }[]` — the existing `/` + `/blog` + blog-post entries, plus one entry per manifest page (`loc = SITE_URL + page.path`, `changefreq: 'monthly'`, `priority: '0.8'`).
- Consumes (in prerender): the manifest read from `../src/data/pages/manifest.json` via `fs`.

- [ ] **Step 1: Write the failing test**

`app/scripts/lib/sitemap.test.mjs`:
```js
import { describe, expect, it } from 'vitest'
import { buildSitemapEntries } from './sitemap.mjs'

const SITE_URL = 'https://karolinejangola.com'

describe('buildSitemapEntries', () => {
  it('always emits home and blog index', () => {
    const locs = buildSitemapEntries([], []).map((e) => e.loc)
    expect(locs).toContain(`${SITE_URL}/`)
    expect(locs).toContain(`${SITE_URL}/blog`)
  })

  it('emits one apex entry per manifest page', () => {
    const pages = [{ path: '/_smoke' }, { path: '/tratamentos/x' }]
    const locs = buildSitemapEntries([], pages).map((e) => e.loc)
    expect(locs).toContain(`${SITE_URL}/_smoke`)
    expect(locs).toContain(`${SITE_URL}/tratamentos/x`)
  })

  it('still emits blog-post entries', () => {
    const locs = buildSitemapEntries(['my-post'], []).map((e) => e.loc)
    expect(locs).toContain(`${SITE_URL}/blog/my-post`)
  })

  it('handles an empty manifest without adding page entries', () => {
    const entries = buildSitemapEntries([], [])
    expect(entries.every((e) => !e.loc.includes('_smoke'))).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && npx vitest run scripts/lib/sitemap.test.mjs`
Expected: FAIL — cannot resolve `./sitemap.mjs`.

- [ ] **Step 3: Extract the builder into `sitemap.mjs`**

`app/scripts/lib/sitemap.mjs`:
```js
// Single source of the sitemap URL set, extracted from prerender.mjs so it is
// unit-testable. SITE_URL is duplicated here (prerender.mjs has its own const);
// keep both as 'https://karolinejangola.com'.
const SITE_URL = 'https://karolinejangola.com'

export function buildSitemapEntries(postSlugs, pages) {
  return [
    { loc: `${SITE_URL}/`, changefreq: 'monthly', priority: '1.0' },
    { loc: `${SITE_URL}/blog`, changefreq: 'weekly', priority: '0.8' },
    ...postSlugs.map((slug) => ({
      loc: `${SITE_URL}/blog/${slug}`,
      changefreq: 'monthly',
      priority: '0.7',
    })),
    ...pages.map((pg) => ({
      loc: `${SITE_URL}${pg.path}`,
      changefreq: 'monthly',
      priority: '0.8',
    })),
  ]
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd app && npx vitest run scripts/lib/sitemap.test.mjs`
Expected: PASS (4 tests).

- [ ] **Step 5: Wire prerender.mjs to the manifest + the extracted builder**

In `app/scripts/prerender.mjs`:

1. Remove the local `buildSitemapEntries` function (lines defining it) and import the extracted one — add near the top imports:
```js
import { buildSitemapEntries } from './lib/sitemap.mjs'
```

2. Add a manifest read helper (after the `staticRoutes` const):
```js
// Manifest pages are read straight off disk (this is a Node script; it can't
// import the Vite-built TS). Same file the app imports — single source of truth.
function readManifestPages() {
  const manifestPath = path.join(__dirname, '..', 'src', 'data', 'pages', 'manifest.json')
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
}
```

3. `manifestPages` must be visible to the `writeSitemap(...)` call that runs **after** the `try/finally`. Add `let manifestPages = []` right next to the existing `let postSlugs = []` declaration (before the `try`). Then, inside the `try`, after the blog-post snapshot loop, **assign** it (no `const`/`let`) and add the snapshot loop:
```js
    manifestPages = readManifestPages()
    for (const pg of manifestPages) {
      const page = await renderPage(browser, pg.path)
      const html = '<!doctype html>\n' + (await page.content())
      writeSnapshot([`${pg.outputDir}/index.html`], html)
      await page.close()
    }
    console.log(`Prerendered ${manifestPages.length} manifest page(s).`)
```
   Note: this loop runs **inside** the existing `try { ... } finally { browser.close(); server.close() }` block, alongside the blog loops.

4. Change the final sitemap call from `writeSitemap(buildSitemapEntries(postSlugs))` to:
```js
  writeSitemap(buildSitemapEntries(postSlugs, manifestPages))
```

- [ ] **Step 6: Full build — smoke page snapshots + lands in sitemap**

Run: `cd app && npm run build`
Expected: exit 0; logs include `wrote dist/_smoke/index.html`.
Then:
```bash
grep -q 'SP0-SMOKE-SENTINEL' dist/_smoke/index.html && echo OK-body
grep -q 'href="https://karolinejangola.com/_smoke"' dist/_smoke/index.html && echo OK-canonical
grep -q 'karolinejangola.com/_smoke' dist/sitemap.xml && echo OK-sitemap
```
Expected: `OK-body`, `OK-canonical`, `OK-sitemap`. (If prerender errors on a missing Chromium, run `npx playwright install chromium` first.)

- [ ] **Step 7: Commit**

```bash
git add app/scripts/lib/sitemap.mjs app/scripts/lib/sitemap.test.mjs app/scripts/prerender.mjs
git commit -m "feat(sp0): prerender enumerates manifest pages + sitemap entries"
```

---

### Task 6: Publish cleans manifest section roots

**Files:**
- Create: `app/scripts/lib/generated-paths.mjs`
- Modify: `app/scripts/publish.mjs`
- Test: `app/scripts/lib/generated-paths.test.mjs`

**Interfaces:**
- Produces: `computeGeneratedPaths(baseGenerated: string[], pages: PageMeta[], isDenylisted: (name: string) => boolean): string[]` — the union of the base allowlist with each page's `sectionRoot`; **throws** if any `sectionRoot` is denylisted.
- Consumes (in publish): the manifest read via `fs`, and the existing `isDenylisted`.

- [ ] **Step 1: Write the failing test**

`app/scripts/lib/generated-paths.test.mjs`:
```js
import { describe, expect, it } from 'vitest'
import { computeGeneratedPaths } from './generated-paths.mjs'

const base = ['assets', 'index.html', 'blog', 'sitemap.xml']
// mirrors publish.mjs isDenylisted for the cases under test
const isDenylisted = (name) =>
  ['docs', 'app', '.git', 'CLAUDE.md'].includes(name) || name.startsWith('.')

describe('computeGeneratedPaths', () => {
  it('adds distinct sectionRoots to the base allowlist', () => {
    const out = computeGeneratedPaths(base, [{ sectionRoot: '_smoke' }, { sectionRoot: 'tratamentos' }], isDenylisted)
    expect(out).toContain('_smoke')
    expect(out).toContain('tratamentos')
    expect(out).toContain('assets')
  })

  it('deduplicates a sectionRoot shared by two pages', () => {
    const out = computeGeneratedPaths(base, [{ sectionRoot: 'tratamentos' }, { sectionRoot: 'tratamentos' }], isDenylisted)
    expect(out.filter((n) => n === 'tratamentos')).toHaveLength(1)
  })

  it('throws if a sectionRoot is denylisted', () => {
    expect(() => computeGeneratedPaths(base, [{ sectionRoot: 'docs' }], isDenylisted)).toThrow()
    expect(() => computeGeneratedPaths(base, [{ sectionRoot: '.git' }], isDenylisted)).toThrow()
  })

  it('returns the base unchanged for an empty manifest', () => {
    expect(computeGeneratedPaths(base, [], isDenylisted).sort()).toEqual([...base].sort())
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && npx vitest run scripts/lib/generated-paths.test.mjs`
Expected: FAIL — cannot resolve `./generated-paths.mjs`.

- [ ] **Step 3: Create the pure function**

`app/scripts/lib/generated-paths.mjs`:
```js
// Computes the set of root-level dirs publish.mjs is allowed to delete before
// copying dist/ over the root: the fixed base allowlist plus every manifest
// page's sectionRoot, so republishing cleans orphaned page dirs. Throws rather
// than ever deleting a denylisted path (docs/, app/, .git, CNAME, dotfiles, …).
export function computeGeneratedPaths(baseGenerated, pages, isDenylisted) {
  const set = new Set(baseGenerated)
  for (const pg of pages) {
    if (isDenylisted(pg.sectionRoot)) {
      throw new Error(`refusing to add denylisted sectionRoot to generated set: ${pg.sectionRoot}`)
    }
    set.add(pg.sectionRoot)
  }
  return [...set]
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd app && npx vitest run scripts/lib/generated-paths.test.mjs`
Expected: PASS (4 tests).

- [ ] **Step 5: Wire publish.mjs**

In `app/scripts/publish.mjs`:

1. Add imports near the top:
```js
import { computeGeneratedPaths } from './lib/generated-paths.mjs'
```

2. Inside `main()`, after the `distIndex` existence check and before "Step 2: remove the root generated set", read the manifest and compute the effective generated set:
```js
  const manifestPath = path.join(appDir, 'src', 'data', 'pages', 'manifest.json')
  const manifestPages = fs.existsSync(manifestPath)
    ? JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    : []
  const generatedPaths = computeGeneratedPaths(GENERATED_PATHS, manifestPages, isDenylisted)
```

3. Change the Step 2 deletion loop header from `for (const name of GENERATED_PATHS) {` to:
```js
  for (const name of generatedPaths) {
```
   (the loop body — including its own `isDenylisted` throw — is unchanged; the double-check is intentional defence in depth.)

- [ ] **Step 6: Verify publish removes the smoke dir on a clean republish**

Run:
```bash
cd app && npm run build && npm run publish:site
ls ../_smoke/index.html && grep -q 'SP0-SMOKE-SENTINEL' ../_smoke/index.html && echo OK-published
grep -q '_smoke' ../sitemap.xml && echo OK-sitemap-root
```
Expected: `OK-published`, `OK-sitemap-root` (the served root now carries `_smoke/` and the sitemap lists it). Confirm the publish log prints `_smoke` in the "removed generated path(s)" list on the second run (proving it is now in the cleanup allowlist).

- [ ] **Step 7: Commit**

```bash
git add app/scripts/lib/generated-paths.mjs app/scripts/lib/generated-paths.test.mjs app/scripts/publish.mjs
git commit -m "feat(sp0): publish cleans manifest section roots"
```

---

### Task 7: Local capability verification + teardown (DoD)

**Decision (Mark, 2026-08-07):** ship the capability only, verify **locally** — do NOT deploy a throwaway page to the live (Google Ads) production site. The `_smoke/index.html` serving mechanism is identical to the live blog posts (`/blog/<slug>/` → `blog/<slug>/index.html`), which already prove in production that GitHub Pages serves a `dir/index.html` as real HTML. So the only genuinely-remote unknown is already answered; local verification with a Pages-mimicking static server is sufficient.

**Files:**
- Modify: `app/src/data/pages/manifest.json` (remove the `_smoke` entry at teardown → `[]`)
- Modify: `app/src/data/pages/content.ts` (remove the `_smoke` content at teardown → `{}`)

- [ ] **Step 1: Clean build with `_smoke` still present**

Run: `cd app && npx vitest run && npm run build`
Expected: all tests PASS; build exit 0; `dist/_smoke/index.html` exists.

- [ ] **Step 2: Prove serving with a Pages-mimicking static server**

`python3 -m http.server` serves `dir/index.html` for a `/dir/` request — the same directory→index resolution GitHub Pages uses (and unlike prerender's own SPA-fallback server, which would wrongly return the root shell). Serve `dist/` and curl the smoke route:
```bash
cd app
python3 -m http.server 4320 --directory dist >/tmp/sp0-serve.log 2>&1 &
SRV=$!; sleep 1
curl -s http://localhost:4320/_smoke/ | grep -q 'SP0-SMOKE-SENTINEL' && echo SERVE-body
curl -s http://localhost:4320/_smoke/ | grep -q 'href="https://karolinejangola.com/_smoke"' && echo SERVE-canonical
curl -s http://localhost:4320/sitemap.xml | grep -q 'karolinejangola.com/_smoke' && echo SERVE-sitemap
kill $SRV
```
Expected: `SERVE-body`, `SERVE-canonical`, `SERVE-sitemap`. `SERVE-body` proves a crawler hitting `/_smoke/` gets real prerendered HTML, not the `<div id="root">` shell — the capability is real. (canonical matched by href alone; `Seo.tsx` puts `data-seo-managed` between `rel` and `href`.)

- [ ] **Step 3: Tear down the smoke page**

Set `app/src/data/pages/manifest.json` to `[]` and `app/src/data/pages/content.ts`'s map to `export const pagesContent: Record<string, string> = {}`. Then:
```bash
cd app && npx vitest run && npm run build && npm run publish:site
```
Expected: PASS + exit 0. This exercises the **empty-manifest** path end-to-end (closing the Task 5 deferred minor): prerender snapshots zero manifest pages and `buildSitemapEntries` adds none, so `dist/` and `dist/sitemap.xml` carry no `_smoke`.

**Known limitation (surfaced here, matters for SP2/SP3):** publish's `computeGeneratedPaths` cleans only sectionRoots **currently in the manifest**. Since `_smoke` is now removed from the manifest, publish does NOT delete the orphaned root `_smoke/` that Task 6's publish left on disk — a page *removed* from the manifest orphans its already-published dir. (Cleanup for a page that *stays* in the manifest was already proven in Task 6: it appears in "removed generated path(s)" and is delete-then-recopied every publish, like `blog/`.) The fix for the real program is an SP2/SP3 decision: put service pages under a **fixed** sectionRoot (e.g. make `tratamentos` a permanent `GENERATED_PATHS` entry, wiped+recopied like `blog/`) so per-page removal self-cleans. For SP0 teardown the orphan is untracked scratch — remove it by hand:
```bash
rm -rf ../_smoke
test ! -e dist/_smoke && test ! -e ../_smoke && echo DIST+ROOT-CLEAN
grep -q '_smoke' dist/sitemap.xml && echo STILL-IN-SITEMAP || echo SITEMAP-CLEAN
```
Expected: `DIST+ROOT-CLEAN`, `SITEMAP-CLEAN`. The root `_smoke/` was never committed (untracked), so it never reaches git regardless.

- [ ] **Step 4: Commit teardown**

```bash
git add app/src/data/pages/manifest.json app/src/data/pages/content.ts
git commit -m "chore(sp0): empty the page manifest after capability verified locally"
```

**Steps 5–6 are controller-run (merge + gated push), NOT part of the implementer's task** — they happen after the final whole-branch review, and the push to `main` requires Mark's explicit approval via `approved-push main`. The implementer's task ends at Step 4.

- [ ] **Step 5 (controller): merge capability to `main`**

After the final review is clean: commit the regenerated published root (no `_smoke`) and the SP0 docs, merge `feat/sp0-multi-page-publishing` into `main`, and — **with Mark's OK** — `approved-push main`. The deployed bundle now carries the dormant page-pipeline code; no new routes exist (empty manifest), so the live site is visually unchanged.

- [ ] **Step 6 (controller): confirm the live site is unaffected**

```bash
curl -s https://karolinejangola.com/ | grep -q 'id="root"' && echo HOME-OK
curl -s https://karolinejangola.com/sitemap.xml | grep -q '_smoke' && echo LEAK || echo SITEMAP-CLEAN
```
Expected: `HOME-OK`, `SITEMAP-CLEAN`. **Capability shipped; SP0 done.**

---

## Notes for the executor

- **Empty-manifest tolerance is a feature, not a bug:** after teardown the manifest is `[]`. The router `.map` yields no routes, prerender snapshots no pages, publish adds nothing to the cleanup set — all correct. Do not add a "refuse empty manifest" guard (unlike the blog's guard).
- **Do not touch** the `/blog` prerender loop, its "refuse empty blog" guard, or `Seo.tsx`.
- If `npm run build` fails at prerender with a Chromium error, run `npx playwright install chromium` once, then retry — this is environment setup, not a code failure.
