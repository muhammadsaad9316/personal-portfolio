import { prisma } from '@/lib/prisma';
import SkillItem from '@/components/admin/SkillItem';
import AddSkillForm from '@/components/admin/AddSkillForm';
import styles from './AdminSkills.module.css';

export default async function AdminSkills() {
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
}
