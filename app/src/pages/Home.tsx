import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Seo from '../components/Seo'
import Hero from '../sections/Hero'
import Sobre from '../sections/Sobre'
import ParaQuem from '../sections/ParaQuem'
import Tratamentos from '../sections/Tratamentos'
import Depoimentos from '../sections/Depoimentos'
import Faq from '../sections/Faq'
import Contato from '../sections/Contato'
import { faq } from '../data/faq'
import { faqPageJsonLd, homeSeo, professionalServiceJsonLd } from '../data/seo'

export default function Home() {
  return (
    <>
      <Seo {...homeSeo} jsonLd={[professionalServiceJsonLd, faqPageJsonLd(faq)]} />
      <Nav />
      <main>
        <Hero />
        <Sobre />
        <ParaQuem />
        <Tratamentos />
        <Depoimentos />
        <Faq />
        <Contato />
      </main>
      <Footer />
    </>
  )
}
