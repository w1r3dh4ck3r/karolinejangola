import { useEffect } from 'react'

export interface SeoOpenGraph {
  title?: string
  description?: string
  image?: string
  type?: string
  url?: string
}

export interface SeoProps {
  title: string
  description: string
  canonical: string
  og?: SeoOpenGraph
  jsonLd?: Record<string, unknown>[]
}

const SEO_DATA_ATTR = 'data-seo-managed'

/**
 * Dependency-free, helmet-style head manager. Upserts <title>, meta tags,
 * the canonical <link>, and JSON-LD <script> tags directly into
 * document.head so a headless-browser prerender snapshot (Task 9) captures
 * them — nothing here renders inside #root.
 *
 * Meta/link tags are deduped by SEMANTIC identity (name/property/rel), so
 * the static description/canonical/og/twitter tags already shipped in
 * app/index.html get updated in place on first mount instead of getting a
 * duplicate — then stamped data-seo-managed so later renders keep finding
 * the same node. JSON-LD scripts (index.html ships none) are tracked by
 * that marker alone. Unrelated head tags (fonts, viewport, etc.) are left
 * untouched.
 */
export default function Seo({ title, description, canonical, og, jsonLd }: SeoProps) {
  useEffect(() => {
    document.title = title

    upsertMeta('name', 'description', description)

    upsertLink('canonical', canonical)

    const ogTags: Record<string, string | undefined> = {
      'og:title': og?.title ?? title,
      'og:description': og?.description ?? description,
      'og:url': og?.url ?? canonical,
      'og:type': og?.type ?? 'website',
      'og:image': og?.image,
      'twitter:card': og?.image ? 'summary_large_image' : 'summary',
      'twitter:title': og?.title ?? title,
      'twitter:description': og?.description ?? description,
      'twitter:image': og?.image,
    }

    const writtenPropertyKeys: string[] = []
    for (const [property, content] of Object.entries(ogTags)) {
      if (!content) continue
      upsertMeta('property', property, content)
      writtenPropertyKeys.push(property)
    }

    const jsonLdScripts = upsertJsonLd(jsonLd ?? [])

    return () => {
      // Managed tags persist across route changes (the next Seo mount
      // upserts over them); only the JSON-LD scripts are cleaned up here
      // since their count varies per page.
      jsonLdScripts.forEach((script) => script.remove())
    }
  }, [title, description, canonical, og, jsonLd])

  return null
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  // Dedupe by SEMANTIC identity (name/property value), not by the
  // data-seo-managed marker: app/index.html ships static description,
  // og:*, and twitter:* meta tags with no marker, and matching only
  // marked tags created a second, duplicate tag on first mount.
  const selector = `meta[${attr}="${key}"]`
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute(SEO_DATA_ATTR, 'true')
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  // Same dedupe-by-identity fix as upsertMeta: index.html ships a static
  // <link rel="canonical"> with no marker.
  const selector = `link[rel="${rel}"]`
  let el = document.head.querySelector<HTMLLinkElement>(selector)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute(SEO_DATA_ATTR, 'true')
  el.setAttribute('href', href)
}

function upsertJsonLd(items: Record<string, unknown>[]): HTMLScriptElement[] {
  document.head
    .querySelectorAll(`script[type="application/ld+json"][${SEO_DATA_ATTR}]`)
    .forEach((el) => el.remove())

  return items.map((item) => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute(SEO_DATA_ATTR, 'true')
    script.textContent = JSON.stringify(item)
    document.head.appendChild(script)
    return script
  })
}
