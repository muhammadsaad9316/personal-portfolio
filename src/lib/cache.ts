import { cache } from 'react';
import { prisma } from './prisma';

/**
 * Optimized database queries with React cache
 * These functions are automatically deduplicated during a single request
 */

export const getCachedSkills = cache(async () => {
    return prisma.skill.findMany({
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
});

export const getCachedFeaturedProjects = cache(async () => {
    return prisma.project.findMany({
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
        },
    });
});

export const getCachedHeroContent = cache(async () => {
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
});

export const getCachedAboutContent = cache(async () => {
    const contentRecord = await prisma.pageContent.findUnique({
        where: { pageSlug_section: { pageSlug: 'home', section: 'about' } },
    });

    return contentRecord?.content ? JSON.parse(contentRecord.content) : null;
});

export const getCachedContactMessages = cache(async () => {
    return prisma.message.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50, // Limit to recent messages
    });
});
