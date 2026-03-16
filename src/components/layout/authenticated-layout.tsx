import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AuthHeader } from "@/components/layout/auth-header";

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
            <AuthHeader email={user.email ?? null} />
            <main className="flex-1 px-4 py-6">{children}</main>
        </div>
    );
}
