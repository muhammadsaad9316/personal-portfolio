import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { nextUrl } = req;

    // Define paths
    const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth');
    const isAuthRoute = nextUrl.pathname.startsWith('/admin/login');
    const isAdminRoute = nextUrl.pathname.startsWith('/admin');

    if (isApiAuthRoute) {
        return; // Don't block API routes
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
        }
        return;
    }

    if (isAdminRoute && !isLoggedIn) {
        // Redirect to login but keep the intended URL
        const callbackUrl = nextUrl.pathname;
        if (callbackUrl !== "/admin/login") {
            return NextResponse.redirect(new URL(`/admin/login?callbackUrl=${encodeURIComponent(callbackUrl)}`, nextUrl));
        }
        return NextResponse.redirect(new URL("/admin/login", nextUrl));
    }

    return;
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
