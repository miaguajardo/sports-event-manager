-- Update view permissions: make events and venues globally readable,
-- while keeping writes restricted to the owning user.

-- =========================
-- EVENTS
-- =========================

-- Drop the old owner-only "for all" policy, if it exists.
drop policy if exists "Users can manage own events" on public.events;

-- Allow all authenticated users to view all events.
create policy "Anyone can view events"
  on public.events
  for select
  using (auth.role() = 'authenticated');

-- Only allow owners to insert/update/delete events.
create policy "Users can insert own events"
  on public.events
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own events"
  on public.events
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own events"
  on public.events
  for delete
  using (auth.uid() = user_id);


-- =========================
-- VENUES
-- =========================

-- Drop the old owner-only "for all" policy, if it exists.
drop policy if exists "Users can manage own venues" on public.venues;

-- Allow all authenticated users to view all venues.
create policy "Anyone can view venues"
  on public.venues
  for select
  using (auth.role() = 'authenticated');

-- Only allow owners to insert/update/delete venues.
create policy "Users can insert own venues"
  on public.venues
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own venues"
  on public.venues
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own venues"
  on public.venues
  for delete
  using (auth.uid() = user_id);


-- =========================
-- EVENT_VENUES (event-to-venue links)
-- =========================

-- Drop existing policies that scoped visibility/changes to owner-only events.
drop policy if exists "Users can view event_venues for own events" on public.event_venues;
drop policy if exists "Users can insert event_venues for own events and own venues" on public.event_venues;
drop policy if exists "Users can update event_venues for own events" on public.event_venues;
drop policy if exists "Users can delete event_venues for own events" on public.event_venues;

-- Allow all authenticated users to see which venues are attached to which events.
create policy "Anyone can view event_venues"
  on public.event_venues
  for select
  using (auth.role() = 'authenticated');

-- Only owners can change links, and only for their own events and venues.
create policy "Users can insert event_venues for own events and own venues"
  on public.event_venues
  for insert
  with check (
    exists (
      select 1 from public.events e
      where e.id = event_venues.event_id
        and e.user_id = auth.uid()
    )
    and exists (
      select 1 from public.venues v
      where v.id = event_venues.venue_id
        and v.user_id = auth.uid()
    )
  );

create policy "Users can update event_venues for own events"
  on public.event_venues
  for update
  using (
    exists (
      select 1 from public.events e
      where e.id = event_venues.event_id
        and e.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.events e
      where e.id = event_venues.event_id
        and e.user_id = auth.uid()
    )
    and exists (
      select 1 from public.venues v
      where v.id = event_venues.venue_id
        and v.user_id = auth.uid()
    )
  );

create policy "Users can delete event_venues for own events"
  on public.event_venues
  for delete
  using (
    exists (
      select 1 from public.events e
      where e.id = event_venues.event_id
        and e.user_id = auth.uid()
    )
  );

