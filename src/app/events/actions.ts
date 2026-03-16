"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ok, err, type Result } from "@/lib/result";
import { SPORT_TYPES, type SportType } from "@/types/database";
import { z } from "zod";

const createEventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sport_type: z.string().refine((s) => SPORT_TYPES.includes(s as SportType)),
  start_at: z.string().min(1, "Date & time is required"),
  description: z.string().optional(),
  venue_ids: z.array(z.string().uuid()).optional(),
});

export async function createEventAction(
  _prev: unknown,
  formData: FormData
): Promise<Result<{ id: string }>> {
  const parsed = createEventSchema.safeParse({
    name: formData.get("name"),
    sport_type: formData.get("sport_type"),
    start_at: formData.get("start_at"),
    description: formData.get("description") || undefined,
    venue_ids: formData.getAll("venue_ids").filter(Boolean),
  });
  if (!parsed.success) {
    return err(parsed.error.flatten().formErrors[0] ?? "Invalid input");
  }
  const { name, sport_type, start_at, description, venue_ids } = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return err("Not authenticated");

  const { data: event, error: eventError } = await supabase
    .from("events")
    .insert({
      user_id: user.id,
      name,
      sport_type,
      start_at: new Date(start_at).toISOString(),
      description: description || null,
    })
    .select("id")
    .single();

  if (eventError) return err(eventError.message);
  if (!event) return err("Failed to create event");

  if (venue_ids?.length) {
    await supabase.from("event_venues").insert(
      venue_ids.map((venue_id) => ({ event_id: event.id, venue_id }))
    );
  }

  revalidatePath("/dashboard");
  revalidatePath("/events");
  redirect(`/dashboard`);
}

const updateEventSchema = createEventSchema;

export async function updateEventAction(
  _prev: unknown,
  formData: FormData
): Promise<Result<{ id: string }>> {
  const eventId = formData.get("event_id") as string;
  if (!eventId) return err("Event ID required");
  const parsed = updateEventSchema.safeParse({
    name: formData.get("name"),
    sport_type: formData.get("sport_type"),
    start_at: formData.get("start_at"),
    description: formData.get("description") || undefined,
    venue_ids: formData.getAll("venue_ids").filter(Boolean),
  });
  if (!parsed.success) {
    return err(parsed.error.flatten().formErrors[0] ?? "Invalid input");
  }
  const { name, sport_type, start_at, description, venue_ids } = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return err("Not authenticated");

  const { error: updateError } = await supabase
    .from("events")
    .update({
      name,
      sport_type,
      start_at: new Date(start_at).toISOString(),
      description: description || null,
    })
    .eq("id", eventId)
    .eq("user_id", user.id);

  if (updateError) return err(updateError.message);

  await supabase.from("event_venues").delete().eq("event_id", eventId);
  if (venue_ids?.length) {
    await supabase.from("event_venues").insert(
      venue_ids.map((venue_id) => ({ event_id: eventId, venue_id }))
    );
  }

  revalidatePath("/dashboard");
  revalidatePath(`/events/${eventId}`);
  redirect(`/dashboard`);
}

export async function deleteEventAction(eventId: string): Promise<Result<void>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return err("Not authenticated");

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", eventId)
    .eq("user_id", user.id);

  if (error) return err(error.message);
  revalidatePath("/dashboard");
  revalidatePath("/events");
  redirect("/dashboard");
}
