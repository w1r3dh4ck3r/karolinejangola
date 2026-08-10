import { describe, it, expect } from 'vitest'
import { comoSaberSePrecisoDeTerapia } from './como-saber-se-preciso-de-terapia'

// SP1: scrub the overtly-adult passages (§3, §7). A full child-reframe of this
// post is SP5; §4's educational "depressão" is intentionally retained.
describe('como-saber-se-preciso-de-terapia — adult-framing scrub', () => {
  const html = comoSaberSePrecisoDeTerapia.bodyHtml
  for (const term of [/parceiro/i, /ambiente de trabalho/i, /relações adultas/i, /em um trabalho/i]) {
    it(`no longer contains ${term}`, () => {
      expect(html).not.toMatch(term)
    })
  }
})
