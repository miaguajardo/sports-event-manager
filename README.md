This is a [Next.js](https://nextjs.org) application for the Fastbreak AI Sports Event Dashboard.

Deployed to production with Vercel - https://sports-event-manager-3xze.vercel.app

## Tech Stack

- Next.js
- ShadCN UI
- Typescript
- Supabase (Database & Auth: email/password + Google OAuth)
- Tailwind CSS

## Top-level Project Structure

- ```src/app```: Route segments and pages (Next.js App Router)
- ```src/components```: Shared layout wrappers and ShadCN UI components
- ```src/lib```: Reusable utilities and Supabase client setup
- ```src/types```: Type definitions and interface for interacting with our Supabase database
- ```supabase```: SQL migrations 

## Database Schema

### Events

- **Purpose**: User-owned sports events
- **Columns**: 
    - `id` (`uuid`, PK, default `gen_random_uuid()`)
    - `user_id` (`uuid`, owner, references `auth.users(id)` on delete cascade)
    - `name` (`text`, required)
    - `sport_type` (`text`, required)
    - `description` (`text`, nullable)
    - `start_at` (`timestamptz`, required)
    - `created_at` (`timestamptz`, default `now()`)
- **Indexes**:
    - `idx_events_user_id_name` on `(user_id, name)`
    - `idx_events_user_id_sport_type` on `(user_id, sport_type)`
    - `idx_events_user_id_start_at` on `(user_id, start_at)`

### Venues

- **Purpose**: User-owned venues where events can take place
- **Columns**:
  - `id` (`uuid`, PK, default `gen_random_uuid()`)
  - `user_id` (`uuid`, owner, references `auth.users(id)` on delete cascade)
  - `name` (`text`, required)
  - `address` (`text`, nullable)
  - `city` (`text`, nullable)
  - `state` (`text`, nullable)
  - `country` (`text`, nullable)
  - `created_at` (`timestamptz`, default `now()`)
- **Indexes**:
  - `idx_venues_user_id_name` on `(user_id, name)`

### Event Venues

- **Purpose**: Join table to attach one or more venues to an event (many-to-many between `events` and `venues`)
- **Columns**:
  - `id` (`uuid`, PK, default `gen_random_uuid()`)
  - `event_id` (`uuid`, references `public.events(id)` on delete cascade)
  - `venue_id` (`uuid`, references `public.venues(id)` on delete cascade)
- **Constraints**:
  - `unique (event_id, venue_id)` to prevent duplicate links

### Row Level Security (RLS) policies enabled for all four tables

- **profiles**
  - Users can **insert**, **select**, and **update** only their own profile record (`id = auth.uid()`)
  - A trigger `public.handle_new_user` automatically inserts a profile row after a new `auth.users` record is created
- **events**
  - Any authenticated user can **select** all events (`auth.role() = 'authenticated'`)
  - Only the owner (`user_id = auth.uid()`) can **insert**, **update**, or **delete** their events
- **venues**
  - Any authenticated user can **select** all venues
  - Only the owner (`user_id = auth.uid()`) can **insert**, **update**, or **delete** their venues
    - Not currently enabled in UI, but would add as a future enhancement
- **event_venues**
  - Any authenticated user can **select** event–venue links.
  - Only owners of the underlying event and venues can **insert**, **update**, or **delete** links (policies check that `events.user_id = auth.uid()` and `venues.user_id = auth.uid()`)

## Key Design Decisions & Trade-Offs

- **RLS visibility**: I configured RLS so that events and venues are readable by any authenticated user, but only the owner can create/update/delete them. If given more time, later I'd introduce the concept of groups that users could belong to (i.e. Hornets Corp Team vs Checker Corp Team).
- **Many-to-many event_venues**: I modeled the relationship between events and venues with an explicit join table instead of putting a venue_id on events, as an event can span multiple venues and the same venue can host many events. The trade-off is slightly more query complexity.
- **Supabase Auth + profiles table**: This was my first project using Supabase and I found it a smooth process to implement. I used Supabase Auth for user accounts and a separate profiles table for app-specific data. Keeping these separate lets us avoid overloading auth.users with domain fields, makes it easier to change auth providers later, and keeps profile updates under our own RLS policies.
- **Server actions + SSR for mutations**: This was also my first time fully implementing server actions instead of API routes. With this approach, data access and validation happen on the server, which improves security and makes auth handling simpler. I enjoyed learning more about this!
- **Sport type modeling**: A simple text column is used for sport_type in the database and enforces allowed values in TypeScript with a SPORT_TYPES union type. This keeps things lightweight and simple, though the database doesn't strictly enforce valid sports—for now. I prioritized quicker development, but down the line I'd make this tighter.

## Future Enhancements

- Strengthen testing coverage: add proper testing strategy (unit/integration) instead of relying on local manual testing
- More informative error handling in the UI: surface clear and actionable messages
- Map-powered venue experience: inegrate a map view for venue addresses
- Attach partner and sponsor support to events
- More flexible scheduling: support richer time windows (multi-day/time ranges)
- More polished visual design
- Richer media for events and venues: photos, videos, promotional assets
