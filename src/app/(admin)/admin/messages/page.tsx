import { prisma } from '@/lib/prisma';
import MessageList from '@/components/admin/MessageList';

export const dynamic = 'force-dynamic';

export default async function AdminMessages() {
    try {
        const messages = await prisma.message.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return (
            <div className="container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>Messages</h1>
                    <p style={{ color: '#64748b' }}>Inbox for contact form submissions.</p>
                </div>

                <MessageList messages={messages} />
            </div>
        );
    } catch (error) {
        console.error('[AdminMessages] Database query failed:', error);

        return (
            <div className="container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>Messages</h1>
                    <p style={{ color: '#64748b' }}>Unable to load messages</p>
                </div>
                <div style={{
                    background: 'white',
                    padding: '3rem 2rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    border: '1px solid #fee2e2'
                }}>
                    <p style={{ color: '#ef4444', marginBottom: '1rem' }}>⚠️ Database connection failed</p>
                    <p style={{ color: '#6b7280' }}>Unable to fetch messages. Please try again later.</p>
                </div>
            </div>
        );
    }
}
