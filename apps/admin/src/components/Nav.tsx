import { Link, useLocation } from 'react-router-dom'
import React from 'react'
import { track } from '../lib/analytics'

export default function Nav() {
  const loc = useLocation()
  React.useEffect(() => {
    track('page_view', { path: loc.pathname })
  }, [loc.pathname])

  return (
    <div className="nav">
      <Link to="/" className="brand">
        <span className="dot" />
        HolosCX Admin
        <span className="kbd">Private</span>
      </Link>
      <div className="links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/quotes">Quotes</Link>
        <Link to="/workspaces">Workspaces</Link>
        <Link to="/logout">Logout</Link>
      </div>
    </div>
  )
}
