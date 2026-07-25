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
}

// Order matches inventory §6 (live bundle array `Ld`), not the stale prerendered
// blog/index.html card order.
export const blogPosts: BlogPost[] = [
  ansiedadeSintomasTratamento,
  comoSaberSePrecisoDeTerapia,
  terapiaOnlineFunciona,
]
