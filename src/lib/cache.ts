import { cache } from 'react';
import { prisma } from './prisma';

/**
 * Optimized database queries with React cache
 * These functions are automatically deduplicated during a single request
 */

export const getCachedSkills = cache(async () => {
    try {
        return await prisma.skill.findMany({
            orderBy: { order: 'asc' },
            select: {
                id: true,
                name: true,
                category: true,
                order: true,
                icon: true,
                proficiency: true,
                yearsOfExperience: true,
                projectCount: true,
            },
        });
    } catch (error) {
        console.error('[getCachedSkills] Database query failed:', error);
        // Return empty array to prevent page crash
        return [];
    }
});

export const getCachedFeaturedProjects = cache(async () => {
    try {
        return await prisma.project.findMany({
            where: { featured: true },
            orderBy: { order: 'asc' },
            select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                imageUrl: true,
                demoUrl: true,
                repoUrl: true,
                tags: true,
                status: true,
                technologies: true,
                caseStudy: true,
                createdAt: true,
                updatedAt: true,
                category: true,
                featured: true,
                order: true,
            },
        });
    } catch (error) {
        console.error('[getCachedFeaturedProjects] Database query failed:', error);
        // Return empty array to prevent page crash
        return [];
    }
});

export const getCachedHeroContent = cache(async () => {
    try {
        const contentRecord = await prisma.pageContent.findUnique({
            where: { pageSlug_section: { pageSlug: 'home', section: 'hero' } },
        });

        return contentRecord?.content
            ? JSON.parse(contentRecord.content)
            : {
                title: 'Muhammad Saad',
                subtitle: 'Computer Science Student',
                description: 'Based in Mardan, KP. Passionate about Full Stack Development and Cybersecurity. Currently in 5th Semester BSCS.'
            };
    } catch (error) {
        console.error('[getCachedHeroContent] Database query failed:', error);
        // Return default hero content to prevent page crash
        return {
            title: 'Muhammad Saad',
            subtitle: 'Computer Science Student',
            description: 'Based in Mardan, KP. Passionate about Full Stack Development and Cybersecurity. Currently in 5th Semester BSCS.'
        };
    }
});

export const getCachedAboutContent = cache(async () => {
    try {
        const contentRecord = await prisma.pageContent.findUnique({
            where: { pageSlug_section: { pageSlug: 'home', section: 'about' } },
        });

        return contentRecord?.content ? JSON.parse(contentRecord.content) : null;
    } catch (error) {
        console.error('[getCachedAboutContent] Database query failed:', error);
        // Return null to allow component to use default/fallback content
        return null;
    }
});

export const getCachedContactMessages = cache(async () => {
    try {
        return await prisma.message.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50, // Limit to recent messages
        });
    } catch (error) {
        console.error('[getCachedContactMessages] Database query failed:', error);
        // Return empty array to prevent admin panel crash
        return [];
    }
});
