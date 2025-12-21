'use client';

import { useState } from 'react';
import AddProjectForm from './AddProjectForm';
import ProjectList from './ProjectList';

export default function ProjectsManager({ projects }: { projects: any[] }) {
    const [editingProject, setEditingProject] = useState<any | null>(null);

    const handleEdit = (project: any) => {
        setEditingProject(project);
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingProject(null);
    };

    return (
        <div>
            <AddProjectForm
                project={editingProject}
                onCancel={handleCancelEdit}
            />

            <div style={{ marginTop: '3rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '1.5rem' }}>Existing Projects</h2>
                <ProjectList
                    projects={projects}
                    onEdit={handleEdit}
                />
            </div>
        </div>
    );
}
