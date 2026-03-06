import React from 'react'
import Nav from '../components/Nav'
import { supabase } from '../lib/supabase'
import { track } from '../lib/analytics'

export default function Quote() {
  const [loading, setLoading] = React.useState(false)
  const [done, setDone] = React.useState(false)
  const [form, setForm] = React.useState({
    workspace_name: '',
    contact_name: '',
    email: '',
    company: '',
    seats: '',
    desired_plan: 'enterprise',
    notes: '',
  })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const payload: any = { ...form, seats: form.seats ? Number(form.seats) : null }
    const { error } = await supabase.from('quote_requests').insert(payload)
    if (!error) {
      await track('quote_request_created', { company: form.company, desired_plan: form.desired_plan })
      setDone(true)
    } else {
      alert(error.message)
    }
    setLoading(false)
  }

  return (
    <div className="container">
      <Nav />

      <h1 className="h1" style={{fontSize:34, marginTop:18}}>Request a quote</h1>
      <p className="p">This goes straight into your admin dashboard. You’ll follow up manually with the right link.</p>

      {done ? (
        <div className="card">
          <h3>Request received ✅</h3>
          <div className="small">We’ll reach out soon. If you need to move fast, include details in the notes.</div>
        </div>
      ) : (
        <form className="card" onSubmit={submit}>
          <div className="grid">
            <div className="card span6" style={{padding:0, border:'none', background:'transparent'}}>
              <label>Contact name</label>
              <input value={form.contact_name} onChange={(e)=>setForm({...form, contact_name:e.target.value})} />
            </div>
            <div className="card span6" style={{padding:0, border:'none', background:'transparent'}}>
              <label>Email</label>
              <input required type="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} />
            </div>

            <div className="card span6" style={{padding:0, border:'none', background:'transparent'}}>
              <label>Company</label>
              <input value={form.company} onChange={(e)=>setForm({...form, company:e.target.value})} />
            </div>
            <div className="card span6" style={{padding:0, border:'none', background:'transparent'}}>
              <label>Seats (approx.)</label>
              <input value={form.seats} onChange={(e)=>setForm({...form, seats:e.target.value})} />
            </div>

            <div className="card span6" style={{padding:0, border:'none', background:'transparent'}}>
              <label>Workspace name (optional)</label>
              <input value={form.workspace_name} onChange={(e)=>setForm({...form, workspace_name:e.target.value})} />
            </div>
            <div className="card span6" style={{padding:0, border:'none', background:'transparent'}}>
              <label>Desired plan</label>
              <select value={form.desired_plan} onChange={(e)=>setForm({...form, desired_plan:e.target.value})}>
                <option value="enterprise">Enterprise</option>
                <option value="enterprise_lite">Enterprise Lite</option>
                <option value="enterprise_pro">Enterprise Pro</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="card span12" style={{padding:0, border:'none', background:'transparent'}}>
              <label>Notes</label>
              <textarea value={form.notes} onChange={(e)=>setForm({...form, notes:e.target.value})} />
            </div>
          </div>

          <div className="row">
            <button className="btn primary" disabled={loading}>{loading ? 'Submitting…' : 'Submit request'}</button>
          </div>
        </form>
      )}

      <div className="footer">© {new Date().getFullYear()} HolosCX</div>
    </div>
  )
}
