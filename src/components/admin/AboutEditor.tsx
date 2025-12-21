'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateSectionContent } from '@/app/actions';
import styles from './ContentEditor.module.css';
import { FaSave, FaCheck, FaExclamationCircle, FaPlus, FaTrash } from 'react-icons/fa';

type Education = {
    year: string;
    title: string;
    provider: string;
    desc: string;
};

type AboutContent = {
    title: string;
    bio: string;
    education: Education[];
};

const defaultContent: AboutContent = {
    title: 'About Me',
    bio: '',
    education: []
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button type="submit" className={styles.btnPrimary} disabled={pending}>
            {pending ? (
                <>
                    <span className="animate-spin">⟳</span> Saving...
                </>
            ) : (
                <>
                    <FaSave size={14} /> Update About
                </>
            )}
        </button>
    );
}

export default function AboutEditor({ initialContent }: { initialContent: any }) {
    const [content, setContent] = useState<AboutContent>(() => {
        try {
            const parsed = typeof initialContent === 'string'
                ? JSON.parse(initialContent)
                : initialContent || defaultContent;

            // Ensure education array exists
            if (!parsed.education) parsed.education = [];

            // Migration helper: If old fields exist, map them to new ones
            parsed.education = parsed.education.map((edu: any) => ({
                year: edu.year || '',
                title: edu.title || edu.degree || '',
                provider: edu.provider || edu.location || '',
                desc: edu.desc || edu.status || ''
            }));

            return parsed;
        } catch {
            return defaultContent;
        }
    });

    const [newEdu, setNewEdu] = useState<Education>({ year: '', title: '', provider: '', desc: '' });

    // Wrap the server action to inject the JSON content
    const updateAction = async (prevState: any, formData: FormData) => {
        formData.set('content', JSON.stringify(content));
        return updateSectionContent(prevState, formData);
    };

    const [state, formAction] = useActionState(updateAction, { success: false });

    // Handle standard inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setContent(prev => ({ ...prev, [name]: value }));
    };

    // Education Management
    const addEducation = () => {
        if (!newEdu.title.trim()) return; // Prevent empty adds
        setContent(prev => ({
            ...prev,
            education: [...prev.education, { ...newEdu }]
        }));
        setNewEdu({ year: '', title: '', provider: '', desc: '' });
    };

    const removeEducation = (index: number) => {
        setContent(prev => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className={styles.formCard}>
            <div className={styles.formHeader}>
                <h3 className={styles.formTitle}>About Section</h3>
                <p className={styles.formSubtitle}>Share your biography and educational background.</p>
            </div>

            {state?.success && (
                <div className={styles.successMessage}>
                    <FaCheck /> Section updated successfully!
                </div>
            )}

            {state?.error && (
                <div className={styles.error} style={{ padding: '1rem', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca', marginBottom: '1rem' }}>
                    <FaExclamationCircle /> {state.error}
                </div>
            )}

            <form action={formAction} className={styles.form}>
                <input type="hidden" name="pageSlug" value="home" />
                <input type="hidden" name="section" value="about" />
                <input type="hidden" name="isVisible" value="on" />

                <div className={styles.formGroup}>
                    <label htmlFor="about-title" className={styles.label}>Title</label>
                    <input
                        id="about-title"
                        name="title"
                        value={content.title || ''}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="bio" className={styles.label}>Bio / Introduction</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={content.bio || ''}
                        onChange={handleChange}
                        rows={6}
                        className={styles.textarea}
                        required
                    />
                </div>

                {/* Education List Manager */}
                <div className={styles.formGroup} style={{ marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                    <h4 style={{ margin: '0 0 1rem', fontSize: '1.1rem', color: '#1e293b' }}>Education History</h4>

                    {/* List Existing */}
                    <div className={styles.listGroup}>
                        {content.education.map((edu, idx) => (
                            <div key={idx} className={styles.itemCard}>
                                <div className={styles.itemContent}>
                                    <h4 style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                        {edu.title}
                                        <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: '#64748b' }}>{edu.year}</span>
                                    </h4>
                                    <p>{edu.provider}</p>
                                    <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>{edu.desc}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeEducation(idx)}
                                    className={styles.btnDanger}
                                    title="Remove"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                        {content.education.length === 0 && (
                            <p style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.9rem' }}>No education items added yet.</p>
                        )}
                    </div>

                    {/* Add New */}
                    <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', marginTop: '1.5rem', border: '1px dashed #cbd5e1' }}>
                        <h5 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 600, color: '#475569' }}>Add New Education / Journey Item</h5>

                        <div className={styles.grid} style={{ gap: '1rem' }}>
                            <div className={styles.formGroup}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>Degree / Title</label>
                                <input
                                    placeholder="e.g. BS Computer Science"
                                    value={newEdu.title}
                                    onChange={e => setNewEdu({ ...newEdu, title: e.target.value })}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>Year / Duration</label>
                                <input
                                    placeholder="e.g. 2023 - 2027"
                                    value={newEdu.year}
                                    onChange={e => setNewEdu({ ...newEdu, year: e.target.value })}
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <div className={styles.grid} style={{ gap: '1rem', marginTop: '1rem' }}>
                            <div className={styles.formGroup}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>Institution / Provider</label>
                                <input
                                    placeholder="e.g. Abdul Wali Khan University"
                                    value={newEdu.provider}
                                    onChange={e => setNewEdu({ ...newEdu, provider: e.target.value })}
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>Description / Status</label>
                            <textarea
                                placeholder="e.g. Currently in 5th Semester. Specializing in..."
                                value={newEdu.desc}
                                onChange={e => setNewEdu({ ...newEdu, desc: e.target.value })}
                                className={styles.textarea}
                                rows={2}
                                style={{ minHeight: '80px' }}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={addEducation}
                            className={styles.btnSecondary}
                            style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'center', background: '#e0e7ff', color: '#4338ca' }}
                        >
                            <FaPlus size={12} /> Add to List
                        </button>
                    </div>
                </div>

                <div className={styles.actions}>
                    <SubmitButton />
                </div>
            </form>
        </div>
    );
}
