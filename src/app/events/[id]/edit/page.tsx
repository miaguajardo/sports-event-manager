import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvent } from "@/app/events/queries";
import { getVenuesForCurrentUser } from "@/app/events/queries";
import { EventForm } from "@/app/events/event-form";
import { DeleteEventButton } from "@/app/events/delete-event-button";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ id: string }> };

export default async function EditEventPage({ params }: Props) {
  const { id } = await params;
  const [event, venuesResult] = await Promise.all([
    getEvent(id),
    getVenuesForCurrentUser(),
  ]);
  if (!event) notFound();
  const venues = venuesResult.success ? venuesResult.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">← Back</Link>
        </Button>
        <DeleteEventButton eventId={id} />
      </div>
      <h1 className="text-2xl font-semibold">Edit event</h1>
      <EventForm event={event} venues={venues} />
    </div>
  );
}
