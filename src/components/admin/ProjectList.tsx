'use client';

import { deleteProject } from '@/app/actions';
import styles from './ProjectList.module.css';
import { FaTrash, FaStar, FaGlobe, FaGithub, FaEdit } from 'react-icons/fa';

export function DeleteButton({ id }: { id: string }) {
    return (
        <button
            type="submit"
            className={styles.deleteBtn}
            onClick={(e) => {
                if (!confirm('Are you sure you want to delete this project?')) {
                    e.preventDefault();
                }
            }}
        >
            <FaTrash size={12} /> Delete
        </button>
    );
}

interface ProjectListProps {
    projects: any[];
    onEdit?: (project: any) => void;
}

export default function ProjectList({ projects, onEdit }: ProjectListProps) {
    if (projects.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0' }}>
                <p>No projects found. Add your first project above!</p>
            </div>
        );
    }

    return (
        <div className={styles.listContainer}>
            {projects.map((project) => (
                <div key={project.id} className={styles.projectCard}>
                    <div className={styles.projectInfo}>
                        <div className={styles.header}>
                            <h4 className={styles.title}>{project.title}</h4>
                            <span className={`${styles.badge} ${project.status === 'Live' ? styles.badgeLive :
                                    project.status === 'In Development' ? styles.badgeDev :
                                        styles.badgeCompleted
                                }`}>
                                {project.status}
                            </span>
                            {project.featured && (
                                <span className={styles.featuredBadge}>
                                    <FaStar size={10} /> Featured
                                </span>
                            )}
                        </div>
                        <p className={styles.tags}>{project.tags || project.technologies}</p>

                        <div className={styles.meta}>
                            {project.demoUrl && (
                                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', textDecoration: 'none' }}>
                                    <FaGlobe size={12} /> Demo
                                </a>
                            )}
                            {project.repoUrl && (
                                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', textDecoration: 'none' }}>
                                    <FaGithub size={12} /> Code
                                </a>
                            )}
                            <span>• Added {new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        {onEdit && (
                            <button
                                onClick={() => onEdit(project)}
                                style={{
                                    background: '#eff6ff',
                                    color: '#2563eb',
                                    border: '1px solid #bfdbfe',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <FaEdit size={12} /> Edit
                            </button>
                        )}
                        <form action={async () => {
                            await deleteProject(project.id);
                        }}>
                            <DeleteButton id={project.id} />
                        </form>
                    </div>
                </div>
            ))}
        </div>
    );
}
