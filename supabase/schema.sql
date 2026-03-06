-- HolosCX V1 Schema (manual-link workflow)
-- Run in Supabase SQL Editor.

create extension if not exists "uuid-ossp";

-- Profiles table (mirrors auth.users with extra metadata)
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

-- Workspaces (created by signed-in user)
create table if not exists public.workspaces (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  owner_user_id uuid not null references auth.users(id) on delete cascade,

  plan_key text not null default 'free' check (plan_key in ('free','starter','growth','enterprise')),
  plan_status text not null default 'free' check (plan_status in ('free','trial','active','past_due','canceled')),

  created_at timestamptz not null default now()
);

-- Quote requests (enterprise leads)
create table if not exists public.quote_requests (
  id uuid primary key default uuid_generate_v4(),
  workspace_name text,
  contact_name text,
  email text not null,
  company text,
  seats int,
  desired_plan text,
  notes text,
  status text not null default 'new' check (status in ('new','contacted','sent_link','won','lost')),
  created_at timestamptz not null default now()
);

-- Analytics events
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  event_name text not null,
  source text not null default 'marketing' check (source in ('marketing','admin','app')),
  actor_user_id uuid references auth.users(id) on delete set null,
  workspace_id uuid references public.workspaces(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Convenience view for dashboards
create or replace view public.events_daily as
select
  date_trunc('day', created_at) as day,
  event_name,
  count(*)::int as count
from public.events
group by 1,2;

-- ================
-- RLS
-- ================
alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.quote_requests enable row level security;
alter table public.events enable row level security;

-- Profiles policies
create policy "profiles_read_own"
on public.profiles for select
using (auth.uid() = user_id);

create policy "profiles_insert_own"
on public.profiles for insert
with check (auth.uid() = user_id);

create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Workspaces policies
create policy "workspaces_read_own"
on public.workspaces for select
using (auth.uid() = owner_user_id);

create policy "workspaces_insert_own"
on public.workspaces for insert
with check (auth.uid() = owner_user_id);

create policy "workspaces_update_own"
on public.workspaces for update
using (auth.uid() = owner_user_id);

-- Admin can read/update all workspaces
create policy "workspaces_admin_all"
on public.workspaces for all
using (
  exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
);

-- Quote requests policies:
-- Anyone (anonymous) can create a quote request (for lead capture),
-- but only admins can read/update.
create policy "quote_requests_insert_anon"
on public.quote_requests for insert
with check (true);

create policy "quote_requests_admin_read"
on public.quote_requests for select
using (
  exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
);

create policy "quote_requests_admin_update"
on public.quote_requests for update
using (
  exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
);

-- Events policies:
-- Allow inserts from anyone (anonymous) for analytics capture,
-- but only admins can read.
create policy "events_insert_anon"
on public.events for insert
with check (true);

create policy "events_admin_read"
on public.events for select
using (
  exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
);

-- ================
-- Triggers
-- ================
-- Auto-create profile row on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
