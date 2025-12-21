import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, RateLimitPresets } from "@/lib/ratelimit";

import { authConfig } from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials, request) => {
                const email = credentials?.email as string;
                const password = credentials?.password as string;

                if (!email || !password) {
                    return null;
                }

                // Rate limiting (5 attempts per 15 minutes per IP)
                // Extract IP from request headers
                const forwardedFor = request.headers?.get('x-forwarded-for');
                const clientIp = forwardedFor
                    ? forwardedFor.split(',')[0].trim()
                    : request.headers?.get('x-real-ip') || 'unknown';

                const rateLimitResult = checkRateLimit(
                    `auth:${clientIp}`,
                    RateLimitPresets.authentication
                );

                if (!rateLimitResult.success) {
                    // Return null to indicate failed auth (NextAuth will show error)
                    console.warn(`Rate limit exceeded for IP: ${clientIp}`);
                    return null;
                }

                const user = await prisma.admin.findUnique({
                    where: {
                        email,
                    },
                });

                if (!user) {
                    return null;
                }

                const isPasswordValid = await compare(password, user.password);

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                };
            },
        }),
    ],
});
