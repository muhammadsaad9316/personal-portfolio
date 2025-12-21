export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
            <div className="relative h-24 w-24">
                {/* Outer Glow */}
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />

                {/* Spinning Ring */}
                <div className="h-full w-full animate-spin rounded-full border-4 border-primary/20 border-t-primary" />

                {/* Center Pulse */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 animate-pulse rounded-full bg-primary shadow-[0_0_15px_rgba(144,137,252,0.5)]" />
                </div>
            </div>
        </div>
    );
}
