import React from 'react'
import Nav from '../components/Nav'
import { supabase } from '../lib/supabase'
import { isAdmin } from '../lib/authz'
import { track } from '../lib/analytics'

type Ws = {
  id: string
  name: string
  owner_user_id: string
  plan_key: string
  plan_status: string
  created_at: string
}

export default function Workspaces() {
  const [ok, setOk] = React.useState<boolean | null>(null)
  const [rows, setRows] = React.useState<Ws[]>([])
  const [q, setQ] = React.useState('')

  async function load() {
    const admin = await isAdmin()
    setOk(admin)
    if (!admin) return

    let query = supabase.from('workspaces').select('*').order('created_at', { ascending: false }).limit(200)
    if (q.trim()) query = query.ilike('name', `%${q.trim()}%`)
    const { data } = await query
    setRows((data ?? []) as any)
  }

  React.useEffect(() => { load() }, [q])

  async function updatePlan(id: string, plan_key: string, plan_status: string) {
    await supabase.from('workspaces').update({ plan_key, plan_status }).eq('id', id)
    await track('workspace_plan_updated', { id, plan_key, plan_status })
    await load()
  }

  if (ok === null) return <div className="container"><div className="card"><h3>Loading…</h3></div></div>
  if (!ok) return <div className="container"><div className="card"><h3>Not authorized</h3></div></div>

  return (
    <div className="container">
      <Nav />

      <h1 className="h1" style={{fontSize:34, marginTop:18}}>Workspaces</h1>
      <p className="p">This is your “manual switchboard”. After you send links, flip plan + status here.</p>

      <div className="row">
        <input placeholder="Search workspace name…" value={q} onChange={(e)=>setQ(e.target.value)} />
        <button className="btn" onClick={load}>Refresh</button>
      </div>

      <div className="grid">
        {rows.map(r => (
          <div className="card span12" key={r.id}>
            <div className="row" style={{justifyContent:'space-between'}}>
              <div>
                <div style={{fontWeight:700}}>{r.name}</div>
                <div className="small">{r.id} • owner: {r.owner_user_id}</div>
              </div>
              <div className="row">
                <span className="kbd">{r.plan_key}</span>
                <span className="kbd">{r.plan_status}</span>
              </div>
            </div>

            <div className="row" style={{marginTop:10}}>
              <select defaultValue={r.plan_key} onChange={(e)=>updatePlan(r.id, e.target.value, r.plan_status)}>
                <option value="free">free</option>
                <option value="starter">starter</option>
                <option value="growth">growth</option>
                <option value="enterprise">enterprise</option>
              </select>

              <select defaultValue={r.plan_status} onChange={(e)=>updatePlan(r.id, r.plan_key, e.target.value)}>
                <option value="free">free</option>
                <option value="trial">trial</option>
                <option value="active">active</option>
                <option value="past_due">past_due</option>
                <option value="canceled">canceled</option>
              </select>

              <button className="btn primary" onClick={()=>updatePlan(r.id, r.plan_key, 'active')}>Mark Active</button>
              <button className="btn" onClick={()=>updatePlan(r.id, 'free', 'free')}>Reset to Free</button>
            </div>
          </div>
        ))}
      </div>

      <div className="footer">© {new Date().getFullYear()} HolosCX</div>
    </div>
  )
}
