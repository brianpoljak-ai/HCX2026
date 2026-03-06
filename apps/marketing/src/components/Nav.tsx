import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { track } from '../lib/analytics'

export default function Nav() {
  const loc = useLocation()
  React.useEffect(() => {
    track('page_view', { path: loc.pathname })
  }, [loc.pathname])

  return (
    <div className="nav">
      <Link to="/" className="brand" onClick={() => track('nav_click', { to: '/' })}>
        <span className="dot" />
        HolosCX
        <span className="kbd">V1</span>
      </Link>

      <div className="links">
        <Link to="/pricing">Pricing</Link>
        <Link to="/quote">Request a quote</Link>
        <Link to="/signup">Sign up</Link>
      </div>
    </div>
  )
}
