/**
 * Types matching the Supabase schema (profiles, venues, events, event_venues).
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Profile {
    id: string;
    email: string | null;
    created_at: string;
}

export interface Venue {
    id: string;
    user_id: string;
    name: string;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    created_at: string;
}

export interface Event {
    id: string;
    user_id: string;
    name: string;
    sport_type: string;
    description: string | null;
    start_at: string;
    created_at: string;
}

export interface EventVenue {
    id: string;
    event_id: string;
    venue_id: string;
}

export type SportType = "Soccer" | "Basketball" | "Tennis" | "Volleyball" | "Baseball" | "Football" | "Field Hockey" |"Hockey" | "Running" | "NASCAR" | "Golf" | "Other";

export const SPORT_TYPES: SportType[] = [
    "Soccer",
    "Basketball",
    "Tennis",
    "Volleyball",
    "Baseball",
    "Football",
    "Field Hockey",
    "Hockey",
    "Running",
    "NASCAR",
    "Golf",
    "Other",
];

/** Event with optional joined venue names (for list/detail views). */
export interface EventWithVenues extends Event {
    venues?: { id: string; name: string }[];
}
