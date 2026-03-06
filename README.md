# HolosCX V1 (Scratch Rebuild)
This repo contains **two Netlify-deployable frontends** and a **Supabase backend schema**.

## What you get
- **Marketing site** (Vite + React): home, pricing, quote request, basic self-serve signup.
- **Admin dashboard** (Vite + React): private admin-only portal to view quote requests, workspaces, and simple analytics charts.
- **Supabase SQL**: tables, RLS policies, and a simple admin role model.
- **Analytics**: `events` table + dashboard charts (page views, signups, quote requests, workspace created).

> You said you'll send links manually. This build supports that:
> - Quote requests go into Supabase and show up in Admin.
> - You can manually upgrade a workspace by changing `plan_key` + `plan_status` in Admin.

---

## 1) Supabase setup
1. Create a new Supabase project.
2. In Supabase SQL Editor, run:
   - `supabase/schema.sql`
   - (optional) `supabase/seed.sql`

3. Create an admin user:
   - Sign up normally (either from Marketing site or Supabase Auth UI).
   - Then run this SQL (replace with your admin email):
     ```sql
     update public.profiles
     set role = 'admin'
     where email = 'YOU@EMAIL.COM';
     ```

---

## 2) Deploy to Netlify (two separate sites)
You will create **two Netlify sites** pointing at two different folders:

### A) Marketing site
- Base directory: `apps/marketing`
- Build command: `npm run build`
- Publish directory: `dist`

Environment variables (Netlify -> Site settings -> Environment variables):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### B) Admin dashboard
- Base directory: `apps/admin`
- Build command: `npm run build`
- Publish directory: `dist`

Environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 3) Local dev
From repo root:
```bash
npm i
npm run dev:marketing
# or
npm run dev:admin
```

---

## Notes
- Email sending is intentionally **not automated** in this version.
- If you later want Zoho Mail automation, we can add a Supabase Edge Function that triggers on `quote_requests` insert.
