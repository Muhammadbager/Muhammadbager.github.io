create extension if not exists pgcrypto;

create type public.application_stage as enum (
  'Discovered', 'Saved', 'Ready', 'Applied',
  'Online Assessment', 'Recruiter Screen', 'Technical Interview',
  'Final Interview', 'Offer', 'Rejected', 'Withdrawn',
  'Position Closed', 'Accepted'
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  company text not null,
  job_title text not null,
  job_url text,
  location text,
  listing_date date,
  applied_date date,
  stage public.application_stage not null default 'Applied',
  source text,
  application_method text,
  resume_name text,
  notes text,
  next_action text,
  next_action_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.stage_history (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid not null references public.applications(id) on delete cascade,
  stage public.application_stage not null,
  changed_at timestamptz not null default now()
);

create table public.job_matches (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  external_id text not null,
  company text not null,
  title text not null,
  location text,
  url text not null,
  posted_at timestamptz,
  discovered_at timestamptz not null default now(),
  is_wishlist boolean not null default false,
  status text not null default 'new',
  unique (owner_id, external_id)
);

alter table public.applications enable row level security;
alter table public.stage_history enable row level security;
alter table public.job_matches enable row level security;

create policy "Owners manage their applications" on public.applications
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "Owners manage their stage history" on public.stage_history
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "Owners manage their job matches" on public.job_matches
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create index applications_owner_updated_idx on public.applications(owner_id, updated_at desc);
create index stage_history_application_idx on public.stage_history(application_id, changed_at desc);
create index job_matches_owner_discovered_idx on public.job_matches(owner_id, discovered_at desc);

