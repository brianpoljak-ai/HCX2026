import React from 'react'
import Nav from '../components/Nav'
import { supabase } from '../lib/supabase'
import { isAdmin } from '../lib/authz'

type Quote = {
  id: string
  created_at: string
  email: string
  contact_name: string | null
  company: string | null
  seats: number | null
  desired_plan: string | null
  status: string
  notes: string | null
  workspace_name: string | null
}

export default function Quotes() {
  const [ok, setOk] = React.useState<boolean | null>(null)
  const [rows, setRows] = React.useState<Quote[]>([])
  const [filter, setFilter] = React.useState('new')

  async function load() {
    const admin = await isAdmin()
    setOk(admin)
    if (!admin) return

    const q = supabase.from('quote_requests').select('*').order('created_at', { ascending: false })
    const { data } = filter ? await q.eq('status', filter) : await q
    setRows((data ?? []) as any)
  }

  React.useEffect(() => { load() }, [filter])

  async function setStatus(id: string, status: string) {
    await supabase.from('quote_requests').update({ status }).eq('id', id)
    await load()
  }

  if (ok === null) return <div className="container"><div className="card"><h3>Loading…</h3></div></div>
  if (!ok) return <div className="container"><div className="card"><h3>Not authorized</h3></div></div>

  return (
    <div className="container">
      <Nav />

      <h1 className="h1" style={{fontSize:34, marginTop:18}}>Quote requests</h1>
      <div className="row">
        <span className="small">Filter</span>
        <select value={filter} onChange={(e)=>setFilter(e.target.value)}>
          <option value="new">new</option>
          <option value="contacted">contacted</option>
          <option value="sent_link">sent_link</option>
          <option value="won">won</option>
          <option value="lost">lost</option>
          <option value="">all</option>
        </select>
      </div>

      <div className="grid">
        {rows.map(r => (
          <div className="card span12" key={r.id}>
            <div className="row" style={{justifyContent:'space-between'}}>
              <div>
                <div style={{fontWeight:700}}>{r.company ?? '(no company)'} — {r.email}</div>
                <div className="small">{new Date(r.created_at).toLocaleString()} • seats: {r.seats ?? 'n/a'} • plan: {r.desired_plan ?? 'n/a'}</div>
              </div>
              <div className="row">
                <span className="kbd">{r.status}</span>
                <select value={r.status} onChange={(e)=>setStatus(r.id, e.target.value)}>
                  <option value="new">new</option>
                  <option value="contacted">contacted</option>
                  <option value="sent_link">sent_link</option>
                  <option value="won">won</option>
                  <option value="lost">lost</option>
                </select>
              </div>
            </div>
            {r.notes ? <div className="small" style={{marginTop:10, whiteSpace:'pre-wrap'}}>{r.notes}</div> : null}
          </div>
        ))}
      </div>

      <div className="footer">© {new Date().getFullYear()} HolosCX</div>
    </div>
  )
}
