'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkAuth } from './utils';

export async function deleteMessage(messageId: string) {
    try {
        await checkAuth();

        await prisma.message.delete({
            where: {
                id: messageId,
            },
        });

        revalidatePath('/admin/messages');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete message:', error);
        return { error: 'Failed to delete message' };
    }
}
