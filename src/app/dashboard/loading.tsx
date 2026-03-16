import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
    return (
        <div className="space-y-6">
            <div className="h-9 w-48 animate-pulse rounded bg-muted" />
            <div className="flex gap-3">
                <div className="h-9 w-64 animate-pulse rounded bg-muted" />
                <div className="h-9 w-32 animate-pulse rounded bg-muted" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardHeader>
                            <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
