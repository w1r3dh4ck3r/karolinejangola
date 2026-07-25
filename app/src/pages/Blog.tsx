import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { blogPosts } from '../data/blog'

export default function Blog() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-background pb-20 pt-24">
        <div className="container mx-auto max-w-6xl px-6 md:px-12">
          <div className="mb-14 text-center">
            <p className="mb-3 font-sans text-sm font-medium uppercase tracking-widest text-primary">
              Blog
            </p>
            <h1 className="mb-4 font-serif text-4xl text-foreground md:text-5xl">
              Saúde Mental e Bem-Estar
            </h1>
            <p className="mx-auto max-w-xl font-sans text-lg text-muted-foreground">
              Artigos sobre psicologia, autoconhecimento e bem-estar emocional escritos com
              cuidado para você.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                className="group flex flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
                to={`/blog/${post.slug}`}
              >
                <h2 className="font-serif text-xl leading-snug text-foreground transition-colors group-hover:text-primary">
                  {post.title}
                </h2>
                <p className="flex-1 font-sans text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
                <div className="mt-2 flex items-center gap-3 font-sans text-xs text-muted-foreground">
                  <span>{post.date}</span>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <span>{post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
