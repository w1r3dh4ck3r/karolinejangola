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
const routes = [
  {
    path: '/',
    outputs: ['index.html', '404.html'],
    extraWaits: ['script[type="application/ld+json"]', '#contato'],
  },
  { path: '/blog', outputs: ['blog/index.html'] },
  {
    path: '/blog/ansiedade-sintomas-tratamento',
    outputs: ['blog/ansiedade-sintomas-tratamento/index.html'],
  },
  {
    path: '/blog/como-saber-se-preciso-de-terapia',
    outputs: ['blog/como-saber-se-preciso-de-terapia/index.html'],
  },
  {
    path: '/blog/terapia-online-funciona',
    outputs: ['blog/terapia-online-funciona/index.html'],
  },
]

// 5 sitemap URLs (docs/reference/current-site-inventory.md §7), same
// priority/changefreq as the current live sitemap; lastmod refreshed to
// today's build date.
const sitemapEntries = [
  { loc: `${SITE_URL}/`, changefreq: 'monthly', priority: '1.0' },
  { loc: `${SITE_URL}/blog`, changefreq: 'weekly', priority: '0.8' },
  {
    loc: `${SITE_URL}/blog/como-saber-se-preciso-de-terapia`,
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    loc: `${SITE_URL}/blog/terapia-online-funciona`,
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    loc: `${SITE_URL}/blog/ansiedade-sintomas-tratamento`,
    changefreq: 'monthly',
    priority: '0.7',
  },
]

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

function writeSnapshot(outputs, html) {
  for (const relPath of outputs) {
    const outPath = path.join(distDir, relPath)
    fs.mkdirSync(path.dirname(outPath), { recursive: true })
    fs.writeFileSync(outPath, html)
    console.log(`  wrote dist/${relPath} (${html.length} bytes)`)
  }
}

function writeSitemap() {
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

async function main() {
  if (!fs.existsSync(path.join(distDir, 'index.html'))) {
    throw new Error(`dist/index.html not found at ${distDir} — run vite build first`)
  }

  const server = await startStaticServer(distDir, PORT)
  console.log(`Static server serving ${distDir} on http://127.0.0.1:${PORT}`)

  const browser = await chromium.launch()
  try {
    for (const route of routes) {
      console.log(`Prerendering ${route.path}`)
      const page = await browser.newPage()
      // Block the visitor-tracking webhook during snapshotting — broad
      // glob because a narrow '**/host/**' form may not match Playwright's
      // route matcher.
      await page.route('**n8n.w1r3d.dev**', (r) => r.abort())

      await page.goto(`http://127.0.0.1:${PORT}${route.path}`, { waitUntil: 'networkidle' })

      // Wait for the Seo effect to flush (title/meta/canonical are set via
      // useEffect, not present in the initial static HTML shell) before
      // any route-specific extra markers (e.g. JSON-LD, which only the
      // homepage renders). state:'attached' because <link>/<script> are
      // never "visible" (no rendered box) — the default visible-wait times
      // out on these element types even once they exist in the DOM.
      await page.waitForSelector('link[rel="canonical"][data-seo-managed]', { state: 'attached' })
      for (const marker of route.extraWaits ?? []) {
        await page.waitForSelector(marker, { state: 'attached' })
      }

      const html = '<!doctype html>\n' + (await page.content())
      writeSnapshot(route.outputs, html)

      await page.close()
    }
  } finally {
    await browser.close()
    await new Promise((resolve) => server.close(resolve))
  }

  writeSitemap()
  console.log('Prerender complete.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
