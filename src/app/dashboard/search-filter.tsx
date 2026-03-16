"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SPORT_TYPES } from "@/types/database";

export function SearchFilter() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") ?? "";
    const sport = searchParams.get("sport") ?? "";

    return (
        <form method="get" action="/dashboard" className="flex flex-wrap items-center gap-3">
            <Input
                name="q"
                placeholder="Search by name…"
                defaultValue={query}
                className="max-w-xs bg-zinc-900"
            />
            <select
                name="sport"
                defaultValue={sport}
                className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                onChange={(e) => e.currentTarget.form?.requestSubmit()}
            >
                <option value="">All sports</option>
                {SPORT_TYPES.map((s) => (
                    <option key={s} value={s}>
                        {s}
                    </option>
                ))}
            </select>
            <Button type="submit" variant="secondary" size="sm">
                Search
            </Button>
        </form>
    );
}
