import type { PageMeta } from './types'
import manifestRaw from './manifest.json'

// Cast keeps the type stable even when manifest.json is `[]` (post-teardown),
// where resolveJsonModule would otherwise infer `never[]`.
export const pages: PageMeta[] = manifestRaw as PageMeta[]
