import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>ok</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
