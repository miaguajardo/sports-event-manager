import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error(
        "Missing Supabase env: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_KEY"
    );
}

/**
 * Creates a Supabase client for server-side use
 * Uses cookies for auth; call once per request context
 */
export async function createClient() {
    const cookieStore = await cookies();
    return createServerClient(supabaseUrl!, supabaseKey!, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                } catch {
                    // Called from a Server Component; middleware will refresh session
                }
            },
        },
    });
}
