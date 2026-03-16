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

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Events</h1>
                    <p className="text-muted-foreground text-sm">
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
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {result.data.map((event) => (
                        <div key={event.id} className="group relative">
                            <Card className="relative flex flex-col overflow-visible border bg-zinc-900 transition-all duration-200 group-hover:border-accent/50 group-hover:ring-2 group-hover:ring-accent/20 group-hover:ring-offset-2 group-hover:ring-offset-background hover:bg-zinc-900">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg uppercase font-bold">
                                    <Link
                                        href={`/events/${event.id}/edit`}
                                        className="hover:underline"
                                    >
                                        {event.name}
                                    </Link>
                                </CardTitle>
                                <CardDescription>
                                    {event.sport_type}
                                    {event.venues?.length
                                        ? ` · ${event.venues.map((v) => v.name).join(", ")}`
                                        : ""}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 pt-0">
                                <p className="text-sm text-muted-foreground">
                                    {new Date(event.start_at).toLocaleString(undefined, {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    })}
                                </p>
                            </CardContent>
                            <CardContent className="flex gap-2 pt-0">
                                {/* TODO: Think I want to remove the edit button */}
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/events/${event.id}/edit`}>Edit</Link>
                                </Button>
                            </CardContent>
                        </Card>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
