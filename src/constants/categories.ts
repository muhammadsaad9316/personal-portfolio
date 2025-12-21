export const SKILL_CATEGORIES = [
    'Frontend',
    'Backend',
    'Cybersecurity',
    'Tools',
    'Soft Skills'
] as const;

export type SkillCategory = typeof SKILL_CATEGORIES[number];
