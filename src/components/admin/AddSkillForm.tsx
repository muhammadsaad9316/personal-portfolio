'use client';

import { useFormStatus } from 'react-dom';
import { useActionState, useEffect, useRef } from 'react';
import { createSkill } from '@/app/actions';
import { SKILL_CATEGORIES } from '@/constants/categories';
import styles from './AddSkillForm.module.css';

type State = {
    success: boolean;
    error?: string;
    errors?: Record<string, string[] | undefined>;
};

const initialState: State = {
    success: false,
    error: '',
    errors: {}
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button type="submit" className={styles.btnPrimary} disabled={pending}>
            {pending ? 'Adding...' : 'Add Skill'}
        </button>
    );
}

export default function AddSkillForm() {
    const [state, formAction] = useActionState(createSkill, initialState);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.success) {
            formRef.current?.reset();
        }
    }, [state?.success]);

    return (
        <div className={styles.formCard}>
            <h3 className={styles.formTitle}>Add New Skill</h3>
            <form ref={formRef} action={formAction} className={styles.form}>

                {state?.error && (
                    <div className={styles.error} style={{ fontSize: '1rem', marginBottom: '1rem' }}>
                        {state.error}
                    </div>
                )}

                <div className={styles.formGroup}>
                    <input
                        name="name"
                        placeholder="Skill Name (e.g. React)"
                        required
                        className={styles.input}
                    />
                    {state?.errors?.name && <span className={styles.error}>{state.errors.name[0]}</span>}
                </div>

                <div className={styles.formGroup}>
                    <select name="category" required className={styles.select}>
                        {SKILL_CATEGORIES.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    {state?.errors?.category && <span className={styles.error}>{state.errors.category[0]}</span>}
                </div>

                <div className={styles.formGroup}>
                    <input
                        type="number"
                        name="proficiency"
                        placeholder="Proficiency (1-100)"
                        min="1"
                        max="100"
                        required
                        className={styles.input}
                    />
                    {state?.errors?.proficiency && <span className={styles.error}>{state.errors.proficiency[0]}</span>}
                </div>

                <div className={styles.formGroup}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input
                            type="number"
                            name="yearsOfExperience"
                            placeholder="Years of Exp."
                            min="0"
                            step="0.5"
                            className={styles.input}
                        />
                        <input
                            type="number"
                            name="projectCount"
                            placeholder="No. of Projects"
                            min="0"
                            className={styles.input}
                        />
                    </div>
                    {state?.errors?.yearsOfExperience && <span className={styles.error}>{state.errors.yearsOfExperience[0]}</span>}
                    {state?.errors?.projectCount && <span className={styles.error}>{state.errors.projectCount[0]}</span>}
                </div>

                <SubmitButton />
            </form>
        </div>
    );
}
