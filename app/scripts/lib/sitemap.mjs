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
