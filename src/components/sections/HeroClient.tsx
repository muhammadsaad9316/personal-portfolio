'use client';

import styles from './Hero.module.css';
import { Reveal } from '@/components/ui/Reveal';
import { RippleButton } from '@/components/ui/RippleButton';
import { ScrollFade } from '@/components/ui/ScrollFade';
import { ArrowRight, Download, Briefcase } from 'lucide-react';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect, useMemo } from 'react';
import { useInterval } from '@/hooks/useInterval';

const SUBTITLE_PHRASES = [
    "Computer Science Student",
    "Full Stack Developer",
    "Cybersecurity Enthusiast",
    "Problem Solver"
];

export default function HeroClient({ content }: { content: any }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    // Parallax effect: glow moves slower (0.5x speed)
    const glowY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

    // Rotating text state
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

    useInterval(() => {
        setCurrentPhraseIndex((prev) => (prev + 1) % SUBTITLE_PHRASES.length);
    }, 5000); // Changed from 3000ms to 5000ms for more reading time

    // Generate orbs data (memoized for stable references)
    const orbs = useMemo(() => [
        { size: 400, left: '10%', top: '20%', color: 'var(--primary-glow)', duration: 20 },
        { size: 350, left: '80%', top: '30%', color: 'var(--secondary-glow)', duration: 25 },
        { size: 300, left: '60%', top: '60%', color: 'var(--accent-glow)', duration: 22 },
        { size: 250, left: '30%', top: '70%', color: 'var(--primary-glow)', duration: 18 },
    ], []);

    // Generate particles data on client-side only to avoid hydration mismatch
    const [particles, setParticles] = useState<Array<{
        left: string;
        top: string;
        delay: number;
        duration: number;
    }>>([]);

    useEffect(() => {
        // Generate particles only on client side after mount
        setParticles(
            Array.from({ length: 15 }, (_, i) => ({
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                delay: i * 0.5,
                duration: 10 + Math.random() * 10
            }))
        );
    }, []);

    // Smooth scroll to projects
    const scrollToProjects = () => {
        const projectsSection = document.getElementById('projects');
        projectsSection?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section ref={ref} className={styles.hero}>
            <motion.div
                className={styles.heroGlow}
                style={{ y: glowY }}
            />

            {/* Animated Orbs */}
            {orbs.map((orb, i) => (
                <motion.div
                    key={i}
                    className={styles.orb}
                    style={{
                        width: orb.size,
                        height: orb.size,
                        left: orb.left,
                        top: orb.top,
                        background: `radial-gradient(circle, ${orb.color}, transparent)`,
                    }}
                    animate={{
                        x: [0, 50, -30, 0],
                        y: [0, -40, 30, 0],
                    }}
                    transition={{
                        duration: orb.duration,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            ))}

            {/* Floating Particles */}
            {particles.map((particle, i) => (
                <motion.div
                    key={i}
                    className={styles.particle}
                    style={{
                        left: particle.left,
                        top: particle.top,
                    }}
                    animate={{
                        x: [0, 20, -15, 0],
                        y: [0, -30, 20, 0],
                        opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        delay: particle.delay,
                        ease: "easeInOut"
                    }}
                />
            ))}

            {/* Scanner Line */}
            <div className={styles.scanner} />

            <div className="container">
                <ScrollFade fadeEnd={0.4}>
                    <div className={styles.content}>
                        <Reveal>
                            <div className={styles.status}>
                                <span className={styles.statusDot}></span>
                                Available for new projects
                            </div>
                        </Reveal>

                        <h1 className={styles.title}>
                            <Reveal delay={0.1}>
                                {content.title.split(' ').map((word: string, i: number) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                                        style={{ display: 'inline-block', marginRight: '0.3em' }}
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </Reveal>
                            <span className={`${styles.highlight} mt-0 mb-0 leading-tight`}>
                                <span className={styles.textWrapper}>
                                    <span className={`${styles.textPlaceholder} leading-tight`} aria-hidden="true">
                                        Cybersecurity Enthusiast
                                    </span>
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={currentPhraseIndex}
                                            className={`${styles.rotatingText} absolute top-0 left-0 bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent leading-tight`}
                                            initial={{ opacity: 0 }}
                                            animate={{
                                                opacity: 1,
                                                transition: { duration: 0.5 }
                                            }}
                                            exit={{ opacity: 0 }}
                                        >
                                            {SUBTITLE_PHRASES[currentPhraseIndex]}
                                        </motion.span>
                                    </AnimatePresence>
                                </span>
                            </span>
                        </h1>

                        <Reveal delay={0.5}>
                            <p className={styles.subtitle}>
                                {content.description}
                            </p>
                        </Reveal>

                        <Reveal delay={0.6}>
                            <div className={styles.actions}>
                                <RippleButton href="#contact" className="btn btn-cyan">
                                    Hire Me
                                    <motion.span
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        style={{ display: 'inline-flex' }}
                                    >
                                        <ArrowRight size={18} />
                                    </motion.span>
                                </RippleButton>
                                <RippleButton href="/resume.pdf" className="btn btn-secondary">
                                    Download CV
                                    <motion.span
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        style={{ display: 'inline-flex' }}
                                    >
                                        <Download size={18} />
                                    </motion.span>
                                </RippleButton>
                                <RippleButton onClick={scrollToProjects} className="btn btn-outline">
                                    View Work
                                    <Briefcase size={18} />
                                </RippleButton>
                            </div>
                        </Reveal>
                    </div>
                </ScrollFade>
            </div>
        </section>
    );
}
