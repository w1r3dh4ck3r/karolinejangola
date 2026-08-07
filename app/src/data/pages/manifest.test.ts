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
