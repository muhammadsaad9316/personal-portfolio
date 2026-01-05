import { z } from 'zod';

/**
 * Contact Form Validation Schema
 */
export const contactFormSchema = z.object({
    name: z.string()
        .min(1, 'Name is required')
        .max(100, 'Name must be less than 100 characters')
        .trim(),
    email: z.string()
        .min(1, 'Email is required')
        .email('Please provide a valid email address')
        .max(100, 'Email must be less than 100 characters')
        .transform(val => val.toLowerCase().trim()),
    subject: z.string()
        .max(200, 'Subject must be less than 200 characters')
        .trim()
        .optional()
        .default('No Subject'),
    message: z.string()
        .min(1, 'Message is required')
        .max(5000, 'Message must be less than 5000 characters')
        .trim(),
    turnstileToken: z.string()
        .min(1, 'Bot verification is required'),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

/**
 * Project Validation Schema
 */
export const projectSchema = z.object({
    title: z.string()
        .min(1, 'Title is required')
        .max(200, 'Title must be less than 200 characters')
        .trim(),
    description: z.string()
        .min(1, 'Description is required')
        .max(500, 'Description must be less than 500 characters')
        .trim(),
    content: z.string()
        .min(1, 'Content is required')
        .trim(),
    imageUrl: z.string().optional().or(z.literal('')),
    demoUrl: z.string().optional().or(z.literal('')),
    repoUrl: z.string().optional().or(z.literal('')),
    tags: z.string()
        .min(1, 'At least one tag is required')
        .trim(),
    status: z.enum(['Live', 'In Development', 'Completed'])
        .default('Completed'),
    technologies: z.string().optional(),
    caseStudy: z.string().optional(),
    category: z.string().trim().default('Featured Work'),
    featured: z.boolean().default(false),
});

export type ProjectInput = z.infer<typeof projectSchema>;

/**
 * Skill Validation Schema
 */
export const skillSchema = z.object({
    name: z.string()
        .min(1, 'Skill name is required')
        .max(100, 'Skill name must be less than 100 characters')
        .trim(),
    category: z.string()
        .min(1, 'Category is required')
        .max(50, 'Category must be less than 50 characters')
        .trim(),
    icon: z.string().optional(),
    proficiency: z.number()
        .min(1, 'Proficiency must be at least 1')
        .max(100, 'Proficiency cannot exceed 100')
        .optional(),
    yearsOfExperience: z.number().min(0).default(0),
    projectCount: z.number().min(0).default(0),
});

export type SkillInput = z.infer<typeof skillSchema>;
/**
 * Page Content Validation Schema
 */
export const pageContentSchema = z.object({
    pageSlug: z.string()
        .min(1, 'Page slug is required')
        .max(100)
        .trim(),
    section: z.string()
        .min(1, 'Section is required')
        .max(100)
        .trim(),
    content: z.string()
        .min(1, 'Content is required')
        .refine((val) => {
            try {
                JSON.parse(val);
                return true;
            } catch {
                return false;
            }
        }, 'Content must be valid JSON'),
    isVisible: z.boolean().default(true),
    order: z.number().default(0),
});

export type PageContentInput = z.infer<typeof pageContentSchema>;
