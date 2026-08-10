import { Link } from 'react-router-dom'
import Footer from './Footer'
import Nav from './Nav'
import Seo from './Seo'
import WhatsAppLink from './WhatsAppLink'
import NotFound from '../pages/NotFound'
import { pages } from '../data/pages'
import { pagesContent } from '../data/pages/content'
import { pagesFaq } from '../data/pages/faq'
import { staticPageSeo } from '../data/seo'
import { WA } from '../lib/whatsapp'

export default function StaticPage({ slug }: { slug: string }) {
  const page = pages.find((p) => p.slug === slug)
  if (!page) return <NotFound />

  return (
    <>
      <Seo {...staticPageSeo(page, pagesFaq[slug])} />
      <Nav />
      <main className="min-h-screen bg-background pb-20 pt-24">
        <div className="container mx-auto max-w-3xl px-6 md:px-12">
          <nav aria-label="breadcrumb" className="mb-4 font-sans text-sm text-foreground/60">
            <Link className="hover:text-primary transition-colors" to="/">
              Início
            </Link>
            <span aria-hidden="true" className="mx-2 text-foreground/30">
              ›
            </span>
            <a className="hover:text-primary transition-colors" href="/#tratamentos">
              Atendimento
            </a>
            <span aria-hidden="true" className="mx-2 text-foreground/30">
              ›
            </span>
            <span aria-current="page" className="text-foreground/80">
              {page.title}
            </span>
          </nav>
          <h1 className="mb-8 font-serif text-3xl leading-tight text-foreground md:text-4xl">
            {page.title}
          </h1>
          <article
            className="prose-blog"
            dangerouslySetInnerHTML={{ __html: pagesContent[slug] ?? '' }}
          />
          <div className="mt-12 rounded-2xl bg-secondary/40 p-8 text-center">
            <p className="mb-4 font-serif text-xl text-foreground">
              Quer conversar sobre o seu filho ou filha?
            </p>
            <WhatsAppLink
              className="inline-block rounded-lg bg-primary px-6 py-3 font-sans text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.97]"
              href={WA.general}
              text="Falar comigo pelo WhatsApp"
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
