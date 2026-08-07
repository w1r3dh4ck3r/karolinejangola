import { describe, expect, it } from 'vitest'
import { pages } from './index'
import { pagesContent } from './content'

describe('pagesContent', () => {
  it('has a content entry for every manifest page', () => {
    for (const p of pages) {
      expect(pagesContent[p.slug], p.slug).toBeTruthy()
    }
  })
})
