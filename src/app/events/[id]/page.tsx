import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvent } from "@/app/events/queries";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = { params: Promise<{ id: string }> };

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) notFound();

  // Check if the current user is the owner of the event
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = user?.id === event.user_id;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">← Back to events</Link>
        </Button>
        {isOwner && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/events/${id}/edit`}>Edit</Link>
          </Button>
        )}
      </div>

      <Card className="border bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-2xl uppercase font-bold">
            {event.name}
          </CardTitle>
          <CardDescription>
            {event.sport_type}
            {event.venues?.length
              ? ` · ${event.venues.map((v) => v.name).join(", ")}`
              : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {new Date(event.start_at).toLocaleString(undefined, {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </p>
          {event.description?.trim() ? (
            <div className="rounded-lg border border-border/50 bg-zinc-950/50 p-4">
              <h3 className="mb-2 text-sm font-medium text-foreground">
                Description
              </h3>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {event.description}
              </p>
            </div>
          ) : (
            <p className="text-sm italic text-muted-foreground">
              No description added.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
