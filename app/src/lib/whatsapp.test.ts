import { describe, expect, it } from 'vitest'
import { WA, waUrl } from './whatsapp'

describe('waUrl', () => {
  it('encodes text and targets the live number', () => {
    expect(waUrl('Olá')).toBe('https://wa.me/557996491276?text=Ol%C3%A1')
  })
})

describe('WA', () => {
  it('paraMim contains the correctly-encoded "para mim" fragment', () => {
    expect(WA.paraMim).toContain('para%20mim')
  })

  it('paraFilho contains the correctly-encoded "meu filho/a" fragment', () => {
    expect(WA.paraFilho).toContain('meu%20filho%2Fa')
  })

  it('all WA.* URLs target the live WhatsApp number', () => {
    for (const url of Object.values(WA)) {
      expect(url.startsWith('https://wa.me/557996491276?text=')).toBe(true)
    }
  })
})
