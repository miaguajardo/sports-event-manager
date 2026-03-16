import Link from "next/link";
import { getVenues } from "@/app/venues/queries";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function VenuesPage() {
  const result = await getVenues();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1>Venues</h1>
          <div className="mt-1 h-0.5 w-14 rounded-full bg-primary/70" />
          <p className="mt-2 text-muted-foreground text-sm">
            Manage your venues for events.
          </p>
        </div>
        <Button asChild>
          <Link href="/venues/new">Add venue</Link>
        </Button>
      </div>

      {!result.success ? (
        <p className="text-destructive">{result.message}</p>
      ) : result.data.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No venues yet.</p>
            <Button asChild className="mt-3">
              <Link href="/venues/new">Add your first venue</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.data.map((venue) => (
            <div key={venue.id} className="group relative h-full">
              <Card className="relative flex h-full flex-col overflow-visible border bg-zinc-900 transition-all duration-200 group-hover:border-accent/50 group-hover:ring-2 group-hover:ring-accent/20 group-hover:ring-offset-2 group-hover:ring-offset-background hover:bg-zinc-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{venue.name}</CardTitle>
                  <CardDescription>
                    {[venue.address, venue.city, venue.state, venue.country]
                      .filter(Boolean)
                      .join(", ") || "No address"}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
