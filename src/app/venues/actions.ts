"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { err, ok, type Result } from "@/lib/result";
import { z } from "zod";

const venueSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

export async function createVenueAction(
  _prev: unknown,
  formData: FormData
): Promise<Result<{ id: string }>> {
  const parsed = venueSchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address") || undefined,
    city: formData.get("city") || undefined,
    state: formData.get("state") || undefined,
    country: formData.get("country") || undefined,
  });
  if (!parsed.success) {
    return err(parsed.error.flatten().formErrors[0] ?? "Invalid input");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return err("Not authenticated");

  const { data, error } = await supabase
    .from("venues")
    .insert({
      user_id: user.id,
      ...parsed.data,
    })
    .select("id")
    .single();

  if (error) return err(error.message);
  if (!data) return err("Failed to create venue");
  revalidatePath("/venues");
  revalidatePath("/events/new");
  redirect("/venues");
}
