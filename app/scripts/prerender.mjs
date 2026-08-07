// Post-build prerender pass: snapshots every route to static HTML for SEO
// and regenerates the sitemap. Runs as the final step of `npm run build`
// (see package.json), after `vite build` has produced `app/dist/`.
//
// Why this exists: the app is a client-side SPA (React Router). Search
// crawlers and the GitHub Pages 404 fallback need real HTML per route, not
// an empty <div id="root">. This script serves the freshly built `dist/`
// locally, drives headless Chromium through each route, waits for the
// <Seo> component's post-mount effect to flush (title/meta/canonical/
// JSON-LD are all written via useEffect — see src/components/Seo.tsx), and
// writes the resulting DOM back into `dist/` as static HTML.
//
// Prerequisite: Playwright's Chromium browser must be installed once per
// machine/CI runner: `npx playwright install chromium`. `npm run build`
// does not install it automatically.

import { chromium } from 'playwright'
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildSitemapEntries } from './lib/sitemap.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, '..', 'dist')
const PORT = 4319
const SITE_URL = 'https://karolinejangola.com'

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
}

// The Seo component (src/components/Seo.tsx) upserts the canonical <link>
// via useEffect on EVERY route (Home, Blog, BlogPost all render <Seo>), so
// waiting for its data-seo-managed marker proves the effect flushed
// regardless of whether that page also carries JSON-LD. Only the homepage
// passes a `jsonLd` prop (src/data/seo.ts: homeSeo has none; blogIndexSeo /
// blogPostSeo carry no jsonLd either) — waiting for
// `script[type="application/ld+json"]` on /blog or /blog/:slug would hang
// until the Playwright timeout, since that route never renders one. So the
// JSON-LD wait is scoped to '/' only.
//
// Only '/' and '/blog' are static. Per-post routes are NOT hardcoded here —
// this script can't cheaply import the TS blogPosts array (ESM script vs.
// Vite-built TS data), and a hardcoded slug list would silently stop
// prerendering/sitemap-listing a new post the moment Mark adds one (still
// client-navigable, just invisible to crawlers). Instead the /blog route is
// rendered first, then its own DOM — the same source blogPosts renders
// into <Link to={`/blog/${post.slug}`}> — is scraped for every
// `/blog/<slug>` anchor; see deriveBlogPostSlugs() in main().
const staticRoutes = [
  {
    path: '/',
    outputs: ['index.html', '404.html'],
    extraWaits: ['script[type="application/ld+json"]', '#contato'],
  },
  { path: '/blog', outputs: ['blog/index.html'] },
]

// Manifest pages are read straight off disk (this is a Node script; it can't
// import the Vite-built TS). Same file the app imports — single source of truth.
function readManifestPages() {
  const manifestPath = path.join(__dirname, '..', 'src', 'data', 'pages', 'manifest.json')
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
}

function startStaticServer(root, port) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0])
      const requestedPath = path.join(root, urlPath)
      const ext = path.extname(requestedPath)

      if (ext && fs.existsSync(requestedPath) && fs.statSync(requestedPath).isFile()) {
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] ?? 'application/octet-stream' })
        fs.createReadStream(requestedPath).pipe(res)
        return
      }

      // SPA fallback: any unknown/extensionless path resolves to
      // index.html so the React Router can take over client-side. This is
      // also what makes the very first prerender pass work at all — dist/
      // has no blog/ subtree yet the first time /blog is requested.
      const indexPath = path.join(root, 'index.html')
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      fs.createReadStream(indexPath).pipe(res)
    })
    server.on('error', reject)
    server.listen(port, () => resolve(server))
  })
}

// Regression guard against the duplicate-head-tag class of bug (hit twice):
// a stray second <Seo>/head render duplicates these tags instead of
// replacing them. Scoped to dist/index.html — the one page most likely to
// pick up a duplicate og/twitter tag if <Seo> or the prerender pass ever
// double-mounts.
function assertSingleMetaTags(html, relPath) {
  const ogCount = (html.match(/<meta property="og:description"/g) ?? []).length
  const twitterCount = (html.match(/<meta name="twitter:card"/g) ?? []).length
  if (ogCount !== 1 || twitterCount !== 1) {
    throw new Error(
      `prerender: dist/${relPath} has ${ogCount} og:description tag(s) and ${twitterCount} twitter:card tag(s) — expected exactly 1 of each.`
    )
  }
}

