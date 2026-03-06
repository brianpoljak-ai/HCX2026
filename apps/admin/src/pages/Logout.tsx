import React from 'react'
import { supabase } from '../lib/supabase'

export default function Logout() {
  React.useEffect(() => {
    supabase.auth.signOut().finally(() => {
      window.location.href = '/'
    })
  }, [])
  return (
    <div className="container">
      <div className="card">
        <h3>Signing out…</h3>
        <div className="small">One moment.</div>
      </div>
    </div>
  )
}
