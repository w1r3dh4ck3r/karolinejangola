import { ansiedadeSintomasTratamento } from './ansiedade-sintomas-tratamento'
import { comoSaberSePrecisoDeTerapia } from './como-saber-se-preciso-de-terapia'
import { terapiaOnlineFunciona } from './terapia-online-funciona'

export interface BlogPost {
  slug: string
  title: string
  date: string
  readTime: string
  excerpt: string
  bodyHtml: string
  /** Category pills shown on the blog index card cover, in render order. */
  tags: string[]
  /** Tailwind `bg-gradient-to-br` stop pair for the card's cover block. */
  coverTone: string
}

// Order matches inventory §6 (live bundle array `Ld`), not the stale prerendered
// blog/index.html card order.
export const blogPosts: BlogPost[] = [
  ansiedadeSintomasTratamento,
  comoSaberSePrecisoDeTerapia,
  terapiaOnlineFunciona,
]
