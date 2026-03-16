 "use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/auth/actions";
import { useState } from "react";

type Props = {
    email: string | null;
};

export function AuthHeader({ email }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-10 border-b bg-background">
            <div className="flex h-14 items-center justify-between px-4 sm:px-6">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="font-semibold">
                        Sports Events
                    </Link>
                    <nav className="hidden sm:flex items-center gap-6">
                        <Link
                            href="/events/new"
                            className="text-muted-foreground hover:text-foreground text-sm"
                        >
                            New Event
                        </Link>
                        <Link
                            href="/venues"
                            className="text-muted-foreground hover:text-foreground text-sm"
                        >
                            Venues
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-3">
                    <span className="hidden md:inline text-xs text-muted-foreground">
                        {email}
                    </span>
                    <form action={logout}>
                        <Button type="submit" variant="ghost" size="sm">
                            Logout
                        </Button>
                    </form>
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border border-transparent px-2 py-1 sm:hidden"
                        aria-label="Toggle navigation menu"
                        onClick={() => setOpen((prev) => !prev)}
                    >
                        <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            {open ? (
                                <>
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </>
                            ) : (
                                <>
                                    <line x1="4" y1="6" x2="20" y2="6" />
                                    <line x1="4" y1="12" x2="20" y2="12" />
                                    <line x1="4" y1="18" x2="20" y2="18" />
                                </>
                            )}
                        </svg>
                    </button>
                </div>
            </div>
            {open && (
                <div className="border-t bg-background px-4 pb-3 pt-2 sm:hidden">
                    <nav className="flex flex-col gap-2">
                        <Link
                            href="/events/new"
                            className="text-sm text-muted-foreground hover:text-foreground"
                            onClick={() => setOpen(false)}
                        >
                            New Event
                        </Link>
                        <Link
                            href="/venues"
                            className="text-sm text-muted-foreground hover:text-foreground"
                            onClick={() => setOpen(false)}
                        >
                            Venues
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}

