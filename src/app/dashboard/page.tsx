import Link from "next/link";
import { getEventsForDashboard } from "@/app/dashboard/actions";
import { SearchFilter } from "@/app/dashboard/search-filter";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type Props = {
    searchParams: Promise<{ q?: string; sport?: string }>;
};

export default async function DashboardPage({ searchParams }: Props) {
    const { q, sport } = await searchParams;
    const result = await getEventsForDashboard(q, sport);

    const now = new Date();

    const upcomingEvents =
        result.success
            ? result.data.filter(
                  (event) => new Date(event.start_at).getTime() >= now.getTime()
              )
            : [];

    const pastEvents =
        result.success
            ? result.data.filter(
                  (event) => new Date(event.start_at).getTime() < now.getTime()
              )
            : [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1>Events</h1>
                    <div className="mt-1 h-0.5 w-14 rounded-full bg-primary/70" />
                    <p className="mt-2 text-muted-foreground text-sm">
                        View and manage your sports events.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/events/new">Create Event</Link>
                </Button>
            </div>

            <SearchFilter />

            {!result.success ? (
                <p className="text-destructive">{result.message}</p>
            ) : result.data.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <p className="text-muted-foreground">No events yet.</p>
                        <Button asChild className="mt-3">
                            <Link href="/events/new">Create your first event</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-8">
                    {upcomingEvents.length > 0 && (
                        <section className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Upcoming Events</h2>
                                <p className="text-xs text-muted-foreground">
                                    {upcomingEvents.length}{" "}
                                    {upcomingEvents.length === 1 ? "event" : "events"}
                                </p>
                            </div>
                            <div className="relative -mx-4 overflow-x-auto pt-2 pb-4 sm:mx-0">
                                <div className="flex gap-4 px-4 sm:px-0">
                                    {upcomingEvents.map((event) => (
                                        <div
                                            key={event.id}
                                            className="group relative w-72 shrink-0"
                                        >
                                            <Card className="relative flex flex-col h-full overflow-visible border bg-zinc-900 transition-all duration-200 group-hover:border-accent/50 group-hover:ring-2 group-hover:ring-accent/20 group-hover:ring-offset-2 group-hover:ring-offset-background hover:bg-zinc-900">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-lg uppercase font-bold">
                                                        <Link
                                                            href={`/events/${event.id}`}
                                                            className="hover:underline"
                                                        >
                                                            {event.name}
                                                        </Link>
                                                    </CardTitle>
                                                    <CardDescription>
                                                        {event.sport_type}
                                                        {event.venues?.length
                                                            ? ` · ${event.venues
                                                                  .map((v) => v.name)
                                                                  .join(", ")}`
                                                            : ""}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="pt-0 mt-auto">
                                                    <p className="text-sm text-muted-foreground">
                                                        {new Date(
                                                            event.start_at
                                                        ).toLocaleString(undefined, {
                                                            dateStyle: "medium",
                                                            timeStyle: "short",
                                                        })}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {pastEvents.length > 0 && (
                        <section className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Past Events</h2>
                                <p className="text-xs text-muted-foreground">
                                    {pastEvents.length}{" "}
                                    {pastEvents.length === 1 ? "event" : "events"}
                                </p>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {pastEvents.map((event) => (
                                    <div key={event.id} className="group relative h-full">
                                        <Card className="relative flex h-full flex-col overflow-visible border bg-zinc-900 transition-all duration-200 group-hover:border-accent/50 group-hover:ring-2 group-hover:ring-accent/20 group-hover:ring-offset-2 group-hover:ring-offset-background hover:bg-zinc-900">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-lg uppercase font-bold">
                                                    <Link
                                                        href={`/events/${event.id}`}
                                                        className="hover:underline"
                                                    >
                                                        {event.name}
                                                    </Link>
                                                </CardTitle>
                                                <CardDescription>
                                                    {event.sport_type}
                                                    {event.venues?.length
                                                        ? ` · ${event.venues
                                                              .map((v) => v.name)
                                                              .join(", ")}`
                                                        : ""}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="pt-0 mt-auto">
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(
                                                        event.start_at
                                                    ).toLocaleString(undefined, {
                                                        dateStyle: "medium",
                                                        timeStyle: "short",
                                                    })}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}
