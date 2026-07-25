import { describe, expect, it } from 'vitest'
import { WA, waUrl } from './whatsapp'

describe('waUrl', () => {
  it('encodes text and targets the live number', () => {
    expect(waUrl('Olá')).toBe('https://wa.me/557996491276?text=Ol%C3%A1')
  })
})

describe('WA', () => {
  // Exact encoded URLs, copied verbatim from docs/reference/current-site-inventory.md
  // §2/§3 (live bundle strings) so a typo in the source text is caught, not just
  // the prefix/fragment shape.
  it('general matches the live encoded URL (inventory §2 hero CTA, line 155)', () => {
    expect(WA.general).toBe(
      'https://wa.me/557996491276?text=Ol%C3%A1%2C%20vi%20seu%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.'
    )
  })

  it('paraMim matches the live encoded URL (inventory §2 card 1, line 178)', () => {
    expect(WA.paraMim).toBe(
      'https://wa.me/557996491276?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20gostaria%20de%20atendimento%20para%20mim.'
    )
  })

  it('paraFilho matches the live encoded URL (inventory §2 card 2, line 183)', () => {
    expect(WA.paraFilho).toBe(
      'https://wa.me/557996491276?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20gostaria%20de%20atendimento%20para%20meu%20filho%2Fa.'
    )
  })

  it('blog matches waUrl of the live blogWhatsappUrl text (inventory §3 line 271)', () => {
    expect(WA.blog).toBe(waUrl('Olá, vi seu blog e gostaria de mais informações.'))
  })

  it('all WA.* URLs target the live WhatsApp number', () => {
    for (const url of Object.values(WA)) {
      expect(url.startsWith('https://wa.me/557996491276?text=')).toBe(true)
    }
  })
})
