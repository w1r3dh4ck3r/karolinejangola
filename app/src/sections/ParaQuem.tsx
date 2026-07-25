import { Phone } from 'lucide-react'
import { audienceCards, paraQuem } from '../data/content'
import { ICONS } from '../lib/icons'
import { waUrl } from '../lib/whatsapp'
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
        <div className="grid gap-6 md:grid-cols-2">
          {audienceCards.map((card) => {
            const Icon = ICONS[card.icon]
            return (
              <div
                key={card.key}
                className="flex flex-col rounded-2xl border border-border bg-background p-8 shadow-sm"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-terracotta/10">
                  <Icon className="h-5 w-5 text-terracotta" />
                </div>
                <h3 className="mb-3 font-serif text-xl text-foreground">{card.label}</h3>
                <p className="mb-6 flex-1 font-sans text-sm leading-relaxed text-muted-foreground">
                  {card.description}
                </p>
                <WhatsAppLink
                  href={waUrl(card.ctaText)}
                  className="inline-flex items-center gap-2 self-start rounded-lg bg-terracotta/10 px-5 py-2.5 font-sans text-sm font-medium text-terracotta transition-colors hover:bg-terracotta/20"
                >
                  <Phone className="h-4 w-4" />
                  {card.ctaLabel}
                </WhatsAppLink>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
