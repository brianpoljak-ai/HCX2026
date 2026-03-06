import React from 'react'
import Nav from '../components/Nav'
import { supabase } from '../lib/supabase'
import { isAdmin } from '../lib/authz'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

type Daily = { day: string; event_name: string; count: number }

function group(d: Daily[], event: string) {
  return d.filter(x => x.event_name === event).map(x => ({ day: x.day.slice(0,10), count: x.count }))
}

export default function Dashboard() {
  const [ok, setOk] = React.useState<boolean | null>(null)
  const [eventsDaily, setEventsDaily] = React.useState<Daily[]>([])
  const [stats, setStats] = React.useState({ quotes: 0, workspaces: 0 })

  React.useEffect(() => {
    ;(async () => {
      const admin = await isAdmin()
      setOk(admin)
      if (!admin) return

      const { count: qCount } = await supabase.from('quote_requests').select('*', { count: 'exact', head: true })
      const { count: wCount } = await supabase.from('workspaces').select('*', { count: 'exact', head: true })

      setStats({ quotes: qCount ?? 0, workspaces: wCount ?? 0 })

      const { data } = await supabase
        .from('events_daily')
        .select('*')
        .order('day', { ascending: true })
        .limit(400)

      setEventsDaily((data ?? []) as any)
    })()
  }, [])

  if (ok === null) return <div className="container"><div className="card"><h3>Loading…</h3></div></div>
  if (!ok) return <div className="container"><div className="card"><h3>Not authorized</h3><div className="small">Set your role to admin in <span className="kbd">profiles</span>.</div></div></div>

  const pv = group(eventsDaily, 'page_view')
  const su = group(eventsDaily, 'signup')
  const qr = group(eventsDaily, 'quote_request_created')

  return (
    <div className="container">
      <Nav />

      <h1 className="h1" style={{fontSize:34, marginTop:18}}>Dashboard</h1>
      <p className="p">Simple analytics from the <span className="kbd">events</span> table (anonymous inserts, admin read).</p>

      <div className="grid">
        <div className="card span4">
          <h3>Total quote requests</h3>
          <div className="h1" style={{fontSize:34, margin:0}}>{stats.quotes}</div>
          <div className="small">Pipeline captured from the marketing site.</div>
        </div>
        <div className="card span4">
          <h3>Total workspaces</h3>
          <div className="h1" style={{fontSize:34, margin:0}}>{stats.workspaces}</div>
          <div className="small">Created after login (basic self-serve).</div>
        </div>
        <div className="card span4">
          <h3>Manual-link workflow</h3>
          <div className="small">You control who gets what payment / onboarding link. No automation required.</div>
          <div className="small" style={{marginTop:8}}>Next step (optional): Zoho mail notification via Edge Function.</div>
        </div>

        <div className="card span6">
          <h3>Page views (daily)</h3>
          <div style={{height:260}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pv}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card span6">
          <h3>Signups (daily)</h3>
          <div style={{height:260}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={su}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card span12">
          <h3>Quote requests (daily)</h3>
          <div style={{height:260}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={qr}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="footer">© {new Date().getFullYear()} HolosCX</div>
    </div>
  )
}
