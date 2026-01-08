'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { pageContentSchema } from '@/lib/validations';
import { checkAuth } from './utils';
import { ZodError } from 'zod';

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
