import { faqHeading } from '../data/content'
import { faq } from '../data/faq'
import Accordion from '../components/Accordion'

export default function Faq() {
  return (
    <section className="bg-card py-24 md:py-32" id="faq">
      <div className="container mx-auto max-w-3xl px-6 md:px-12">
        <div className="mb-14 text-center">
          <p className="mb-3 font-sans text-sm uppercase tracking-widest text-sage-light">
            {faqHeading.eyebrow}
          </p>
          <h2 className="font-serif text-3xl text-foreground md:text-4xl">{faqHeading.h2}</h2>
        </div>
        <div className="w-full">
          <Accordion items={faq} />
        </div>
      </div>
    </section>
  )
}
