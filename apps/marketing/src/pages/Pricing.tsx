import { Link } from 'react-router-dom'

function Tier({
  name,
  price,
  bullets,
  cta,
  to,
}: {
  name: string
  price: string
  bullets: string[]
  cta: string
  to: string
}) {
  return (
    <div className="card span4">
      <h3>{name}</h3>
      <div className="small">{price}</div>
      <hr />
      <ul className="small">
        {bullets.map((b) => (
          <li key={b} style={{ marginBottom: 6 }}>
            {b}
          </li>
        ))}
      </ul>
      <div className="row">
        <Link className="btn primary" to={to}>
          {cta}
        </Link>
      </div>
    </div>
  )
}

export default function Pricing() {
  return (
    <div className="container">
      <h1 className="h1" style={{ fontSize: 34 }}>Pricing</h1>
      <p className="p">
        Simple tiers. If you request Enterprise, you’ll show up in the Admin dashboard and Brian sends the right link manually.
      </p>

      <div className="grid">
        <Tier
          name="Free"
          price="$0/month"
          bullets={[
            '1 workspace',
            'Basic analytics',
            'Manual upgrades'
          ]}
          cta="Create account"
          to="/signup?plan=free"
        />

        <Tier
          name="Starter"
          price="$99/month"
          bullets={[
            'Higher limits',
            'Team access',
            'Priority support'
          ]}
          cta="Sign up (Starter)"
          to="/signup?plan=starter"
        />

        <Tier
          name="Growth"
          price="$299/month"
          bullets={[
            'Even higher limits',
            'More team members',
            'Advanced analytics'
          ]}
          cta="Sign up (Growth)"
          to="/signup?plan=growth"
        />

        <div className="card span12">
          <h3>Enterprise</h3>
          <div className="small">
            Custom pricing. Compliance, SLAs, onboarding, custom limits.
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            <Link className="btn primary" to="/quote">
              Request a quote
            </Link>
          </div>
        </div>
      </div>

      <div className="footer">© {new Date().getFullYear()} HolosCX</div>
    </div>
  )
}