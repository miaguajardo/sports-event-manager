-- Sports Event Management: initial schema (per-user ownership)

-- Profiles (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Venues (owned by user)
create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  address text,
  city text,
  state text,
  country text,
  created_at timestamptz not null default now()
);

create index if not exists idx_venues_user_id_name on public.venues(user_id, name);

alter table public.venues enable row level security;

create policy "Users can manage own venues"
  on public.venues for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Events (owned by user)
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  sport_type text not null,
  description text,
  start_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_events_user_id_name on public.events(user_id, name);
create index if not exists idx_events_user_id_sport_type on public.events(user_id, sport_type);
create index if not exists idx_events_user_id_start_at on public.events(user_id, start_at);

alter table public.events enable row level security;

create policy "Users can manage own events"
  on public.events for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Event-Venues (many-to-many: one event can have multiple venues)
create table if not exists public.event_venues (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  venue_id uuid not null references public.venues(id) on delete cascade,
  unique(event_id, venue_id)
);

alter table public.event_venues enable row level security;

-- Only allow insert/update/delete when the event belongs to the user and the venue belongs to the user
create policy "Users can view event_venues for own events"
  on public.event_venues for select
  using (
    exists (
      select 1 from public.events e
      where e.id = event_venues.event_id and e.user_id = auth.uid()
    )
  );

create policy "Users can insert event_venues for own events and own venues"
  on public.event_venues for insert
  with check (
    exists (select 1 from public.events e where e.id = event_venues.event_id and e.user_id = auth.uid())
    and exists (select 1 from public.venues v where v.id = event_venues.venue_id and v.user_id = auth.uid())
  );

create policy "Users can update event_venues for own events"
  on public.event_venues for update
  using (
    exists (select 1 from public.events e where e.id = event_venues.event_id and e.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.events e where e.id = event_venues.event_id and e.user_id = auth.uid())
    and exists (select 1 from public.venues v where v.id = event_venues.venue_id and v.user_id = auth.uid())
  );

create policy "Users can delete event_venues for own events"
  on public.event_venues for delete
  using (
    exists (select 1 from public.events e where e.id = event_venues.event_id and e.user_id = auth.uid())
  );

-- Optional: trigger to create profile on signup (Supabase Auth)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
