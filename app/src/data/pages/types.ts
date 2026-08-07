export interface PageMeta {
  /** Stable key, also used to look up page content. */
  slug: string
  /** Route + URL path, leading slash. e.g. '/_smoke', '/tratamentos/terapia-infantil'. */
  path: string
  /** dist-relative output dir for the prerendered snapshot -> `<outputDir>/index.html`. */
  outputDir: string
  /** Top-level served-root dir publish.mjs must clean on republish (path's first segment). */
  sectionRoot: string
  /** Page <title> (brand suffix appended by staticPageSeo). */
  title: string
  /** Meta description. */
  description: string
}
