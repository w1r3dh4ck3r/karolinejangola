import type { SeoProps } from '../components/Seo'
import type { BlogPost } from './blog'
import type { FaqItem } from './faq'
import { site } from './site'

export const SITE_URL = 'https://karolinejangola.com'
const OG_IMAGE = `${SITE_URL}/og-image.jpg`

/**
 * ProfessionalService JSON-LD — copied verbatim from
 * docs/reference/current-site-inventory.md §1 (the live bundle's `zv()`),
 * minus `hasOfferCatalog` which that function no longer emits.
 */
export const professionalServiceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Karoline Jangola - Psicanalista e Terapeuta',
  description:
    'Psicanalista e terapeuta online especializada em crianças e adolescentes. Tratamento de ansiedade, depressão, trauma e terapia infantil (TDAH/TEA).',
  url: SITE_URL,
  telephone: '+55-79-9649-1276',
  email: site.email,
  image: OG_IMAGE,
  priceRange: '$$',
  areaServed: [
    { '@type': 'Country', name: 'Brasil' },
    { '@type': 'Place', name: 'Brasileiros no exterior (atendimento online)' },
  ],
  serviceType: ['Psicanálise', 'Terapia Online', 'Terapia Infantil', 'Terapia para Mulheres'],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '20:00',
    },
  ],
  availableLanguage: ['Portuguese'],
  paymentAccepted: 'Pix, Transferência bancária',
  sameAs: [site.instagram.url],
  founder: {
    '@type': 'Person',
    name: 'Karoline Jangola',
    jobTitle: 'Psicanalista e Terapeuta',
    url: SITE_URL,
    knowsAbout: ['Psicanálise', 'Ansiedade', 'Depressão', 'Trauma', 'TDAH', 'TEA', 'Terapia Infantil'],
    sameAs: [site.instagram.url],
  },
}

/**
 * FAQPage JSON-LD, built from the same `faq` array that renders the FAQ
 * accordion — single source of truth, matching the live bundle's
 * `mainEntity:Ad.map(...)`.
 */
export function faqPageJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }
}

/** Home (`/`) — title/description/canonical/OG per inventory §1. */
export const homeSeo: Omit<SeoProps, 'jsonLd'> = {
  title: 'Karoline Jangola | Psicanalista e Terapeuta Online',
  description:
    'Psicanalista e terapeuta online especializada em crianças e adolescentes. Tratamento de ansiedade, depressão, trauma e terapia infantil (TDAH/TEA). Atendimento online para o Brasil e brasileiros no exterior.',
  canonical: SITE_URL,
  og: {
    title: 'Karoline Jangola | Psicanalista e Terapeuta Online',
    // Matches the live bundle's Seo component (Xo in
    // assets/index-NAF8EB0S.js): it takes a single `description` prop and
    // writes it verbatim into meta[name=description], og:description, AND
    // twitter:description — there is no separate og-specific string.
    description:
      'Psicanalista e terapeuta online especializada em crianças e adolescentes. Tratamento de ansiedade, depressão, trauma e terapia infantil (TDAH/TEA). Atendimento online para o Brasil e brasileiros no exterior.',
    image: OG_IMAGE,
    type: 'website',
    url: SITE_URL,
  },
}

/**
 * Blog index (`/blog`) — title/description bundle-extracted verbatim from
 * the live bundle's `jsx(Xo,{...})` call site for the blog list page.
 */
export const blogIndexSeo: SeoProps = {
  title: 'Blog | Karoline Jangola',
  description:
    'Artigos sobre psicologia, autoconhecimento e bem-estar emocional escritos com cuidado para você.',
  canonical: `${SITE_URL}/blog`,
  og: {
    image: OG_IMAGE,
  },
}

/**
 * BlogPost (`/blog/:slug`) — title/description pattern bundle-extracted
 * from the live bundle's per-post `jsx(Xo,{...})` call site
 * (`${t.title} | Karoline Jangola`, `t.description`, `ogType:"article"`).
 * Our `BlogPost` type only carries `excerpt` (not `description`), which the
 * bundle's own data array confirms are identical strings for every post.
 */
export function blogPostSeo(post: BlogPost): SeoProps {
  return {
    title: `${post.title} | Karoline Jangola`,
    description: post.excerpt,
    canonical: `${SITE_URL}/blog/${post.slug}`,
    og: {
      type: 'article',
      image: OG_IMAGE,
    },
  }
}
