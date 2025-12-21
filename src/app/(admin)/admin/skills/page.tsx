import { prisma } from '@/lib/prisma';
import SkillItem from '@/components/admin/SkillItem';
import AddSkillForm from '@/components/admin/AddSkillForm';
import styles from './AdminSkills.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminSkills() {
    try {
        const skills = await prisma.skill.findMany({
            orderBy: { order: 'asc' },
        });

        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Manage Skills</h1>
                </div>

                <AddSkillForm />

                <div className={styles.grid}>
                    {skills.map((skill) => (
                        <SkillItem key={skill.id} skill={skill} />
                    ))}
                </div>
            </div>
        );
    } catch (error) {
        console.error('[AdminSkills] Database query failed:', error);

        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Manage Skills</h1>
                </div>
                <div style={{
                    background: 'white',
                    padding: '3rem 2rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    border: '1px solid #fee2e2'
                }}>
                    <p style={{ color: '#ef4444', marginBottom: '1rem' }}>⚠️ Database connection failed</p>
                    <p style={{ color: '#6b7280' }}>Unable to fetch skills. Please try again later.</p>
                </div>
            </div>
        );
    }
}
