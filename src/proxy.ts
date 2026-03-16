import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

const protectedPaths = ["/dashboard", "/events", "/venues"];
const authPaths = ["/login", "/signup"];

function isProtected(pathname: string) {
    return protectedPaths.some(
        (p) => pathname === p || pathname.startsWith(p + "/")
    );
}

function isAuthPath(pathname: string) {
    return authPaths.some((p) => pathname.startsWith(p));
}

export async function proxy(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    if (!supabaseUrl || !supabaseKey) {
        return response;
    }

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) =>
                    response.cookies.set(name, value, options)
                );
            },
        },
    });

    // Handle OAuth callback: exchange `code` for a session and strip it from the URL
    const code = request.nextUrl.searchParams.get("code");

    if (code) {
        await supabase.auth.exchangeCodeForSession(code);

        const redirectUrl = request.nextUrl.clone();
        redirectUrl.searchParams.delete("code");

        return NextResponse.redirect(redirectUrl, {
            headers: response.headers,
        });
    }

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (isProtected(request.nextUrl.pathname) && !user) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    if (isAuthPath(request.nextUrl.pathname) && user) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    return response;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};

