import { sobre } from '../data/content'
import { site } from '../data/site'

/**
 * Reveal timing matches the live bundle exactly: portrait + eyebrow/H2
 * block reveal with no delay, the paragraphs/stats block reveals
 * [animation-delay:150ms] later. Both use the literal `animate-reveal-up`
 * class (mount-time animation, not scroll-gated — see Hero.tsx comment).
 */
export default function Sobre() {
  return (
    <section className="bg-background py-24 md:py-32" id="sobre">
      <div className="container mx-auto max-w-6xl px-6 md:px-12">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="animate-reveal-up">
            <div className="relative">
              <div className="absolute -inset-3 -rotate-2 rounded-2xl bg-secondary" />
              <img
                alt="Karoline Jangola — psicanalista e terapeuta online especializada em crianças e adolescentes"
                className="relative aspect-[4/5] w-full rounded-2xl object-cover shadow-soft"
                loading="lazy"
                src={site.portraitImage}
              />
            </div>
          </div>
          <div>
            <div className="animate-reveal-up">
              <p className="mb-3 font-sans text-sm uppercase tracking-widest text-sage-light">
                {sobre.eyebrow}
              </p>
              <h2 className="mb-6 font-serif text-3xl leading-tight text-foreground md:text-4xl">
                {sobre.h2}
              </h2>
            </div>
            <div className="animate-reveal-up [animation-delay:150ms]">
              <div className="max-w-lg space-y-4 font-sans leading-relaxed text-muted-foreground">
                {sobre.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <p className="font-medium text-foreground">{sobre.highlight}</p>
              </div>
              <div className="mt-8 flex gap-8">
                {sobre.stats.map((stat) => (
                  <div key={stat.label}>
                    <span className="font-serif text-2xl text-terracotta">{stat.value}</span>
                    <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
