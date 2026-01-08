'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateSectionContent } from '@/actions/content';
import styles from './ContentEditor.module.css';
import { FaSave, FaCheck, FaExclamationCircle } from 'react-icons/fa';

type HeroContent = {
    title: string;
    subtitle: string;
    description: string;
};

const defaultContent: HeroContent = {
    title: '',
    subtitle: '',
    description: ''
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
                    <FaSave size={14} /> Update Hero
                </>
            )}
        </button>
    );
}

export default function HeroEditor({ initialContent }: { initialContent: any }) {
    const [content, setContent] = useState<HeroContent>(() => {
        try {
            return typeof initialContent === 'string'
                ? JSON.parse(initialContent)
                : initialContent || defaultContent;
        } catch {
            return defaultContent;
        }
    });

    // Wrap the server action to inject the JSON content
    const updateAction = async (prevState: any, formData: FormData) => {
        // Append the current state as the 'content' field
        formData.set('content', JSON.stringify(content));
        return updateSectionContent(prevState, formData);
    };

    const [state, formAction] = useActionState(updateAction, { success: false });

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setContent(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className={styles.formCard}>
            <div className={styles.formHeader}>
                <h3 className={styles.formTitle}>Hero Section</h3>
                <p className={styles.formSubtitle}>Edit the main introductory section of your homepage.</p>
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
                <input type="hidden" name="section" value="hero" />
                <input type="hidden" name="isVisible" value="on" />

                <div className={styles.grid}>
                    <div className={styles.formGroup}>
                        <label htmlFor="title" className={styles.label}>Title</label>
                        <input
                            id="title"
                            name="title"
                            value={content.title || ''}
                            onChange={handleChange}
                            placeholder="e.g. John Doe"
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="subtitle" className={styles.label}>Subtitle</label>
                        <input
                            id="subtitle"
                            name="subtitle"
                            value={content.subtitle || ''}
                            onChange={handleChange}
                            placeholder="e.g. Full Stack Developer"
                            className={styles.input}
                            required
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="description" className={styles.label}>Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={content.description || ''}
                        onChange={handleChange}
                        placeholder="Brief bio or introduction..."
                        rows={4}
                        className={styles.textarea}
                        required
                    />
                </div>

                <div className={styles.actions}>
                    <SubmitButton />
                </div>
            </form>
        </div>
    );
}