function writeSnapshot(outputs, html) {
  for (const relPath of outputs) {
    const outPath = path.join(distDir, relPath)
    fs.mkdirSync(path.dirname(outPath), { recursive: true })
    fs.writeFileSync(outPath, html)
    console.log(`  wrote dist/${relPath} (${html.length} bytes)`)
    if (relPath === 'index.html') {
      assertSingleMetaTags(html, relPath)
    }
  }
}

function writeSitemap(sitemapEntries) {
  const today = new Date().toISOString().slice(0, 10)
  const urls = sitemapEntries
    .map(
      (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml)
  console.log(`  wrote dist/sitemap.xml (lastmod=${today})`)
}

// Navigates to `path` and waits for the Seo effect to flush (title/meta/
// canonical are set via useEffect, not present in the initial static HTML
// shell) before any route-specific extra markers (e.g. JSON-LD, which only
// the homepage renders). state:'attached' because <link>/<script> are never
// "visible" (no rendered box) — the default visible-wait times out on these
// element types even once they exist in the DOM. Returns the open page so
// the caller can both read its content and (for '/blog') scrape its DOM;
// closing the page is the caller's responsibility.
async function renderPage(browser, routePath, extraWaits) {
  console.log(`Prerendering ${routePath}`)
  const page = await browser.newPage()
  // Block the visitor-tracking webhook during snapshotting — broad glob
  // because a narrow '**/host/**' form may not match Playwright's route
  // matcher.
  await page.route('**n8n.w1r3d.dev**', (r) => r.abort())

  await page.goto(`http://127.0.0.1:${PORT}${routePath}`, { waitUntil: 'networkidle' })

  await page.waitForSelector('link[rel="canonical"][data-seo-managed]', { state: 'attached' })
  for (const marker of extraWaits ?? []) {
    await page.waitForSelector(marker, { state: 'attached' })
  }

  return page
}

// Single source of truth for per-post routes: scrapes the just-rendered
// /blog page's own DOM for every `/blog/<slug>` anchor — the same markup
// blogPosts (app/src/data/blog/index.ts) renders into <Link
// to={`/blog/${post.slug}`}>. Deliberately NOT a hardcoded slug list, so a
// new post Mark adds to blogPosts is prerendered and sitemapped without
// touching this script.
async function deriveBlogPostSlugs(blogIndexPage) {
  const hrefs = await blogIndexPage.$$eval('a[href^="/blog/"]', (anchors) =>
    anchors.map((a) => a.getAttribute('href'))
  )
  const slugs = [...new Set(hrefs)]
    .filter((href) => /^\/blog\/[^/]+$/.test(href))
    .map((href) => href.slice('/blog/'.length))
    .sort()
  return slugs
}

async function main() {
  if (!fs.existsSync(path.join(distDir, 'index.html'))) {
    throw new Error(`dist/index.html not found at ${distDir} — run vite build first`)
  }

  const server = await startStaticServer(distDir, PORT)
  console.log(`Static server serving ${distDir} on http://127.0.0.1:${PORT}`)

  const browser = await chromium.launch()
  let postSlugs = []
  let manifestPages = []
  try {
    for (const route of staticRoutes) {
      const page = await renderPage(browser, route.path, route.extraWaits)
      const html = '<!doctype html>\n' + (await page.content())
      writeSnapshot(route.outputs, html)

      if (route.path === '/blog') {
        postSlugs = await deriveBlogPostSlugs(page)
      }

      await page.close()
    }

    if (postSlugs.length === 0) {
      throw new Error(
        'prerender: derived zero /blog/<slug> links from the rendered /blog page — refusing to ' +
          'publish an empty blog. Check blogPosts (app/src/data/blog/index.ts) and the Blog page markup.'
      )
    }
    console.log(`Derived ${postSlugs.length} blog post route(s): ${postSlugs.join(', ')}`)

    for (const slug of postSlugs) {
      const page = await renderPage(browser, `/blog/${slug}`)
      const html = '<!doctype html>\n' + (await page.content())
      writeSnapshot([`blog/${slug}/index.html`], html)
      await page.close()
    }

    manifestPages = readManifestPages()
    for (const pg of manifestPages) {
      const page = await renderPage(browser, pg.path)
      const html = '<!doctype html>\n' + (await page.content())
      writeSnapshot([`${pg.outputDir}/index.html`], html)
      await page.close()
    }
    console.log(`Prerendered ${manifestPages.length} manifest page(s).`)
  } finally {
    await browser.close()
    await new Promise((resolve) => server.close(resolve))
  }

  writeSitemap(buildSitemapEntries(postSlugs, manifestPages))
  console.log('Prerender complete.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
