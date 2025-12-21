'use client';

import { useState } from 'react';
import { deleteSkill, updateSkill } from '@/app/actions';
import { SKILL_CATEGORIES } from '@/constants/categories';
import styles from './SkillItem.module.css';

export default function SkillItem({ skill }: { skill: any }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this skill?')) return;
        setIsLoading(true);
        await deleteSkill(skill.id);
        setIsLoading(false);
    };

    const handleUpdate = async (formData: FormData) => {
        setIsLoading(true);
        const result = await updateSkill(skill.id, formData);
        setIsLoading(false);
        if (result?.success) {
            setIsEditing(false);
        } else {
            alert(result?.error || 'Failed to update');
        }
    };

    if (isEditing) {
        return (
            <div className={styles.card}>
                <form action={handleUpdate} className={styles.editForm}>
                    <input name="name" defaultValue={skill.name} required className={styles.input} />
                    <select name="category" defaultValue={skill.category} required className={styles.select}>
                        {SKILL_CATEGORIES.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    <input type="number" name="proficiency" defaultValue={skill.proficiency} min="0" max="100" className={styles.input} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <input type="number" name="yearsOfExperience" defaultValue={skill.yearsOfExperience} min="0" step="0.5" placeholder="Exp (Yrs)" className={styles.input} />
                        <input type="number" name="projectCount" defaultValue={skill.projectCount} min="0" placeholder="Projects" className={styles.input} />
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="submit" disabled={isLoading} className={styles.btnSave}>
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                        <button type="button" onClick={() => setIsEditing(false)} className={styles.btnCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.info}>
                    <span className={styles.name}>{skill.name}</span>
                    <span className={styles.category}>{skill.category}</span>
                </div>
                <div className={styles.actions}>
                    <button onClick={() => setIsEditing(true)} className={styles.btnEdit}>Edit</button>
                    <button onClick={handleDelete} disabled={isLoading} className={styles.btnDelete}>
                        {isLoading ? '...' : 'Delete'}
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>
                <span><strong>{skill.yearsOfExperience || 0}</strong> Yrs Exp.</span>
                <span><strong>{skill.projectCount || 0}</strong> Projects</span>
            </div>

            {skill.proficiency !== undefined && (
                <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${skill.proficiency}%` }} />
                </div>
            )}
        </div>
    );
}
