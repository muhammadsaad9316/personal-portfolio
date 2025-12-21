/**
 * Serializable Project Type
 * This interface represents the project data after serialization
 * (Date objects converted to ISO strings for client components)
 */
export interface SerializableProject {
    id: string;
    title: string;
    slug: string;
    description: string;
    content: string;
    imageUrl: string | null;
    demoUrl: string | null;
    repoUrl: string | null;
    tags: string;
    status: string;
    technologies: string | null;
    caseStudy: string | null;
    featured: boolean;
    order: number;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
}
