import { handlers } from "@/lib/auth";

// Force Node.js runtime (required for Prisma, bcrypt, and rate limiting)
// NextAuth v5 middleware uses Edge Runtime, but the auth route needs Node.js
export const runtime = 'nodejs';

export const { GET, POST } = handlers;
