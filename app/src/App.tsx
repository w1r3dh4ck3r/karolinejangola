import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { trackVisit } from './lib/tracking'
import Home from './pages/Home'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import NotFound from './pages/NotFound'

function RouteTracker() {
  const location = useLocation()

  useEffect(() => {
    trackVisit()
  }, [location.pathname])

  return null
}

/**
 * Root wrapper matches the live bundle's root layout component (Uv in
 * assets/index-NAF8EB0S.js): every route sits on min-h-screen
 * bg-background, and the page scrolls to top once. Verified directly
 * against the bundle: that effect's dependency array is empty (`[]`),
 * not `[location.pathname]`, so it fires on initial mount only — not on
 * every client-side route change.
 */
function App() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <BrowserRouter>
      <RouteTracker />
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
