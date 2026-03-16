"use client";

import { useActionState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createEventAction, updateEventAction } from "@/app/events/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SPORT_TYPES } from "@/types/database";
import type { EventWithVenues } from "@/types/database";
import type { Venue } from "@/types/database";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  sport_type: z.string().min(1, "Sport is required"),
  start_at: z.string().min(1, "Date & time is required"),
  description: z.string().optional(),
  venue_ids: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  event?: EventWithVenues | null;
  venues: Venue[];
};

export function EventForm({ event, venues }: Props) {
  const isEdit = !!event?.id;
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: event?.name ?? "",
      sport_type: event?.sport_type ?? "",
      start_at: event?.start_at
        ? new Date(event.start_at).toISOString().slice(0, 16)
        : "",
      description: event?.description ?? "",
      venue_ids: event?.venues?.map((v) => v.id) ?? [],
    },
  });

  const [state, formAction, isPending] = useActionState(
    async (_prev: unknown, fd: FormData) => {
      if (isEdit && event?.id) {
        return updateEventAction(_prev, fd);
      }
      return createEventAction(_prev, fd);
    },
    null
  );

  if (state && !state.success && state.message) {
    toast.error(state.message);
  }

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-6">
        {isEdit && event?.id && (
          <input type="hidden" name="event_id" value={event.id} />
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Summer Cup" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sport_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sport type</FormLabel>
              <FormControl>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  {...field}
                >
                  <option value="">Select sport</option>
                  {SPORT_TYPES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="start_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date & time</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="datetime-local"
                    className="pr-10 hide-native-datetime-picker"
                    {...field}
                    ref={dateInputRef}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (dateInputRef.current?.showPicker) {
                        dateInputRef.current.showPicker();
                      } else {
                        dateInputRef.current?.focus();
                      }
                    }}
                    className="absolute inset-y-0 right-3 my-auto flex h-4 w-4 items-center justify-center text-muted-foreground hover:text-foreground"
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  placeholder="Event details…"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="venue_ids"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Venues (optional)</FormLabel>
                <FormControl>
                    {venues.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No venues yet.{" "}
                            <a href="/venues/new" className="underline">
                            Add a venue
                            </a>
                        </p>
                    ) : (
                    <>
                        {/* scrollable container */}
                        <div className="mt-1 max-h-40 overflow-y-auto rounded-md border border-input bg-background">
                        <div>
                            {venues.map((venue) => {
                            const selected = (field.value ?? []).includes(venue.id);

                            const toggle = () => {
                                const current = field.value ?? [];
                                const next = selected
                                ? current.filter((id: string) => id !== venue.id)
                                : [...current, venue.id];
                                field.onChange(next);
                            };

                            return (
                                <button
                                key={venue.id}
                                type="button"
                                onClick={toggle}
                                className={[
                                    "flex w-full items-center px-3 py-2 text-left text-sm transition-colors",
                                    selected
                                    ? "bg-accent/40 text-foreground"
                                    : "bg-background hover:bg-muted/60",
                                ].join(" ")}
                                >
                                {venue.name}
                                </button>
                            );
                            })}
                        </div>
                        </div>

                        {/* hidden inputs so FormData includes venue_ids[] */}
                        {(field.value ?? []).map((id: string) => (
                        <input key={id} type="hidden" name="venue_ids" value={id} />
                        ))}
                    </>
                    )}
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <div className="flex gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : isEdit ? "Update event" : "Create event"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <a href="/dashboard">Cancel</a>
          </Button>
        </div>
      </form>
    </Form>
  );
}
