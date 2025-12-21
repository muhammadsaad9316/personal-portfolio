import { prisma } from '@/lib/prisma';
import ProjectsManager from '@/components/admin/ProjectsManager';

export const dynamic = 'force-dynamic';

export default async function AdminProjects() {
    try {
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
    } catch (error) {
        console.error('[AdminProjects] Database query failed:', error);

        return (
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Manage Projects</h1>
                    <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Unable to load projects</p>
                </div>
                <div style={{
                    background: 'white',
                    padding: '3rem 2rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    border: '1px solid #fee2e2'
                }}>
                    <p style={{ color: '#ef4444', marginBottom: '1rem' }}>⚠️ Database connection failed</p>
                    <p style={{ color: '#6b7280' }}>Unable to fetch projects. Please try again later.</p>
                </div>
            </div>
        );
    }
}
