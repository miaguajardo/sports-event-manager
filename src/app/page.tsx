import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/dashboard");
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-2xl font-semibold">Sports Event Manager</h1>
      <p className="text-muted-foreground text-center max-w-md">
        Create and manage sports events with venues. Sign in to get started.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/login">Sign in</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/signup">Sign up</Link>
        </Button>
      </div>
    </div>
  );
}
