'use client';

import { useFormStatus } from 'react-dom';
import { useActionState, useEffect, useRef } from 'react';
import { createProject, updateProject } from '@/app/actions';
import styles from './AddProjectForm.module.css';
import { FaPlus, FaCheck, FaExclamationCircle, FaSave, FaTimes } from 'react-icons/fa';

type State = {
    success: boolean;
    error?: string;
    errors?: Record<string, string[] | undefined>;
    details?: any;
};

const initialState: State = {
    success: false,
    error: '',
    errors: {}
};

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();

    return (
        <button type="submit" className={styles.btnPrimary} disabled={pending}>
            {pending ? (
                <>
                    <span className="animate-spin">⟳</span> {isEditing ? 'Saving...' : 'Creating...'}
                </>
            ) : (
                <>
                    {isEditing ? <FaSave size={14} /> : <FaPlus size={14} />}
                    {isEditing ? 'Update Project' : 'Create Project'}
                </>
            )}
        </button>
    );
}

interface AddProjectFormProps {
    project?: any | null;
    onCancel?: () => void;
}

export default function AddProjectForm({ project, onCancel }: AddProjectFormProps) {
    // We bind the action if editing, otherwise use create
    // Notes: useActionState accepts an action. Ideally we shouldn't switch it dynamically across renders if hooks order changes, 
    // but here the hook is constant. The action fn itself can be a wrapper.

    const actionToUse = project
        ? updateProject.bind(null, project.id)
        : createProject;

    const [state, formAction] = useActionState(actionToUse as any, initialState);
    const formRef = useRef<HTMLFormElement>(null);

    // Reset form when internal success state changes (for create)
    // For edit, we might want to keep it or close it? usually close.
    useEffect(() => {
        if (state?.success) {
            if (!project) {
                formRef.current?.reset();
            } else if (onCancel) {
                // optionally close on success? let's just show success message for now
            }
        }
    }, [state?.success, project, onCancel]);

    return (
        <div className={styles.formCard}>
            <div className={styles.formHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 className={styles.formTitle}>{project ? 'Edit Project' : 'Add New Project'}</h3>
                    <p className={styles.formSubtitle}>
                        {project ? `Editing: ${project.title}` : 'Showcase your latest work in the portfolio'}
                    </p>
                </div>
                {project && onCancel && (
                    <button
                        onClick={onCancel}
                        style={{
                            background: '#f1f5f9',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: '#64748b',
                            fontWeight: 500
                        }}
                    >
                        <FaTimes /> Cancel Edit
                    </button>
                )}
            </div>

            {state?.success && (
                <div className={styles.successMessage}>
                    <FaCheck /> {project ? 'Project updated successfully!' : 'Project created successfully!'}
                </div>
            )}

            {state?.error && (
                <div className={styles.error} style={{ fontSize: '1rem', marginBottom: '1rem', background: '#fef2f2', padding: '1rem', borderRadius: '8px', border: '1px solid #fecaca' }}>
                    <FaExclamationCircle /> {state.error}
                </div>
            )}

            <form ref={formRef} action={formAction} className={styles.form} key={project ? project.id : 'new'}>

                <div className={styles.formGroup}>
                    <label htmlFor="title" className={styles.label}>Project Title</label>
                    <input
                        id="title"
                        name="title"
                        defaultValue={project?.title || ''}
                        placeholder="e.g. E-Commerce Platform"
                        required
                        className={styles.input}
                    />
                    {state?.errors?.title && <span className={styles.error}>{state.errors.title[0]}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="description" className={styles.label}>Short Description</label>
                    <textarea
                        id="description"
                        name="description"
                        defaultValue={project?.description || ''}
                        placeholder="Brief overview of the project..."
                        required
                        rows={3}
                        className={styles.textarea}
                    />
                    {state?.errors?.description && <span className={styles.error}>{state.errors.description[0]}</span>}
                </div>

                <div className={styles.grid}>
                    <div className={styles.formGroup}>
                        <label htmlFor="status" className={styles.label}>Project Status</label>
                        <select
                            name="status"
                            id="status"
                            className={styles.select}
                            defaultValue={project?.status || 'Completed'}
                        >
                            <option value="Completed">Completed</option>
                            <option value="In Development">In Development</option>
                            <option value="Live">Live</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="tags" className={styles.label}>Technolgies (Tags)</label>
                        <input
                            id="tags"
                            name="tags"
                            defaultValue={project?.tags || ''}
                            placeholder="e.g. React, Node.js, Tailwind"
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.grid}>
                    <div className={styles.formGroup}>
                        <label htmlFor="demoUrl" className={styles.label}>Live Demo URL</label>
                        <input
                            id="demoUrl"
                            name="demoUrl"
                            defaultValue={project?.demoUrl || ''}
                            placeholder="https://"
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="repoUrl" className={styles.label}>GitHub Repository URL</label>
                        <input
                            id="repoUrl"
                            name="repoUrl"
                            defaultValue={project?.repoUrl || ''}
                            placeholder="https://github.com/..."
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="content" className={styles.label}>Case Study / Full Content (Markdown)</label>
                    <textarea
                        id="content"
                        name="content"
                        defaultValue={project?.content || ''}
                        placeholder="# Project Details&#10;Describe the problem, solution, and impact..."
                        rows={8}
                        className={styles.textarea}
                        style={{ fontFamily: 'monospace' }}
                    />
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>Supports Markdown formatting.</p>
                </div>

                <label className={styles.toggleLabel}>
                    <input
                        type="checkbox"
                        name="featured"
                        className={styles.checkbox}
                        defaultChecked={project?.featured}
                    />
                    <span className={styles.checkboxText}>Feature this project on homepage</span>
                </label>

                <div className={styles.actions}>
                    <SubmitButton isEditing={!!project} />
                </div>
            </form>
        </div>
    );
}
