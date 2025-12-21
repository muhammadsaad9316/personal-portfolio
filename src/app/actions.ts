'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import {
    projectSchema,
    skillSchema,
    blogPostSchema,
    pageContentSchema
} from '@/lib/validations';
import { ZodError } from 'zod';

async function checkAuth() {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }
}

// --- PROJECT ACTIONS ---

export async function createProject(prevState: any, formData: FormData) {
    try {
        await checkAuth();

        // Extract and validate data
        const rawData = {
            title: formData.get('title'),
            description: formData.get('description'),
            content: formData.get('content'),
            imageUrl: formData.get('imageUrl') || '',
            demoUrl: formData.get('demoUrl') || '',
            repoUrl: formData.get('repoUrl') || '',
            tags: formData.get('tags'),
            status: formData.get('status') || 'Completed',
            technologies: formData.get('technologies') || '',
            caseStudy: formData.get('caseStudy') || '',
            featured: formData.get('featured') === 'on',
        };

        const validatedData = projectSchema.parse(rawData);

        // Generate slug from validated title
        const slug = validatedData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        await prisma.project.create({
            data: {
                ...validatedData,
                slug,
            },
        });

        revalidatePath('/projects');
        revalidatePath('/');
        revalidatePath('/admin/dashboard');

        return { success: true };
    } catch (error) {
        if (error instanceof ZodError) {
            return { error: 'Validation failed', details: (error as any).errors };
        }
        return { error: error instanceof Error ? error.message : 'Failed to create project' };
    }
}

export async function updateProject(id: string, prevState: any, formData: FormData) {
    try {
        await checkAuth();

        const rawData = {
            title: formData.get('title'),
            description: formData.get('description'),
            content: formData.get('content'),
            imageUrl: formData.get('imageUrl') || '',
            demoUrl: formData.get('demoUrl') || '',
            repoUrl: formData.get('repoUrl') || '',
            tags: formData.get('tags'),
            status: formData.get('status') || 'Completed',
            technologies: formData.get('technologies') || '',
            caseStudy: formData.get('caseStudy') || '',
            featured: formData.get('featured') === 'on',
        };

        const validatedData = projectSchema.parse(rawData);

        const slug = validatedData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        await prisma.project.update({
            where: { id },
            data: {
                ...validatedData,
                slug,
            },
        });

        revalidatePath('/projects');
        revalidatePath('/');
        revalidatePath('/admin/dashboard');

        return { success: true };
    } catch (error) {
        if (error instanceof ZodError) {
            return { error: 'Validation failed', details: (error as any).errors };
        }
        return { error: error instanceof Error ? error.message : 'Failed to update project' };
    }
}

export async function deleteProject(id: string) {
    try {
        await checkAuth();
        await prisma.project.delete({ where: { id } });
        revalidatePath('/projects');
        revalidatePath('/admin/dashboard');
        return { success: true };
    } catch (error) {
        return { error: error instanceof Error ? error.message : 'Failed to delete project' };
    }
}

// --- SKILL ACTIONS ---

export async function createSkill(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session || !session.user) {
        return { success: false, error: "Unauthorized" };
    }

    // Basic validation manually for now since schema might be strict on undefineds if we partial update
    // But rebuilding the full object for validation is safer
    const name = formData.get('name');
    const category = formData.get('category');
    const proficiency = formData.get('proficiency');
    const yearsOfExperience = formData.get('yearsOfExperience');
    const projectCount = formData.get('projectCount');

    const validatedFields = skillSchema.safeParse({
        name,
        category,
        proficiency: Number(proficiency),
        yearsOfExperience: Number(yearsOfExperience || 0),
        projectCount: Number(projectCount || 0),
        icon: formData.get('icon') || '',
    });

    if (!validatedFields.success) {
        return { success: false, errors: validatedFields.error.flatten().fieldErrors };
    }

    try {
        await prisma.skill.create({
            data: {
                name: validatedFields.data.name,
                category: validatedFields.data.category,
                proficiency: validatedFields.data.proficiency,
                yearsOfExperience: validatedFields.data.yearsOfExperience,
                projectCount: validatedFields.data.projectCount,
                icon: validatedFields.data.icon,
            },
        });
        revalidatePath('/admin/skills');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Failed to create skill:", error);
        return { success: false, error: "Failed to create skill" };
    }
}

