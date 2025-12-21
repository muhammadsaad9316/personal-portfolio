'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import styles from './Projects.module.css';
import { ExternalLink, Github, ChevronRight, Globe, Code, Shield, CheckCircle2, FlaskConical, Rocket } from 'lucide-react';
import { Magnetic } from '@/components/ui/Magnetic';
import type { SerializableProject } from '@/types/project';

const statusIcons: Record<string, any> = {
    'Live': Rocket,
    'In Development': FlaskConical,
    'Completed': CheckCircle2
};

export default function FeaturedProjectsClient({ projects }: { projects: SerializableProject[] }) {
    const [isGrayscale, setIsGrayscale] = useState(true);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);

    return (
        <section id="projects" className={`${styles.section} section-projects`}>
            <div className="mesh-gradient" />
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.sectionTitle}>Featured Projects</h2>
                    <div className={styles.controls}>
                        <button
                            onClick={() => setIsGrayscale(!isGrayscale)}
                            className={`${styles.toggleBtn} ${!isGrayscale ? styles.toggleActive : ''}`}
                        >
                            <span>{isGrayscale ? 'Grayscale' : 'Full Color'}</span>
                        </button>
                    </div>
                </div>

                <div className={styles.grid}>
                    {projects.map((project) => {
                        const caseStudy = project.caseStudy ? JSON.parse(project.caseStudy) : null;
                        const techIcons = project.technologies?.split(',') || [];
                        const StatusIcon = statusIcons[project.status] || CheckCircle2;

                        return (
                            <Magnetic key={project.id}>
                                <div
                                    className={`${styles.card} ${selectedProject === project.id ? styles.cardExpanded : ''}`}
                                    onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                                >
                                    <div className={styles.imageContainer}>
                                        <div className={`${styles.statusBadge} ${styles['status' + (project.status || 'Completed').replace(/ /g, '')]}`}>
                                            <StatusIcon size={12} />
                                            <span>{project.status || 'Completed'}</span>
                                        </div>

                                        <div className={styles.techOverlay}>
                                            {techIcons.map((tech, idx) => (
                                                <div key={idx} className={styles.techIconMini} title={tech}>
                                                    <Code size={12} />
                                                </div>
                                            ))}
                                        </div>

                                        <Image
                                            src={project.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop'}
                                            alt={`Screenshot of ${project.title} project`}
                                            width={800}
                                            height={450}
                                            className={styles.projectImage}
                                            style={{ filter: isGrayscale ? 'grayscale(1)' : 'grayscale(0)' }}
                                            priority={false}
                                        />
                                    </div>

                                    <div className={styles.cardContent}>
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className={styles.cardTitle}>{project.title}</h3>
                                            <ChevronRight
                                                className={`${styles.expandIcon} ${selectedProject === project.id ? styles.expanded : ''}`}
                                                size={20}
                                            />
                                        </div>

                                        <p className={styles.cardDesc}>{project.description}</p>

                                        <div className={styles.tags}>
                                            {(project.tags || '').split(',').map(tag => (
                                                <span key={tag} className={styles.tag}>{tag.trim()}</span>
                                            ))}
                                        </div>

                                        <AnimatePresence>
                                            {selectedProject === project.id && caseStudy && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className={styles.caseStudy}
                                                >
                                                    <div className={styles.processItem}>
                                                        <span className={styles.processLabel}>Problem</span>
                                                        <p className={styles.processText}>{caseStudy.problem}</p>
                                                    </div>
                                                    <div className={styles.processItem}>
                                                        <span className={styles.processLabel}>Solution</span>
                                                        <p className={styles.processText}>{caseStudy.solution}</p>
                                                    </div>
                                                    <div className={styles.processItem}>
                                                        <span className={styles.processLabel}>Impact</span>
                                                        <p className={styles.processText}>{caseStudy.impact}</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className={styles.links}>
                                            {project.demoUrl && project.demoUrl !== '#' && (
                                                <a href={project.demoUrl} target="_blank" className={styles.link} onClick={(e) => e.stopPropagation()}>
                                                    Live Demo <ExternalLink size={16} />
                                                </a>
                                            )}
                                            {project.repoUrl && project.repoUrl !== '#' && (
                                                <a href={project.repoUrl} target="_blank" className={styles.link} onClick={(e) => e.stopPropagation()}>
                                                    GitHub <Github size={16} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Magnetic>
                        );
                    })}
                </div>

                <div className="flex justify-center mt-12">
                    <button className="btn btn-outline">
                        View All Projects <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </section>
    );
}
