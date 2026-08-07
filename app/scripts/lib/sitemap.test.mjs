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
