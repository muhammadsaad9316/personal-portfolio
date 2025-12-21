'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollFadeProps {
    children: React.ReactNode;
    fadeStart?: number; // scroll progress where fade starts (0-1)
    fadeEnd?: number; // scroll progress where fade ends (0-1)
}

export const ScrollFade = ({
    children,
    fadeStart = 0,
    fadeEnd = 0.3
}: ScrollFadeProps) => {
    const ref = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const opacity = useTransform(
        scrollYProgress,
        [fadeStart, fadeEnd],
        [1, 0]
    );

    const y = useTransform(
        scrollYProgress,
        [fadeStart, fadeEnd],
        [0, -50]
    );

    return (
        <motion.div ref={ref} style={{ opacity, y }}>
            {children}
        </motion.div>
    );
};
