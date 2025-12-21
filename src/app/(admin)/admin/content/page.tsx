import { prisma } from '@/lib/prisma';
import HeroEditor from '@/components/admin/HeroEditor';
import AboutEditor from '@/components/admin/AboutEditor';

export const dynamic = 'force-dynamic';

export default async function AdminContent() {
    try {
        // Fetch existing content to pre-fill forms
        const heroContent = await prisma.pageContent.findUnique({
            where: { pageSlug_section: { pageSlug: 'home', section: 'hero' } },
        });

        const aboutContent = await prisma.pageContent.findUnique({
            where: { pageSlug_section: { pageSlug: 'home', section: 'about' } },
        });

        return (
            <div className="container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>Page Content Manager</h1>
                    <p style={{ color: '#64748b' }}>Manage your homepage sections and content.</p>
                </div>

                <div style={{ display: 'grid', gap: '2rem' }}>
                    <HeroEditor initialContent={heroContent?.content} />
                    <AboutEditor initialContent={aboutContent?.content} />
                </div>
            </div>
        );
    } catch (error) {
        console.error('[AdminContent] Database query failed:', error);

        return (
            <div className="container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>Page Content Manager</h1>
                    <p style={{ color: '#64748b' }}>Unable to load content</p>
                </div>
                <div style={{
                    background: 'white',
                    padding: '3rem 2rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    border: '1px solid #fee2e2'
                }}>
                    <p style={{ color: '#ef4444', marginBottom: '1rem' }}>⚠️ Database connection failed</p>
                    <p style={{ color: '#6b7280' }}>Unable to fetch page content. Please try again later.</p>
                </div>
            </div>
        );
    }
}
