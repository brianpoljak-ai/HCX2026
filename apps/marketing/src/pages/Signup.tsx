import React from 'react'
import Nav from '../components/Nav'
import { supabase } from '../lib/supabase'
import { track } from '../lib/analytics'
import { useSearchParams } from 'react-router-dom'

export default function Signup() {
  const [params] = useSearchParams()
  const defaultPlan = params.get('plan') ?? 'free'

  const [mode, setMode] = React.useState<'signup'|'login'>('signup')
  const [loading, setLoading] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [workspaceName, setWorkspaceName] = React.useState('')
  const [message, setMessage] = React.useState<string | null>(null)
  const [plan, setPlan] = React.useState(defaultPlan)

  async function ensureWorkspace() {
    const { data: u } = await supabase.auth.getUser()
    const userId = u.user?.id
    if (!userId) return

    const { data: existing } = await supabase
      .from('workspaces')
      .select('id')
      .eq('owner_user_id', userId)
      .limit(1)

    if (existing && existing.length > 0) return

    const name = workspaceName || (email ? email.split('@')[0] : 'My workspace')
    const { error } = await supabase.from('workspaces').insert({
      name,
      owner_user_id: userId,
      plan_key: (plan as any),
      plan_status: plan === 'free' ? 'free' : 'trial',
    })

    if (!error) {
      await track('workspace_created', { plan })
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: '' } }
        })
        if (error) throw error
        await track('signup', { plan })
        setMessage('Account created. If email confirmation is enabled in Supabase, check your inbox. Then log in.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        await track('login', {})
        await ensureWorkspace()
        setMessage('Logged in. Workspace ensured. (In this version, Brian upgrades plans manually.)')
      }
    } catch (err: any) {
      setMessage(err.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <Nav />

      <h1 className="h1" style={{fontSize:34, marginTop:18}}>{mode === 'signup' ? 'Create account' : 'Log in'}</h1>
      <p className="p">
        Starter/Growth are **manual-link tiers**. You can still create an account — Brian will send the right link and upgrade the plan in Admin.
      </p>

      <div className="note" style={{marginTop:12}}>
        <div className="small">
          <b>Plan selected:</b> {plan} &nbsp;•&nbsp; <span className="kbd">plan_status</span> becomes <b>{plan === 'free' ? 'free' : 'trial'}</b>
        </div>
      </div>

      <div className="row" style={{marginTop:14}}>
        <button className={"btn " + (mode==='signup'?'primary':'')} onClick={()=>setMode('signup')}>Sign up</button>
        <button className={"btn " + (mode==='login'?'primary':'')} onClick={()=>setMode('login')}>Log in</button>
      </div>

      <form className="card" onSubmit={submit} style={{marginTop:14}}>
        <label>Email</label>
        <input required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />

        <label>Password</label>
        <input required type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />

        {mode === 'login' ? (
          <>
            <label>Workspace name (optional)</label>
            <input value={workspaceName} onChange={(e)=>setWorkspaceName(e.target.value)} />
          </>
        ) : null}

        <label>Desired tier</label>
        <select value={plan} onChange={(e)=>setPlan(e.target.value)}>
          <option value="free">Free</option>
          <option value="starter">Starter (manual)</option>
          <option value="growth">Growth (manual)</option>
          <option value="enterprise">Enterprise (request quote)</option>
        </select>

        <div className="row" style={{marginTop:14}}>
          <button className="btn primary" disabled={loading}>
            {loading ? 'Working…' : (mode === 'signup' ? 'Create account' : 'Log in')}
          </button>
        </div>

        {message ? <div className="small" style={{marginTop:10}}>{message}</div> : null}
      </form>

      <div className="footer">© {new Date().getFullYear()} HolosCX</div>
    </div>
  )
}
