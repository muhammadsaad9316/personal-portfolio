import AdminNav from '@/components/admin/AdminNav';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            <AdminNav />
            <main style={{ flex: 1, marginLeft: '250px' }}>
                {children}
            </main>
        </div>
    );
}
