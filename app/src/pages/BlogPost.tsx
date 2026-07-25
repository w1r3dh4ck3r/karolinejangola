import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import BlogCta from '../components/BlogCta'
import Footer from '../components/Footer'
import Nav from '../components/Nav'
import Seo from '../components/Seo'
import { blogPosts } from '../data/blog'
import { blogPostSeo } from '../data/seo'
import NotFound from './NotFound'

export default function BlogPost() {
  const { slug } = useParams()
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) return <NotFound />

  return (
    <>
      <Seo {...blogPostSeo(post)} />
      <Nav />
      <main className="min-h-screen bg-background pb-20 pt-24">
        <div className="container mx-auto max-w-3xl px-6 md:px-12">
          <Link
            className="mb-10 inline-flex items-center gap-2 font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
            to="/blog"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Blog
          </Link>
          <header className="mb-10">
            <h1 className="mb-5 font-serif text-3xl leading-tight text-foreground md:text-4xl">
              {post.title}
            </h1>
            <div className="flex items-center gap-3 font-sans text-sm text-muted-foreground">
              <span>{post.date}</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span>{post.readTime}</span>
            </div>
          </header>
          <hr className="mb-10 border-border" />
          <article className="prose-blog" dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
          <BlogCta />
        </div>
      </main>
      <Footer />
    </>
  )
}
