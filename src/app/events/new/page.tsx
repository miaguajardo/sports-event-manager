import Link from "next/link";
import { getVenuesForCurrentUser } from "@/app/events/queries";
import { EventForm } from "@/app/events/event-form";
import { Button } from "@/components/ui/button";

export default async function NewEventPage() {
  const venuesResult = await getVenuesForCurrentUser();
  const venues = venuesResult.success ? venuesResult.data : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">← Back</Link>
        </Button>
      </div>
      <h1 className="text-2xl font-semibold">Create event</h1>
      <EventForm venues={venues} />
    </div>
  );
}
