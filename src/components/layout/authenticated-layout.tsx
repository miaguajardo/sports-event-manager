import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/auth/actions";

export async function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-10 border-b bg-background">
                <div className="flex h-14 items-center justify-between px-6">
                    <nav className="flex items-center gap-6">
                        <Link href="/dashboard" className="font-semibold">
                            Sports Events
                        </Link>
                        <Link href="/events/new" className="text-muted-foreground hover:text-foreground text-sm">
                            New Event
                        </Link>
                        <Link href="/venues" className="text-muted-foreground hover:text-foreground text-sm">
                            Venues
                        </Link>
                    </nav>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">{user.email}</span>
                        <form action={logout}>
                            <Button type="submit" variant="ghost" size="sm">
                                Logout
                            </Button>
                        </form>
                    </div>
                </div>
            </header>
            <main className="flex-1 px-4 py-6">{children}</main>
        </div>
    );
}
