import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Hero from '../sections/Hero'
import Sobre from '../sections/Sobre'
import ParaQuem from '../sections/ParaQuem'
import Tratamentos from '../sections/Tratamentos'
import Depoimentos from '../sections/Depoimentos'
import Faq from '../sections/Faq'
import Contato from '../sections/Contato'

export default function Home() {
  return (
    <>
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
