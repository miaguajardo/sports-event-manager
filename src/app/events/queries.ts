import { createClient } from "@/lib/supabase/server";
import { err, ok } from "@/lib/result";
import type { Venue, EventWithVenues } from "@/types/database";

type EventRow = {
  id: string;
  user_id: string;
  name: string;
  sport_type: string;
  description: string | null;
  start_at: string;
  created_at: string;
  event_venues: { venue_id: string; venues: { id: string; name: string } | null }[];
};

function mapRowToEventWithVenues(row: EventRow): EventWithVenues {
  const venuesList = (row.event_venues ?? []).flatMap((ev) => {
    const v = ev.venues;
    if (!v) return [];
    return Array.isArray(v) ? v : [v];
  });
  return {
    id: row.id,
    user_id: row.user_id,
    name: row.name,
    sport_type: row.sport_type,
    description: row.description,
    start_at: row.start_at,
    created_at: row.created_at,
    venues: venuesList as { id: string; name: string }[],
  };
}

export async function getEvent(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(
      `
      id,
      user_id,
      name,
      sport_type,
      description,
      start_at,
      created_at,
      event_venues(venue_id, venues(id, name))
    `
    )
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return mapRowToEventWithVenues(data as unknown as EventRow);
}

export async function getVenuesForCurrentUser() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("venues")
    .select("id, name, address, city, state, country, created_at, user_id")
    .order("name");
  if (error) return err(error.message);
  return ok((data ?? []) as Venue[]);
}
