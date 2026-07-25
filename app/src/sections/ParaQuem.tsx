import { Phone } from 'lucide-react'
import { paraQuem } from '../data/content'
import { WA } from '../lib/whatsapp'
import WhatsAppLink from '../components/WhatsAppLink'

export default function ParaQuem() {
  return (
    <section className="bg-secondary/30 py-20 md:py-24" id="para-quem">
      <div className="container mx-auto max-w-4xl px-6 md:px-12">
        <div className="mb-12 text-center">
          <p className="mb-3 font-sans text-sm uppercase tracking-widest text-sage-light">
            {paraQuem.eyebrow}
          </p>
          <h2 className="font-serif text-3xl text-foreground md:text-4xl">{paraQuem.h2}</h2>
        </div>
        <div className="flex flex-col items-center rounded-2xl border border-border bg-background p-8 text-center shadow-sm md:p-10">
          <p className="mb-6 max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground">
            {paraQuem.description}
          </p>
          <WhatsAppLink
            href={WA.general}
            className="inline-flex items-center gap-2 rounded-lg bg-terracotta/10 px-5 py-2.5 font-sans text-sm font-medium text-terracotta transition-colors hover:bg-terracotta/20"
          >
            <Phone className="h-4 w-4" />
            {paraQuem.ctaLabel}
          </WhatsAppLink>
        </div>
      </div>
    </section>
  )
}
