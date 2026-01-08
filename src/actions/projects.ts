'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { projectSchema } from '@/lib/validations';
import { checkAuth, saveImageFile } from './utils';
import { ZodError } from 'zod';

// --- PROJECT ACTIONS ---

export async function createProject(prevState: any, formData: FormData) {
    try {
        await checkAuth();

        // Handle Image Upload
        const imageFile = formData.get('imageFile') as File | null;
        let imageUrl = formData.get('imageUrl') as string || '';

        if (imageFile && imageFile.size > 0) {
            const savedPath = await saveImageFile(imageFile);
            if (savedPath) {
                imageUrl = savedPath;
            }
        }

        // Extract and validate data
        const rawData = {
            title: formData.get('title'),
            description: formData.get('description'),
            content: formData.get('content'),
            imageUrl: imageUrl, // Use the processed imageUrl
            demoUrl: formData.get('demoUrl') || '',
            repoUrl: formData.get('repoUrl') || '',
            tags: formData.get('tags'),
            status: formData.get('status') || 'Completed',
            technologies: formData.get('technologies') || '',
            caseStudy: formData.get('caseStudy') || '',
            category: formData.get('category') || 'Featured Work',
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

        // Handle Image Upload
        const imageFile = formData.get('imageFile') as File | null;
        let imageUrl = formData.get('imageUrl') as string || '';
        const existingImageUrl = formData.get('existingImageUrl') as string || '';

        if (imageFile && imageFile.size > 0) {
            const savedPath = await saveImageFile(imageFile);
            if (savedPath) {
                imageUrl = savedPath;
            }
        } else if (!imageUrl && existingImageUrl) {
            // If no new file and no new URL, keep existing
            imageUrl = existingImageUrl;
        }

        const rawData = {
            title: formData.get('title'),
            description: formData.get('description'),
            content: formData.get('content'),
            imageUrl: imageUrl,
            demoUrl: formData.get('demoUrl') || '',
            repoUrl: formData.get('repoUrl') || '',
            tags: formData.get('tags'),
            status: formData.get('status') || 'Completed',
            technologies: formData.get('technologies') || '',
            caseStudy: formData.get('caseStudy') || '',
            category: formData.get('category') || 'Featured Work',
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
