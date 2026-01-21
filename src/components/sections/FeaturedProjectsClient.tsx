'use client';

import { useMemo } from 'react';
import styles from './Projects.module.css';
import { AnimatedFolder, Project } from '@/components/ui/3d-folder';
import type { SerializableProject } from '@/types/project';

export default function FeaturedProjectsClient({ projects }: { projects: SerializableProject[] }) {

    // Group projects by status or category if available, otherwise "Featured Work"
    const folders = useMemo(() => {
        // Group projects by their database field 'category'
        const groups: Record<string, SerializableProject[]> = {};

        projects.forEach(project => {
            const cat = project.category || 'Featured Work';
            if (!groups[cat]) {
                groups[cat] = [];
            }
            groups[cat].push(project);
        });

        // Convert to array and assign gradients
        const gradients = [
            "linear-gradient(135deg, #10b981, #34d399)", // Emerald (Primary)
            "linear-gradient(135deg, #e11d48, #fb7185)", // Rose
            "linear-gradient(135deg, #0891b2, #22d3ee)", // Cyan
            "linear-gradient(135deg, #10b981, #34d399)", // Emerald
            "linear-gradient(135deg, #f59e0b, #fbbf24)", // Amber
            "linear-gradient(135deg, #8b5cf6, #a78bfa)", // Violet
        ];

        return Object.entries(groups).map(([title, groupProjects], index) => ({
            title,
            projects: groupProjects,
            gradient: gradients[index % gradients.length]
        }));
    }, [projects]);

    // Map SerializableProject to the internal Project type for 3d-folder
    function mapProjects(serializableProjects: SerializableProject[]): Project[] {
        return serializableProjects.map(p => ({
            id: p.id,
            image: p.imageUrl || '',
            title: p.title,
            tags: p.tags,
            demoUrl: p.demoUrl
        }));
    }

    return (
        <section id="projects" className={`${styles.section} section-projects min-h-screen flex flex-col justify-center`}>
            <div className="mesh-gradient" />
            <div className="container relative z-10">
                <div className="text-center mb-16">
                    <h2 className={styles.sectionTitle}>Featured Work</h2>
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                        An interactive collection of my latest deployments and experiments.
                        <br /><span className="text-sm opacity-70">(Hover over the folders to explore)</span>
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-12 md:gap-20">
                    {folders.map((folder, idx) => (
                        <AnimatedFolder
                            key={folder.title + idx}
                            title={folder.title}
                            projects={mapProjects(folder.projects)}
                            gradient={folder.gradient}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
