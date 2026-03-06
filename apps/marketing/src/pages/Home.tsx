import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="container">
      <div className="hero">
        <div className="badge"><b>Manual-link workflow</b> <span>— no brittle email automation required</span></div>
        <h1 className="h1">Support + knowledge automation your team can actually control.</h1>
        <p className="p">
          HolosCX turns your approved docs, policies, and FAQs into a reliable support layer.
          In this scratch rebuild, quote requests and signups are captured cleanly — then you decide what link to send.
        </p>

        <div className="row">
          <Link className="btn primary" to="/pricing">View pricing</Link>
          <Link className="btn" to="/quote">Request enterprise quote</Link>
        </div>
      </div>

      <div className="grid">
        <div className="card span4">
          <h3>Clean onboarding</h3>
          <div className="small">Signup → workspace created → you're in. No email chains needed.</div>
        </div>
        <div className="card span4">
          <h3>Quote pipeline</h3>
          <div className="small">Enterprise leads land in your Admin dashboard with status tracking.</div>
        </div>
        <div className="card span4">
          <h3>Built-in analytics</h3>
          <div className="small">Track page views, signups, quote requests, and workspace creation in one place.</div>
        </div>
      </div>

      <div className="footer">© {new Date().getFullYear()} HolosCX</div>
    </div>
  )
}
