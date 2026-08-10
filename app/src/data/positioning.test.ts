import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { treatments } from './treatments'
import { faq } from './faq'
import { professionalServiceJsonLd, homeSeo } from './seo'

// SP1 invariant: the practice targets children & adolescents only. These core
// content surfaces must never reintroduce adult-women framing or conditions
// Karoline does not treat. See docs/reference/practice-facts.md.
const FORBIDDEN = [/depress/i, /trauma/i, /mulher/i, /psicólog/i]

function coreSurfaceText(): string {
  return [
    ...treatments.flatMap((t) => [t.title, t.body]),
    ...faq.flatMap((f) => [f.q, f.a]),
    professionalServiceJsonLd.description,
    professionalServiceJsonLd.serviceType.join(' '),
    professionalServiceJsonLd.founder.knowsAbout.join(' '),
    homeSeo.description,
    homeSeo.og?.description ?? '',
  ].join(' \n ')
}

describe('SP1 positioning invariants', () => {
  it('has no adult-women / non-treated-condition terms in the core content surfaces', () => {
    const text = coreSurfaceText()
    for (const term of FORBIDDEN) {
      expect(text).not.toMatch(term)
    }
  })

  it('advertises the real child/adolescent conditions', () => {
    const titles = treatments.map((t) => t.title).join(' ')
    expect(titles).toMatch(/TDAH/)
    expect(titles).toMatch(/TEA/)
    expect(professionalServiceJsonLd.serviceType).toContain('Terapia para Adolescentes')
    expect(professionalServiceJsonLd.founder.knowsAbout).toEqual(
      expect.arrayContaining(['TDAH', 'TEA', 'Autoestima']),
    )
  })

  it('keeps homeSeo description and og:description identical (spec: Seo writes description verbatim to meta/og/twitter)', () => {
    expect(homeSeo.og?.description).toBe(homeSeo.description)
  })
})

const INDEX_HTML = readFileSync(fileURLToPath(new URL('../../index.html', import.meta.url)), 'utf8')

describe('index.html static meta tags', () => {
  it('carry no off-positioning or CRP-protected-title terms', () => {
    for (const term of FORBIDDEN) {
      expect(INDEX_HTML).not.toMatch(term)
    }
  })
})
