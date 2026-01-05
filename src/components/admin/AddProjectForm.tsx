'use client';

import { useFormStatus } from 'react-dom';
import { useActionState, useEffect, useRef, useState } from 'react';
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
    const [imageMode, setImageMode] = useState<'url' | 'upload'>('upload');

    // Reset form when internal success state changes (for create)
    useEffect(() => {
        if (state?.success) {
            if (!project) {
                formRef.current?.reset();
                setImageMode('upload'); // Reset mode
            } else if (onCancel) {
                // optionally close...
            }
        }
    }, [state?.success, project, onCancel]);

    return (
        <div className={styles.formCard}>
            {/* ... header ... */}

            {/* ... success/error messages ... */}

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
                    <label className={styles.label}>Project Cover Image</label>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                        <button
                            type="button"
                            onClick={() => setImageMode('upload')}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                border: '1px solid',
                                borderColor: imageMode === 'upload' ? '#2563eb' : '#e2e8f0',
                                background: imageMode === 'upload' ? '#eff6ff' : 'transparent',
                                color: imageMode === 'upload' ? '#2563eb' : '#64748b',
                                cursor: 'pointer',
                                fontSize: '0.875rem'
                            }}
                        >
                            Upload File
                        </button>
                        <button
                            type="button"
                            onClick={() => setImageMode('url')}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                border: '1px solid',
                                borderColor: imageMode === 'url' ? '#2563eb' : '#e2e8f0',
                                background: imageMode === 'url' ? '#eff6ff' : 'transparent',
                                color: imageMode === 'url' ? '#2563eb' : '#64748b',
                                cursor: 'pointer',
                                fontSize: '0.875rem'
                            }}
                        >
                            Image URL
                        </button>
                    </div>

                    {imageMode === 'upload' ? (
                        <div>
                            <input
                                type="file"
                                id="imageFile"
                                name="imageFile"
                                accept="image/*"
                                className={styles.input}
                                style={{ border: '1px dashed #cbd5e1', padding: '1rem' }}
                            />
                            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                                Recommended size: 1200x630px. Max 4MB.
                            </p>
                        </div>
                    ) : (
                        <input
                            id="imageUrl"
                            name="imageUrl"
                            defaultValue={project?.imageUrl || ''}
                            placeholder="https://example.com/image.jpg"
                            className={styles.input}
                        />
                    )}
                    {/* Hidden input to keep existing URL if not changing */}
                    {project?.imageUrl && <input type="hidden" name="existingImageUrl" value={project.imageUrl} />}
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
                        <label htmlFor="category" className={styles.label}>Category</label>
                        <input
                            id="category"
                            name="category"
                            defaultValue={project?.category || ''}
                            placeholder="e.g. Web Development, Branding"
                            list="category-suggestions"
                            className={styles.input}
                        />
                        <datalist id="category-suggestions">
                            <option value="Web Development" />
                            <option value="Mobile App" />
                            <option value="Branding" />
                            <option value="UI/UX Design" />
                            <option value="Motion" />
                        </datalist>
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
