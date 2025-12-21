import { prisma } from '@/lib/prisma';
import MessageList from '@/components/admin/MessageList';

export const dynamic = 'force-dynamic';

export default async function AdminMessages() {
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
}
