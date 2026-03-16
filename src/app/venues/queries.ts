import { createClient } from "@/lib/supabase/server";
import { err, ok } from "@/lib/result";
import type { Venue } from "@/types/database";

export async function getVenues() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("venues").select("*").order("name");
  if (error) return err(error.message);
  return ok((data ?? []) as Venue[]);
}
