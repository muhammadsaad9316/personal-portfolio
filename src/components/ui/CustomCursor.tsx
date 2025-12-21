'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({
                x: e.clientX / 0.75,  // Compensate for body zoom: 0.75
                y: e.clientY / 0.75   // Compensate for body zoom: 0.75
            });
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if hovering over interactive elements
            if (target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'button' ||
                target.closest('a') ||
                target.closest('button')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    // Only show on desktop (coarse check)
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
        return null;
    }

    return (
        <motion.div
            style={{
                position: 'fixed',
                left: 0,
                top: 0,
                width: 32,
                height: 32,
                border: '1px solid var(--accent)',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 99999,
                mixBlendMode: 'difference' // Cool effect on text
            }}
            animate={{
                x: mousePosition.x - 16,
                y: mousePosition.y - 16,
                scale: isHovering ? 2.5 : 1,
                backgroundColor: isHovering ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                borderColor: isHovering ? 'transparent' : 'var(--accent)'
            }}
            transition={{
                type: "spring",
                stiffness: 150,
                damping: 15,
                mass: 0.1
            }}
        />
    );
};
