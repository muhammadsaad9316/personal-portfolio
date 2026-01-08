'use server';

import { auth } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function checkAuth() {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }
}

// Helper to save uploaded file
export async function saveImageFile(file: File): Promise<string | null> {
    if (!file || file.size === 0) return null;

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const uploadDir = path.join(process.cwd(), 'public/uploads');

    try {
        await writeFile(path.join(uploadDir, filename), buffer);
        return `/uploads/${filename}`;
    } catch (error) {
        console.error('Error saving file:', error);
        throw new Error('Failed to save image file');
    }
}
