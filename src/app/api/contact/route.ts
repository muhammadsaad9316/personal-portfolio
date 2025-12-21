import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIp, RateLimitPresets } from '@/lib/ratelimit';

/**
 * Verify Cloudflare Turnstile token
 * @param token - The token from the client-side Turnstile widget
 * @returns Promise<boolean> - True if token is valid
 */
async function verifyTurnstile(token: string): Promise<{ success: boolean; errorCodes?: string[] }> {
    try {
        let secretKey = process.env.TURNSTILE_SECRET_KEY;
        const TESTING_SECRET_KEY = '1x0000000000000000000000000000000AA';

        // Robust fallback: Use testing key if env var is missing or looks like a placeholder
        if (!secretKey || secretKey === '' || secretKey.length < 10) {
            console.warn('Turnstile: Using TESTING_SECRET_KEY because env var is missing or invalid.');
            secretKey = TESTING_SECRET_KEY;
        }

        console.log(`Turnstile: Verifying with secret starting with: ${secretKey.substring(0, 5)}...`);

        const response = await fetch(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    secret: secretKey,
                    response: token,
                }),
            }
        );

        const data = await response.json();
        console.log('Turnstile Verification Response:', data); // DEBUG LOG

        return {
            success: data.success === true,
            errorCodes: data['error-codes']
        };
    } catch (error) {
        console.error('Turnstile verification error:', error);
        return { success: false, errorCodes: ['network-error'] };
    }
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * POST /api/contact
 * Submit a contact form message with bot protection and rate limiting
 */
export async function POST(req: Request) {
    try {
        // Rate limiting check (5 requests per 15 minutes)
        const clientIp = getClientIp(req);
        const rateLimitResult = checkRateLimit(clientIp, RateLimitPresets.contactForm);

        if (!rateLimitResult.success) {
            const retryAfter = Math.ceil(rateLimitResult.resetIn / 1000); // Convert to seconds
            return NextResponse.json(
                {
                    error: 'Too many requests. Please try again later.',
                    retryAfter,
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': retryAfter.toString(),
                        'X-RateLimit-Limit': RateLimitPresets.contactForm.maxRequests.toString(),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': new Date(Date.now() + rateLimitResult.resetIn).toISOString(),
                    },
                }
            );
        }

        const { name, email, subject, message, turnstileToken } = await req.json();

        // Validate Turnstile token first
        if (!turnstileToken) {
            return NextResponse.json(
                { error: 'Bot verification is required' },
                { status: 400 }
            );
        }

        const verificationResult = await verifyTurnstile(turnstileToken);
        if (!verificationResult.success) {
            return NextResponse.json(
                { error: `Bot verification failed. Codes: ${JSON.stringify(verificationResult.errorCodes || [])}` },
                { status: 403 }
            );
        }

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required' },
                { status: 400 }
            );
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return NextResponse.json(
                { error: 'Please provide a valid email address' },
                { status: 400 }
            );
        }

        // Validate field lengths
        if (name.length > 100) {
            return NextResponse.json(
                { error: 'Name must be less than 100 characters' },
                { status: 400 }
            );
        }

        if (email.length > 100) {
            return NextResponse.json(
                { error: 'Email must be less than 100 characters' },
                { status: 400 }
            );
        }

        if (message.length > 5000) {
            return NextResponse.json(
                { error: 'Message must be less than 5000 characters' },
                { status: 400 }
            );
        }

        // Sanitize inputs (trim whitespace)
        const sanitizedName = name.trim();
        const sanitizedEmail = email.trim().toLowerCase();
        const sanitizedSubject = subject ? subject.trim() : 'No Subject';
        const sanitizedMessage = message.trim();

        // Save to database
        await prisma.message.create({
            data: {
                name: sanitizedName,
                email: sanitizedEmail,
                subject: sanitizedSubject,
                message: sanitizedMessage
            }
        });

        return NextResponse.json(
            { success: true, message: 'Message sent successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Contact Form Error:', error);
        return NextResponse.json(
            { error: 'Failed to send message. Please try again later.' },
            { status: 500 }
        );
    }
}
