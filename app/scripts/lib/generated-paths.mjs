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
