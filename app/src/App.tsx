import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { trackVisit } from './lib/tracking'
import Home from './pages/Home'

function RouteTracker() {
  const location = useLocation()

  useEffect(() => {
    trackVisit()
  }, [location.pathname])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <RouteTracker />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
