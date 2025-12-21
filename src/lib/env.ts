/**
 * Environment Variable Validation
 * Validates required environment variables on application startup
 * Throws error if any required variables are missing
 */

function validateEnv() {
    const required = {
        DATABASE_URL: process.env.DATABASE_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    };

    const optional = {
        TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
        NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    };

    const missing: string[] = [];

    // Check required variables
    Object.entries(required).forEach(([key, value]) => {
        if (!value || value.trim() === '') {
            missing.push(key);
        }
    });

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables:\n${missing.map(key => `  - ${key}`).join('\n')}\n\n` +
            `Please add these to your .env file. See .env.example for reference.`
        );
    }

    // Warn about optional but recommended variables
    const missingOptional: string[] = [];
    Object.entries(optional).forEach(([key, value]) => {
        if (!value || value.trim() === '') {
            missingOptional.push(key);
        }
    });

    if (missingOptional.length > 0 && process.env.NODE_ENV === 'production') {
        console.warn(
            `⚠️  Missing optional environment variables (recommended for production):\n${missingOptional.map(key => `  - ${key}`).join('\n')}`
        );
    }
}

// Run validation only in server environment
if (typeof window === 'undefined') {
    try {
        validateEnv();
        console.log('✅ Environment variables validated successfully');
    } catch (error) {
        console.error('❌ Environment validation failed:');
        console.error(error);
        // In production, this error should cause the app to not start
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
}

export const env = {
    DATABASE_URL: process.env.DATABASE_URL!,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
    NODE_ENV: process.env.NODE_ENV || 'development',
    // Optional
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
} as const;
