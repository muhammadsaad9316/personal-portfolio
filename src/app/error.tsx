'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Root Error Boundary:', error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
            <div className="relative mb-8 h-24 w-24">
                <div className="absolute inset-0 animate-ping rounded-full bg-red-500/10" />
                <div className="flex h-full w-full items-center justify-center rounded-full bg-red-500/10 text-red-500">
                    <AlertCircle size={48} />
                </div>
            </div>

            <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Something went wrong!
            </h1>
            <p className="mb-8 max-w-md text-muted-foreground">
                We encountered an unexpected error. Don't worry, it's not your fault.
                Our team has been notified (if this were a real app!).
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                    onClick={() => reset()}
                    className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:scale-105 active:scale-95"
                >
                    <RefreshCw size={18} />
                    Try again
                </button>

                <Link
                    href="/"
                    className="flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-medium text-card-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                >
                    <Home size={18} />
                    Go Home
                </Link>
            </div>

            {error.digest && (
                <p className="mt-8 text-xs font-mono text-muted-foreground/50">
                    Error ID: {error.digest}
                </p>
            )}
        </div>
    );
}
