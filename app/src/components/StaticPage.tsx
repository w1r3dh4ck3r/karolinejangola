import Footer from './Footer'
import Nav from './Nav'
import Seo from './Seo'
import NotFound from '../pages/NotFound'
import { pages } from '../data/pages'
import { pagesContent } from '../data/pages/content'
import { staticPageSeo } from '../data/seo'

export default function StaticPage({ slug }: { slug: string }) {
  const page = pages.find((p) => p.slug === slug)
  if (!page) return <NotFound />

  return (
    <>
      <Seo {...staticPageSeo(page)} />
      <Nav />
      <main className="min-h-screen bg-background pb-20 pt-24">
        <div className="container mx-auto max-w-3xl px-6 md:px-12">
          <h1 className="mb-8 font-serif text-3xl leading-tight text-foreground md:text-4xl">
            {page.title}
          </h1>
          <article
            className="prose-blog"
            dangerouslySetInnerHTML={{ __html: pagesContent[slug] ?? '' }}
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
