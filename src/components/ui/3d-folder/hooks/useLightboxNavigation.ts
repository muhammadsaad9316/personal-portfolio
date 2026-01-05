import { useState, useEffect, useCallback } from 'react';

interface UseLightboxNavigationProps {
    currentIndex: number;
    totalCount: number;
    isOpen: boolean;
    onNavigate: (index: number) => void;
}

export function useLightboxNavigation({ currentIndex, totalCount, isOpen, onNavigate }: UseLightboxNavigationProps) {
    const [internalIndex, setInternalIndex] = useState(currentIndex);
    const [isSliding, setIsSliding] = useState(false);

    const hasNext = internalIndex < totalCount - 1;
    const hasPrev = internalIndex > 0;

    useEffect(() => {
        if (isOpen && currentIndex !== internalIndex && !isSliding) {
            setIsSliding(true);
            const timer = setTimeout(() => {
                setInternalIndex(currentIndex);
                setIsSliding(false);
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, isOpen, internalIndex, isSliding]);

    useEffect(() => {
        if (isOpen) {
            setInternalIndex(currentIndex);
            setIsSliding(false);
        }
    }, [isOpen, currentIndex]);

    const navigateNext = useCallback(() => {
        if (internalIndex >= totalCount - 1 || isSliding) return;
        onNavigate(internalIndex + 1);
    }, [internalIndex, totalCount, isSliding, onNavigate]);

    const navigatePrev = useCallback(() => {
        if (internalIndex <= 0 || isSliding) return;
        onNavigate(internalIndex - 1);
    }, [internalIndex, isSliding, onNavigate]);

    const handleDotClick = useCallback((idx: number) => {
        if (isSliding || idx === internalIndex) return;
        onNavigate(idx);
    }, [isSliding, internalIndex, onNavigate]);

    return {
        internalIndex,
        isSliding,
        hasNext,
        hasPrev,
        navigateNext,
        navigatePrev,
        handleDotClick,
    };
}
