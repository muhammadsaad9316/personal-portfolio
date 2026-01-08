'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth'; // Still needed for session check in create/updateSkill explicitly if not using checkAuth helper everywhere? 
// The original code used `await auth()` directly in createSkill/updateSkill instead of checkAuth helper function.
// But checkAuth helper was used in deleteSkill.
// I will use checkAuth helper for consistency if possible, but the original code had slightly different error return shapes.
// Original createSkill returned { success: false, error: "Unauthorized" }
// Original deleteSkill threw error caught in catch block.
// I'll stick to the original logic to avoid breaking frontend expectation, but import checkAuth for where it was used.

import { skillSchema } from '@/lib/validations';
import { checkAuth } from './utils';
import { ZodError } from 'zod';

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
