import { Phone } from 'lucide-react'
import { WA } from '../lib/whatsapp'
import WhatsAppLink from './WhatsAppLink'

export default function BlogCta() {
  return (
    <aside className="mt-14 rounded-2xl border border-border bg-card p-8 text-center">
      <p className="mb-2 font-sans text-sm uppercase tracking-widest text-sage-light">
        Pronto para dar o primeiro passo?
      </p>
      <h3 className="mb-3 font-serif text-2xl text-foreground">
        Você não precisa carregar isso sozinha
      </h3>
      <p className="mb-6 font-sans text-sm leading-relaxed text-muted-foreground">
        Se algo neste artigo ressoou com você, pode ser hora de conversar. Entre em contato — sem
        compromisso, sem julgamento.
      </p>
      <WhatsAppLink
        className="inline-flex items-center gap-2 rounded-lg bg-terracotta px-6 py-3 font-sans font-medium text-cream shadow transition-all hover:bg-terracotta-dark active:scale-[0.97]"
        href={WA.blog}
      >
        <Phone className="h-4 w-4" />
        Fale comigo pelo WhatsApp
      </WhatsAppLink>
    </aside>
  )
}
