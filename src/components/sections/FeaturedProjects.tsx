import { getCachedFeaturedProjects } from '@/lib/cache';
import styles from './Projects.module.css';
import FeaturedProjectsClient from './FeaturedProjectsClient';
import type { SerializableProject } from '@/types/project';

async function getProjects(): Promise<SerializableProject[]> {
    const projects = await getCachedFeaturedProjects();

    // Convert Date objects to ISO strings for client component if they exist
    // Add null safety to prevent crashes when dates are undefined
    return projects.map(p => ({
        ...p,
        createdAt: p.createdAt?.toISOString() ?? new Date().toISOString(),
        updatedAt: p.updatedAt?.toISOString() ?? new Date().toISOString(),
    })) as SerializableProject[];
}

export default async function FeaturedProjects() {
    const projects = await getProjects();

    if (projects.length === 0) {
        return (
            <section id="projects" className={`${styles.section} section-projects`}>
                <div className="mesh-gradient" />
                <div className="container">
                    <h2 className={styles.sectionTitle}>Featured Projects</h2>
                    <p className="text-center">Projects are being added. Check back soon!</p>
                </div>
            </section>
        );
    }

    return <FeaturedProjectsClient projects={projects} />;
}
