'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getTimelineItems() {
    try {
        const items = await prisma.timelineItem.findMany({
            orderBy: { order: 'asc' },
        });
        return { success: true, items };
    } catch (error) {
        console.error('Error fetching timeline items:', error);
        return { success: false, error: 'Failed to fetch items' };
    }
}

export async function createTimelineItem(data: {
    year: string;
    title: string;
    provider: string;
    desc: string;
    type: string;
    order?: number;
}) {
    try {
        const newItem = await prisma.timelineItem.create({
            data: {
                ...data,
                order: data.order ?? 0,
            },
        });
        revalidatePath('/admin/timeline');
        revalidatePath('/');
        return { success: true, item: newItem };
    } catch (error) {
        console.error('Error creating timeline item:', error);
        return { success: false, error: 'Failed to create item' };
    }
}

export async function updateTimelineItem(id: string, data: {
    year?: string;
    title?: string;
    provider?: string;
    desc?: string;
    type?: string;
    order?: number;
}) {
    try {
        const updatedItem = await prisma.timelineItem.update({
            where: { id },
            data,
        });
        revalidatePath('/admin/timeline');
        revalidatePath('/');
        return { success: true, item: updatedItem };
    } catch (error) {
        console.error('Error updating timeline item:', error);
        return { success: false, error: 'Failed to update item' };
    }
}

export async function deleteTimelineItem(id: string) {
    try {
        await prisma.timelineItem.delete({
            where: { id },
        });
        revalidatePath('/admin/timeline');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error deleting timeline item:', error);
        return { success: false, error: 'Failed to delete item' };
    }
}

export async function reorderTimelineItems(items: { id: string; order: number }[]) {
    try {
        const transaction = items.map((item) =>
            prisma.timelineItem.update({
                where: { id: item.id },
                data: { order: item.order },
            })
        );

        await prisma.$transaction(transaction);

        revalidatePath('/admin/timeline');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error reordering timeline items:', error);
        return { success: false, error: 'Failed to reorder items' };
    }
}
