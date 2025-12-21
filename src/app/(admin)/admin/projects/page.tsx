import { prisma } from '@/lib/prisma';
import ProjectsManager from '@/components/admin/ProjectsManager';

export default async function AdminProjects() {
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Manage Projects</h1>
                <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Add, edit, and organize your portfolio projects.</p>
            </div>

            <ProjectsManager projects={projects} />
        </div>
    );
}
