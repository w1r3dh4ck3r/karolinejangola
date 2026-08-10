import { describe, expect, it } from 'vitest'
import { staticPageSeo } from './seo'
import { BOUNDARY_FAQ } from './pages/faq'
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

describe('staticPageSeo jsonLd', () => {
  it('always emits a BreadcrumbList', () => {
    const jsonLd = staticPageSeo(page).jsonLd ?? []
    expect(jsonLd.some((x) => x['@type'] === 'BreadcrumbList')).toBe(true)
  })
  it('emits FAQPage only when faqItems are passed', () => {
    expect((staticPageSeo(page).jsonLd ?? []).some((x) => x['@type'] === 'FAQPage')).toBe(false)
    const withFaq = staticPageSeo(page, BOUNDARY_FAQ).jsonLd ?? []
    expect(withFaq.some((x) => x['@type'] === 'FAQPage')).toBe(true)
  })
})
