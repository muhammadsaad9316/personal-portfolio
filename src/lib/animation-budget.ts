
export type AnimationBudget = 'full' | 'reduced' | 'minimal' | 'none';

export const getAnimationBudget = (): AnimationBudget => {
    if (typeof window === 'undefined') return 'full';

    // Check for reduced motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return 'none';

    // Simple mobile detection
    const isMobile = window.innerWidth < 768;

    // Hardware concurrency check (heuristic for low-end devices)
    // logicalProcessors is strictly not available on all browsers/types, so we cast to any or use explicit check if needed in strict TS
    // navigator.hardwareConcurrency is standard
    const isLowEnd = (navigator.hardwareConcurrency || 4) <= 4;

    if (isMobile && isLowEnd) return 'minimal';
    if (isMobile) return 'reduced';

    return 'full';
};

export const shouldAnimate = (priority: 'critical' | 'standard' | 'decorative') => {
    const budget = getAnimationBudget();

    if (budget === 'none') return false;

    if (budget === 'minimal') {
        return priority === 'critical';
    }

    if (budget === 'reduced') {
        return priority !== 'decorative';
    }

    return true;
};
