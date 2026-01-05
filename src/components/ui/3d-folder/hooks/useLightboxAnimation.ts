import { useState, useLayoutEffect, useCallback } from 'react';
import type { AnimationPhase } from '../types';

interface UseLightboxAnimationProps {
    isOpen: boolean;
    sourceRect: DOMRect | null;
    onCloseComplete?: () => void;
}

export function useLightboxAnimation({ isOpen, sourceRect, onCloseComplete }: UseLightboxAnimationProps) {
    const [animationPhase, setAnimationPhase] = useState<AnimationPhase>("initial");
    const [isClosing, setIsClosing] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    const handleClose = useCallback((onClose: () => void) => {
        setIsClosing(true);
        onClose();
        setTimeout(() => {
            setIsClosing(false);
            setShouldRender(false);
            setAnimationPhase("initial");
            onCloseComplete?.();
        }, 500);
    }, [onCloseComplete]);

    useLayoutEffect(() => {
        if (isOpen && sourceRect) {
            setShouldRender(true);
            setAnimationPhase("initial");
            setIsClosing(false);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setAnimationPhase("animating");
                });
            });
            const timer = setTimeout(() => {
                setAnimationPhase("complete");
            }, 700);
            return () => clearTimeout(timer);
        }
    }, [isOpen, sourceRect]);

    return {
        animationPhase,
        isClosing,
        shouldRender,
        handleClose,
    };
}
