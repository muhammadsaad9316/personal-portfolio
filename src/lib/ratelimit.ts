/**
 * In-Memory Rate Limiter
 * 
 * Simple IP-based rate limiting for API routes.
 * Suitable for single-instance deployments with SQLite.
 * 
 * For production with multiple instances, consider:
 * - Upstash Redis (@upstash/ratelimit)
 * - Vercel KV
 * - Database-backed rate limiting
 */

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

// Store rate limit data: IP -> Entry
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 30 minutes to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitStore.entries()) {
        if (now > entry.resetAt) {
            rateLimitStore.delete(ip);
        }
    }
}, 30 * 60 * 1000); // 30 minutes

export interface RateLimitConfig {
    /**
     * Maximum number of requests allowed in the time window
     */
    maxRequests: number;

    /**
     * Time window in milliseconds
     */
    windowMs: number;
}

export interface RateLimitResult {
    /**
     * Whether the request is allowed
     */
    success: boolean;

    /**
     * Number of requests remaining in the current window
     */
    remaining: number;

    /**
     * Time in milliseconds until the rate limit resets
     */
    resetIn: number;
}

/**
 * Check if a request from the given identifier is allowed
 * 
 * @param identifier - Unique identifier (typically IP address)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig
): RateLimitResult {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    // No previous requests or window expired
    if (!entry || now > entry.resetAt) {
        rateLimitStore.set(identifier, {
            count: 1,
            resetAt: now + config.windowMs,
        });
        return {
            success: true,
            remaining: config.maxRequests - 1,
            resetIn: config.windowMs,
        };
    }

    // Within the time window
    if (entry.count < config.maxRequests) {
        entry.count++;
        return {
            success: true,
            remaining: config.maxRequests - entry.count,
            resetIn: entry.resetAt - now,
        };
    }

    // Rate limit exceeded
    return {
        success: false,
        remaining: 0,
        resetIn: entry.resetAt - now,
    };
}

/**
 * Extract client IP from Next.js request
 * Handles proxies and forwarded headers
 * 
 * @param request - Next.js Request object
 * @returns Client IP address or 'unknown'
 */
export function getClientIp(request: Request): string {
    // Try various headers in order of preference
    const headers = request.headers;

    const forwardedFor = headers.get('x-forwarded-for');
    if (forwardedFor) {
        // x-forwarded-for can contain multiple IPs, take the first one
        return forwardedFor.split(',')[0].trim();
    }

    const realIp = headers.get('x-real-ip');
    if (realIp) {
        return realIp.trim();
    }

    const cfConnectingIp = headers.get('cf-connecting-ip'); // Cloudflare
    if (cfConnectingIp) {
        return cfConnectingIp.trim();
    }

    // Fallback for development/testing
    return 'unknown';
}

/**
 * Pre-configured rate limiters for common use cases
 */
export const RateLimitPresets = {
    /**
     * Contact form: 5 requests per 15 minutes
     */
    contactForm: {
        maxRequests: 5,
        windowMs: 15 * 60 * 1000, // 15 minutes
    },

    /**
     * Authentication: 5 attempts per 15 minutes
     */
    authentication: {
        maxRequests: 5,
        windowMs: 15 * 60 * 1000, // 15 minutes
    },

    /**
     * Strict: 3 requests per 5 minutes
     */
    strict: {
        maxRequests: 3,
        windowMs: 5 * 60 * 1000, // 5 minutes
    },

    /**
     * Lenient: 20 requests per 60 minutes
     */
    lenient: {
        maxRequests: 20,
        windowMs: 60 * 60 * 1000, // 60 minutes
    },
} as const;