export async function updateSkill(id: string, formData: FormData) {
    const session = await auth();
    if (!session || !session.user) {
        return { success: false, error: "Unauthorized" };
    }

    const name = formData.get('name');
    const category = formData.get('category');
    const icon = formData.get('icon'); // Keep icon from original
    const proficiency = formData.get('proficiency');
    const yearsOfExperience = formData.get('yearsOfExperience');
    const projectCount = formData.get('projectCount');

    // Basic validation manually for now since schema might be strict on undefineds if we partial update
    // But rebuilding the full object for validation is safer
    const validatedFields = skillSchema.safeParse({
        name,
        category,
        icon: icon || '', // Keep icon from original
        proficiency: Number(proficiency),
        yearsOfExperience: Number(yearsOfExperience || 0),
        projectCount: Number(projectCount || 0),
    });

    if (!validatedFields.success) {
        return { success: false, error: "Validation failed" };
    }

    try {
        await prisma.skill.update({
            where: { id },
            data: {
                name: validatedFields.data.name,
                category: validatedFields.data.category,
                proficiency: validatedFields.data.proficiency,
                yearsOfExperience: validatedFields.data.yearsOfExperience,
                projectCount: validatedFields.data.projectCount,
                // Removed icon to prevent overwriting existing icon with empty string
            },
        });
        revalidatePath('/admin/skills');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Failed to update skill:", error);
        return { success: false, error: "Failed to update skill" };
    }
}

export async function deleteSkill(id: string) {
    try {
        await checkAuth();
        await prisma.skill.delete({ where: { id } });
        revalidatePath('/skills');
        revalidatePath('/admin/skills');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        return { error: error instanceof Error ? error.message : 'Failed to delete skill' };
    }
}



// --- BLOG ACTIONS ---

export async function createPost(formData: FormData) {
    try {
        await checkAuth();

        // Extract and validate data
        const rawData = {
            title: formData.get('title'),
            excerpt: formData.get('excerpt') || '',
            content: formData.get('content'),
            coverImage: formData.get('coverImage') || '',
            tags: formData.get('tags') || '',
            published: formData.get('published') === 'on',
        };

        const validatedData = blogPostSchema.parse(rawData);

        // Generate slug from validated title
        const slug = validatedData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        await prisma.blogPost.create({
            data: {
                ...validatedData,
                slug,
                publishedAt: validatedData.published ? new Date() : null,
            },
        });

        revalidatePath('/blog');
        revalidatePath('/admin/blog');
        revalidatePath('/admin/dashboard');

        return { success: true };
    } catch (error) {
        if (error instanceof ZodError) {
            return { error: 'Validation failed', details: (error as any).errors };
        }
        return { error: error instanceof Error ? error.message : 'Failed to create post' };
    }
}

export async function deletePost(id: string) {
    try {
        await checkAuth();
        await prisma.blogPost.delete({ where: { id } });
        revalidatePath('/blog');
        revalidatePath('/admin/dashboard');
        return { success: true };
    } catch (error) {
        return { error: error instanceof Error ? error.message : 'Failed to delete post' };
    }
}

// --- CONTENT ACTIONS ---

export async function updateSectionContent(prevState: any, formData: FormData) {
    try {
        await checkAuth();

        // Extract and validate data
        const rawData = {
            pageSlug: formData.get('pageSlug'),
            section: formData.get('section'),
            content: formData.get('content'),
            isVisible: formData.get('isVisible') === 'on',
            order: formData.get('order') ? Number(formData.get('order')) : 0,
        };

        const validatedData = pageContentSchema.parse(rawData);

        await prisma.pageContent.upsert({
            where: {
                pageSlug_section: {
                    pageSlug: validatedData.pageSlug,
                    section: validatedData.section,
                },
            },
            update: {
                content: validatedData.content,
                isVisible: validatedData.isVisible,
                order: validatedData.order,
            },
            create: {
                pageSlug: validatedData.pageSlug,
                section: validatedData.section,
                content: validatedData.content,
                isVisible: validatedData.isVisible,
                order: validatedData.order,
            },
        });

        revalidatePath('/');
        revalidatePath(`/${validatedData.pageSlug}`);

        return { success: true };
    } catch (error) {
        if (error instanceof ZodError) {
            return { error: 'Validation failed', details: (error as any).errors };
        }
        return { error: error instanceof Error ? error.message : 'Failed to update content' };
    }
}
