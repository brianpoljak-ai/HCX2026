import React from 'react'
import { supabase } from '../lib/supabase'
import { track } from '../lib/analytics'

export default function Login() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [err, setErr] = React.useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErr(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setErr(error.message)
    else await track('admin_login', {})
    setLoading(false)
    if (!error) window.location.href = '/dashboard'
  }

  return (
    <div className="container">
      <div className="hero">
        <h1 className="h1" style={{fontSize:34}}>Admin login</h1>
        <p className="p">Only users with <span className="kbd">profiles.role = admin</span> can view data.</p>
      </div>

      <form className="card" onSubmit={submit}>
        <label>Email</label>
        <input required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <label>Password</label>
        <input required type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <div className="row" style={{marginTop:14}}>
          <button className="btn primary" disabled={loading}>{loading ? 'Logging in…' : 'Log in'}</button>
        </div>
        {err ? <div className="small" style={{marginTop:10}}>{err}</div> : null}
      </form>
    </div>
  )
}
