import { tratamentosHeading } from '../data/content'
import { treatments } from '../data/treatments'
import { ICONS } from '../lib/icons'

export default function Tratamentos() {
  return (
    <section className="bg-card py-24 md:py-32" id="tratamentos">
      <div className="container mx-auto max-w-6xl px-6 md:px-12">
        <div className="mb-16 text-center">
          <p className="mb-3 font-sans text-sm uppercase tracking-widest text-sage-light">
            {tratamentosHeading.eyebrow}
          </p>
          <h2 className="font-serif text-3xl text-foreground md:text-4xl">{tratamentosHeading.h2}</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {treatments.map((treatment) => {
            const Icon = ICONS[treatment.icon]
            return (
              <div
                key={treatment.title}
                className="group rounded-xl bg-background p-8 shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-sage/10 transition-colors group-hover:bg-sage/15">
                  <Icon className="h-5 w-5 text-sage" />
                </div>
                <h3 className="mb-2 font-serif text-xl text-foreground">{treatment.title}</h3>
                <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                  {treatment.body}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
