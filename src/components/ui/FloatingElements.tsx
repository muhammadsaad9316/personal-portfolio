'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { shouldAnimate } from '@/lib/animation-budget';

const Shape = ({ delay = 0, size = 100, top = '10%', left = '10%', speed = 0.2, type = 'circle', scrollY }: { delay?: number, size?: number, top?: string, left?: string, speed?: number, type?: string, scrollY: any }) => {

    // Safety check for scrollY to prevent errors if budget changes mid-session or race conditions
    const yValue = useTransform(scrollY || 0, [0, 5000], [0, size * 5 * speed]);

    return (
        <motion.div
            style={{
                position: 'absolute',
                top,
                left,
                width: size,
                height: size,
                borderRadius: type === 'circle' ? '50%' : '12px',
                border: '1px solid rgba(255, 255, 255, 0.03)',
                background: 'rgba(255, 255, 255, 0.01)',
                y: yValue,
                pointerEvents: 'none',
                zIndex: -1,
                rotate: delay * 10,
            }}
            animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
            }}
            transition={{
                rotate: { duration: 20 + delay, repeat: Infinity, ease: 'linear' },
                scale: { duration: 5, repeat: Infinity, ease: 'easeInOut' }
            }}
        />
    );
};

export const FloatingElements = () => {
    const { scrollY } = useScroll();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check budget on mount
        const canAnimate = shouldAnimate('decorative');
        setIsVisible(canAnimate);

        // Cleanup function (optional here since we just stop rendering, but good for future listeners)
        return () => {
            setIsVisible(false);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: -2 }}>
            <Shape size={300} top="15%" left="5%" speed={0.15} scrollY={scrollY} />
            <Shape size={200} top="40%" left="80%" speed={0.25} type="square" delay={2} scrollY={scrollY} />
            <Shape size={400} top="70%" left="10%" speed={0.1} delay={5} scrollY={scrollY} />
            <Shape size={150} top="85%" left="70%" speed={0.3} type="square" delay={1} scrollY={scrollY} />
            {/* Mesh Blobs */}
            <motion.div
                animate={{
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                }}
                transition={{ duration: 10, repeat: Infinity }}
                style={{
                    position: 'absolute',
                    top: '30%',
                    right: '15%',
                    width: 400,
                    height: 400,
                    background: 'var(--primary-glow)',
                    filter: 'blur(100px)',
                    opacity: 0.1,
                    borderRadius: '50%',
                }}
            />
        </div>
    );
};
