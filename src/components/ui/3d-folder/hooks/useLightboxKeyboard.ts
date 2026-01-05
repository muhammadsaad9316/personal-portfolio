import { useEffect } from 'react';

interface UseLightboxKeyboardProps {
    isOpen: boolean;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}

export function useLightboxKeyboard({ isOpen, onClose, onNext, onPrev }: UseLightboxKeyboardProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") onNext();
            if (e.key === "ArrowLeft") onPrev();
        };

        window.addEventListener("keydown", handleKeyDown);

        if (isOpen) {
            document.body.style.overflow = "hidden";
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose, onNext, onPrev]);
}
