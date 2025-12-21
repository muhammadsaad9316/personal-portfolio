'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface RippleButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    href?: string;
}

export const RippleButton = ({ children, className = '', onClick, href }: RippleButtonProps) => {
    const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newRipple = {
            x,
            y,
            id: Date.now(),
        };

        setRipples((prev) => [...prev, newRipple]);

        // Remove ripple after animation
        setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 600);

        if (onClick) onClick();
    };

    const Component = href ? 'a' : 'button';

    return (
        <Component
            className={className}
            onClick={handleClick as any}
            href={href}
            style={{ position: 'relative', overflow: 'hidden' }}
        >
            {children}
            {ripples.map((ripple) => (
                <motion.span
                    key={ripple.id}
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 4, opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{
                        position: 'absolute',
                        left: ripple.x,
                        top: ripple.y,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.6)',
                        pointerEvents: 'none',
                        transform: 'translate(-50%, -50%)',
                    }}
                />
            ))}
        </Component>
    );
};
