// The fixed root-level dirs publish.mjs always regenerates, independent of the
// manifest. 'atendimento' is here (not merely added per-page) so removing the
// LAST /atendimento/ page still wipes+recopies the section instead of orphaning
// its published dir — the SP0 parked finding.
export const BASE_GENERATED_PATHS = [
  'assets', 'index.html', '404.html', 'blog', 'sitemap.xml', 'placeholder.svg', 'atendimento',
]

// Computes the set of root-level dirs publish.mjs is allowed to delete before
// copying dist/ over the root: the fixed base allowlist plus every manifest
// page's sectionRoot, so republishing cleans orphaned page dirs. Throws rather
// than ever deleting a denylisted path (docs/, app/, .git, CNAME, dotfiles, …).
export function computeGeneratedPaths(baseGenerated, pages, isDenylisted) {
  const set = new Set(baseGenerated)
  for (const pg of pages) {
    if (isDenylisted(pg.sectionRoot)) {
      throw new Error(`refusing to add denylisted sectionRoot to generated set: ${pg.sectionRoot}`)
    }
    set.add(pg.sectionRoot)
  }
  return [...set]
}
