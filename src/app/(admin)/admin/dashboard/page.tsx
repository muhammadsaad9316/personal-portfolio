import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { FaProjectDiagram, FaCode, FaEnvelope, FaPlus, FaArrowRight } from 'react-icons/fa';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const [
        projectCount,
        skillCount,
        messageCount,
        recentProjects
    ] = await Promise.all([
        prisma.project.count(),
        prisma.skill.count(),
        prisma.message.count(),
        prisma.project.findMany({
            take: 3,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                status: true,
                createdAt: true,
            }
        })
    ]);

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#111827' }}>Dashboard Overview</h1>
                <p style={{ color: '#6b7280' }}>Welcome back! Here's what's happening with your portfolio.</p>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
            }}>
                <StatCard
                    title="Total Projects"
                    value={projectCount}
                    icon={<FaProjectDiagram />}
                    color="#3b82f6"
                    link="/admin/projects"
                />
                <StatCard
                    title="Total Skills"
                    value={skillCount}
                    icon={<FaCode />}
                    color="#10b981"
                    link="/admin/skills"
                />
                <StatCard
                    title="Messages"
                    value={messageCount}
                    icon={<FaEnvelope />}
                    color="#f59e0b"
                    link="/admin/messages"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Recent Activity */}
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', margin: 0, color: '#111827' }}>Recent Projects</h2>
                        <Link href="/admin/projects" style={{ color: '#3b82f6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}>
                            View All <FaArrowRight size={12} />
                        </Link>
                    </div>

                    {recentProjects.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {recentProjects.map(project => (
                                <div key={project.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingBottom: '1rem',
                                    borderBottom: '1px solid #f3f4f6'
                                }}>
                                    <div>
                                        <p style={{ margin: '0 0 0.25rem 0', fontWeight: 500, color: '#111827' }}>{project.title}</p>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            padding: '0.25rem 0.625rem',
                                            backgroundColor: '#f3f4f6',
                                            borderRadius: '999px',
                                            color: '#4b5563'
                                        }}>
                                            {project.status}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                                        {new Date(project.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem 0' }}>No projects yet.</p>
                    )}
                </div>

                {/* Quick Actions */}
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: 'fit-content' }}>
                    <h2 style={{ fontSize: '1.25rem', margin: '0 0 1.5rem 0', color: '#111827' }}>Quick Actions</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Link href="/admin/projects?new=true" style={actionButtonStyle}>
                            <div style={{ ...iconBoxStyle, background: '#eff6ff', color: '#3b82f6' }}><FaPlus /></div>
                            <span>Add New Project</span>
                        </Link>
                        <Link href="/admin/skills?new=true" style={actionButtonStyle}>
                            <div style={{ ...iconBoxStyle, background: '#f0fdf4', color: '#16a34a' }}><FaPlus /></div>
                            <span>Add New Skill</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color, link }: any) {
    return (
        <Link href={link} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'transform 0.2s',
                cursor: 'pointer'
            }}>
                <div style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '12px',
                    background: `${color}20`,
                    color: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                }}>
                    {icon}
                </div>
                <div>
                    <h3 style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>{title}</h3>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.875rem', fontWeight: 700, color: '#111827' }}>{value}</p>
                </div>
            </div>
        </Link>
    );
}

const actionButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    background: 'white',
    textDecoration: 'none',
    color: '#374151',
    fontWeight: 500,
    transition: 'background 0.2s'
} as const;

const iconBoxStyle = {
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem'
} as const;
