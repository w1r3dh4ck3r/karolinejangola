import { describe, expect, it } from 'vitest'
import { BASE_GENERATED_PATHS, computeGeneratedPaths } from './generated-paths.mjs'

const base = ['assets', 'index.html', 'blog', 'sitemap.xml']
// mirrors publish.mjs isDenylisted for the cases under test
const isDenylisted = (name) =>
  ['docs', 'app', '.git', 'CLAUDE.md'].includes(name) || name.startsWith('.')

describe('computeGeneratedPaths', () => {
  it('adds distinct sectionRoots to the base allowlist', () => {
    const out = computeGeneratedPaths(base, [{ sectionRoot: '_smoke' }, { sectionRoot: 'tratamentos' }], isDenylisted)
    expect(out).toContain('_smoke')
    expect(out).toContain('tratamentos')
    expect(out).toContain('assets')
  })

  it('deduplicates a sectionRoot shared by two pages', () => {
    const out = computeGeneratedPaths(base, [{ sectionRoot: 'tratamentos' }, { sectionRoot: 'tratamentos' }], isDenylisted)
    expect(out.filter((n) => n === 'tratamentos')).toHaveLength(1)
  })

  it('throws if a sectionRoot is denylisted', () => {
    expect(() => computeGeneratedPaths(base, [{ sectionRoot: 'docs' }], isDenylisted)).toThrow()
    expect(() => computeGeneratedPaths(base, [{ sectionRoot: '.git' }], isDenylisted)).toThrow()
  })

  it('returns the base unchanged for an empty manifest', () => {
    expect(computeGeneratedPaths(base, [], isDenylisted).sort()).toEqual([...base].sort())
  })
})

describe('BASE_GENERATED_PATHS', () => {
  it('always includes the fixed atendimento section root, even with no manifest pages', () => {
    expect(BASE_GENERATED_PATHS).toContain('atendimento')
    const result = computeGeneratedPaths(BASE_GENERATED_PATHS, [], () => false)
    expect(result).toContain('atendimento')
  })
})
