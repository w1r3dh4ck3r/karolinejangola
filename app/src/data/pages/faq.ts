import type { FaqItem } from '../faq'

/** Claim-boundary FAQ (SP2 spec §2). Rendered on TDAH/TEA/comportamento pages
 *  and emitted as FAQPage JSON-LD. Keeps the pages honest re: no laudo/diagnóstico. */
export const BOUNDARY_FAQ: FaqItem[] = [
  {
    q: 'Você faz diagnóstico ou emite laudo?',
    a: 'Não realizo testes de rastreio, diagnósticos ou laudos. Meu trabalho é o fortalecimento emocional e o acompanhamento contínuo. Se você busca um laudo, o profissional indicado é um(a) neuropediatra ou psiquiatra.',
  },
  { q: 'Atende por plano de saúde?', a: 'Atualmente atendo apenas de forma particular.' },
]

/** slug -> FAQ items for that page (feeds both the rendered FAQ and FAQPage JSON-LD). */
export const pagesFaq: Record<string, FaqItem[]> = {
  'terapia-para-tdah': BOUNDARY_FAQ,
  'apoio-emocional-tea': BOUNDARY_FAQ,
  'comportamento-infantil': BOUNDARY_FAQ,
}
