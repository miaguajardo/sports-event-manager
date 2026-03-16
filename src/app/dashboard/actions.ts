"use server";

import { createClient } from "@/lib/supabase/server";
import { err } from "@/lib/result";
import type { EventWithVenues } from "@/types/database";

type EventRow = {
    id: string;
    name: string;
    sport_type: string;
    description: string | null;
    start_at: string;
    created_at: string;
    event_venues: { venue_id: string; venues: { id: string; name: string } | null }[];
};

function mapToEventWithVenues(row: EventRow): EventWithVenues {
    const venuesList = (row.event_venues ?? []).flatMap((ev) => {
        const v = ev.venues;
        if (!v) return [];
        return Array.isArray(v) ? v : [v];
    });
    return {
        id: row.id,
        name: row.name,
        sport_type: row.sport_type,
        description: row.description,
        start_at: row.start_at,
        created_at: row.created_at,
        user_id: "", // not selected
        venues: venuesList as { id: string; name: string }[],
    };
}

export async function getEventsForDashboard(query?: string, sportFilter?: string) {
    const supabase = await createClient();
    let q = supabase
        .from("events")
        .select(
            `
            id,
            name,
            sport_type,
            description,
            start_at,
            created_at,
            event_venues(venue_id, venues(id, name))
        `
        )
        .order("start_at", { ascending: true });

    if (query?.trim()) {
        q = q.ilike("name", `%${query.trim()}%`);
    }
    if (sportFilter?.trim()) {
        q = q.eq("sport_type", sportFilter.trim());
    }

    const { data, error } = await q;
    if (error) return err(error.message);
    const rows = (data ?? []) as unknown as EventRow[];
    return { success: true as const, data: rows.map(mapToEventWithVenues) };
}
