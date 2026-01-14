import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/admin/login",
    },
    callbacks: {
        async session({ session, token }) {
            if (token?.sub && session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 2 * 60 * 60, // 2 hours (instead of default 30 days)
    },
    providers: [], // Providers are added in src/lib/auth.ts
} satisfies NextAuthConfig;
