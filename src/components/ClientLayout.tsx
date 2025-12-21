'use client';

import dynamic from 'next/dynamic';

// Lazy load UI components that aren't critical for initial render
// These are desktop-only enhancements that can load after the main content
const CustomCursor = dynamic(() =>
    import('@/components/ui/CustomCursor').then(mod => ({ default: mod.CustomCursor })),
    { ssr: false }
);

const FloatingElements = dynamic(() =>
    import('@/components/ui/FloatingElements').then(mod => ({ default: mod.FloatingElements })),
    { ssr: false }
);

const Preloader = dynamic(() =>
    import('@/components/ui/Preloader').then(mod => ({ default: mod.Preloader })),
    { ssr: false }
);

export function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Preloader />
            <CustomCursor />
            <FloatingElements />
            {children}
        </>
    );
}
