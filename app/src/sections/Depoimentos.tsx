import { Quote } from 'lucide-react'
import { depoimentosHeading } from '../data/content'
import { testimonials } from '../data/testimonials'

export default function Depoimentos() {
  return (
    <section className="bg-background py-24 md:py-32" id="depoimentos">
      <div className="container mx-auto max-w-5xl px-6 md:px-12">
        <div className="mb-14 text-center">
          <p className="mb-3 font-sans text-sm uppercase tracking-widest text-sage-light">
            {depoimentosHeading.eyebrow}
          </p>
          <h2 className="font-serif text-3xl text-foreground md:text-4xl">{depoimentosHeading.h2}</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="rounded-xl bg-card p-8">
              <Quote className="mb-4 h-8 w-8 text-terracotta/30" />
              <p className="mb-6 font-sans leading-relaxed text-foreground/85 italic">
                &quot;{testimonial.quote}&quot;
              </p>
              <div>
                <p className="font-sans text-sm font-medium text-foreground">{testimonial.name}</p>
                <p className="font-sans text-xs text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
