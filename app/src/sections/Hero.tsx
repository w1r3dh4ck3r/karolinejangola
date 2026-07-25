import { MessageCircle } from 'lucide-react'
import { hero } from '../data/content'
import { site } from '../data/site'
import { WA } from '../lib/whatsapp'
import WhatsAppLink from '../components/WhatsAppLink'

/**
 * No section id (nav/anchors never target the hero). The live bundle
 * applies `animate-reveal-up` unconditionally at mount here — there is no
 * IntersectionObserver anywhere in the compiled JS — so the content block
 * uses the literal class directly rather than the scroll-gated
 * <RevealUp> component (see docs/reference/current-site-inventory.md §3,
 * "Reduced-motion" paragraph, and verified directly against
 * assets/index-NAF8EB0S.js: zero matches for "IntersectionObserver").
 */
export default function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center">
      <div className="absolute inset-0">
        <img
          alt="Ambiente acolhedor para terapia"
          className="h-full w-full object-cover"
          src={site.heroImage}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
      </div>
      <div className="relative z-10 container mx-auto max-w-6xl px-6 md:px-12">
        <div className="max-w-2xl animate-reveal-up">
          <p className="mb-4 font-sans text-sm uppercase tracking-widest text-cream-dark opacity-80">
            {hero.eyebrow}
          </p>
          <h1 className="mb-6 font-serif text-4xl leading-[1.1] text-cream md:text-6xl lg:text-7xl">
            {hero.h1}
          </h1>
          <p className="mb-8 max-w-lg font-sans text-base leading-relaxed text-cream-dark/90 md:text-xl">
            {hero.body}
          </p>
          <WhatsAppLink
            href={WA.general}
            className="inline-flex items-center gap-3 rounded-lg bg-terracotta px-7 py-3.5 font-sans font-medium text-cream shadow-lg transition-all duration-200 hover:bg-terracotta-dark hover:shadow-xl active:scale-[0.97]"
          >
            <MessageCircle className="h-4 w-4" />
            {hero.ctaLabel}
          </WhatsAppLink>
        </div>
      </div>
    </section>
  )
}
