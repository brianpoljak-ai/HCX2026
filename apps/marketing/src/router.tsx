import { Routes, Route, Navigate } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Pricing from './pages/Pricing'
import Quote from './pages/Quote'
import Signup from './pages/Signup'

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<><div className="container"><Nav /></div><Home /></>} />
      <Route path="/pricing" element={<><div className="container"><Nav /></div><Pricing /></>} />
      <Route path="/quote" element={<Quote />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
