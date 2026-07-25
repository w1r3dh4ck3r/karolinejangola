import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="flex min-h-screen items-center justify-center bg-muted px-6">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
          <Link className="text-primary underline hover:text-primary/90" to="/">
            Return to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
