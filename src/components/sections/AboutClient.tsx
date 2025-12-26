'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';
import styles from './About.module.css';
import {
    MapPin,
    GraduationCap,
    Award,
    Calendar,
    Download,
    Code,
    Database,
    Shield,
    Globe,
    Cpu
} from 'lucide-react';
import { RippleButton } from '@/components/ui/RippleButton';

interface AboutClientProps {
    content: {
        title: string;
        bio: string;
    };
    education: Array<{
        year: string;
        title: string;
        provider: string;
        desc: string;
        type: 'education' | 'experience';
    }>;
}

const STATS = [
    { label: 'Years Coding', value: '3+', icon: <Code size={20} /> },
    { label: 'Projects', value: '25+', icon: <Globe size={20} /> },
    { label: 'Tech Stack', value: '15+', icon: <Cpu size={20} /> },
    { label: 'Certificates', value: '10+', icon: <Award size={20} /> },
];

const MILESTONES = [
    { label: 'Start', percent: 0 },
    { label: 'Year 1', percent: 25 },
    { label: 'Year 2', percent: 50 },
    { label: 'Current', percent: 60 },
    { label: 'Year 4', percent: 100 },
];

const CURRENT_LEARNING = [
    { name: 'Advanced Cloud Security', icon: <Shield size={14} /> },
    { name: 'Next.js 14 / App Router', icon: <Code size={14} /> },
    { name: 'PostgreSQL & Backend Opt', icon: <Database size={14} /> },
];

export default function AboutClient({ content, education }: AboutClientProps) {
    const containerRef = useRef(null);
    const timelineRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ["start end", "end center"]
    });

    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    // Split bio into paragraphs
    const bioParagraphs = content.bio.split('\n').filter(p => p.trim() !== '');

    return (
        <section id="about" className={styles.section} ref={containerRef}>
            <div className="mesh-gradient" />
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.stickySide}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className={styles.location}
                        >
                            <div className={styles.pinPulse} />
                            <MapPin size={14} />
                            <span>Mardan, Pakistan</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={styles.title}
                        >
                            {content.title}
                        </motion.h2>

                        <div className={styles.bioContainer}>
                            {bioParagraphs.map((para, i) => (
                                <motion.p
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className={styles.text}
                                >
                                    {para}
                                </motion.p>
                            ))}
                        </div>

                        {/* Stats Grid */}
                        <div className={styles.statsGrid}>
                            {STATS.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className={styles.statCard}
                                >
                                    <div className={styles.statIcon}>{stat.icon}</div>
                                    <div className={styles.statValue}>{stat.value}</div>
                                    <div className={styles.statLabel}>{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Progress Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={styles.progressCard}
                        >
                            <div className={styles.progressHeader}>
                                <div className="flex items-center gap-4">
                                    <GraduationCap size={18} className="text-primary" />
                                    <span className={styles.progressLabel}>Degree Progress</span>
                                </div>
                                <motion.span
                                    className={styles.progressPercent}
                                    initial={{ scale: 1 }}
                                    whileInView={{ scale: [1, 1.2, 1] }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 1.5, duration: 0.5 }}
                                >
                                    60%
                                </motion.span>
                            </div>

                            <div className={styles.progressBarWrapper}>
                                <div className={styles.progressBarContainer}>
                                    <motion.div
                                        className={styles.progressBar}
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '60%' }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                    />

                                    {/* Milestone Markers */}
                                    {MILESTONES.map((m, i) => (
                                        <div
                                            key={i}
                                            className={styles.milestone}
                                            style={{ left: `${m.percent}%` }}
                                        >
                                            <span className={styles.milestoneLabel}>{m.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.progressInfo}>
                                <div className={styles.infoItem}>
                                    <span className="font-bold text-foreground">5th Semester</span>
                                    <span className="text-[10px] uppercase tracking-wider opacity-50">Current Status</span>
                                </div>
                                <div className={`${styles.infoItem} text-right items-end`}>
                                    <span className="font-bold text-foreground italic">June 2027</span>
                                    <span className="text-[10px] uppercase tracking-wider opacity-50">Est. Graduation</span>
                                </div>
                            </div>
                        </motion.div>

                        <div className="flex flex-wrap items-center gap-8 mt-48">
                            <RippleButton href="/resume.pdf" className={`btn btn-gradient ${styles.downloadButton}`}>
                                <Download size={16} />
                                Download Full CV
                            </RippleButton>

                            <div className={styles.learningBadge}>
                                <span className={styles.learningDot} />
                                <span className="font-mono">Learning: Next.js 14 Architecture</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.timeline} ref={timelineRef}>
                        <h3 className={styles.timelineHeading}>Education & Journey</h3>

                        <div className={styles.timelineContent}>
                            {/* Animated Connecting Line */}
                            <motion.div
                                className={styles.timelineLine}
                                style={{ height: lineHeight }}
                            />

                            {education.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2 }}
                                    className={`${styles.timelineItem} ${item.type === 'education' ? styles.educationType : styles.experienceType}`}
                                >
                                    <div className={styles.timelineMarker}>
                                        {item.type === 'education' ? <GraduationCap size={14} /> : <Award size={14} />}
                                    </div>

                                    <div className={styles.timelineContentCard}>
                                        <div className={styles.timeWrapper}>
                                            <Calendar size={12} />
                                            <span className={styles.time}>{item.year}</span>
                                        </div>
                                        <h4 className={styles.itemTitle}>{item.title}</h4>
                                        <p className={styles.provider}>{item.provider}</p>
                                        <p className={styles.itemDesc}>{item.desc}</p>

                                        {i === 0 && (
                                            <div className={styles.currentBadge}>
                                                Ongoing
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Currently Learning Section */}
                        <div className={styles.learningSection}>
                            <h4 className="text-sm font-mono uppercase tracking-[0.2em] opacity-40 mb-6">Deep Dive Focus</h4>
                            <div className="flex flex-col gap-3">
                                {CURRENT_LEARNING.map((tech, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.5 + i * 0.1 }}
                                        className={styles.learningItem}
                                    >
                                        <span className={styles.learningIcon}>{tech.icon}</span>
                                        <span className="text-sm">{tech.name}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
