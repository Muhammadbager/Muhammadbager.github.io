create table public.job_preferences (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  wishlist_companies text[] not null default array[
    'Google',
    'Uber',
    'Meta',
    'Amazon',
    'DoorDash',
    'TikTok',
    'Shopify',
    'Costco',
    'Stripe'
  ]::text[],
  updated_at timestamptz not null default now()
);

alter table public.job_preferences enable row level security;

create policy "Owners manage their job preferences" on public.job_preferences
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
