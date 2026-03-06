import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Quotes from './pages/Quotes'
import Workspaces from './pages/Workspaces'
import Logout from './pages/Logout'

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/quotes" element={<Quotes />} />
      <Route path="/workspaces" element={<Workspaces />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
