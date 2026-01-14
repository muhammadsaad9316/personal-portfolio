import { prisma } from '@/lib/prisma';
import AboutClient from './AboutClient';

export default async function About() {
    // Fetch PageContent for Bio/Label
    const contentRecord = await prisma.pageContent.findUnique({
        where: { pageSlug_section: { pageSlug: 'home', section: 'about' } },
    });

    const content = contentRecord?.content
        ? JSON.parse(contentRecord.content)
        : {
            title: 'About Me',
            bio: 'I am a passionate Full Stack Developer and Cybersecurity Enthusiast currently pursuing my BS in Computer Science.\n\nMy journey began with a curiosity for how systems work, which evolved into a professional pursuit of building secure, scalable, and user-centric applications. I specialize in the MERN stack with a strong focus on security best practices.\n\nBeyond coding, I am an active student leader at Abdul Wali Khan University Mardan, where I mentor juniors and lead technical workshops.'
        };

    // Fetch dynamic timeline items
    const timelineItems = await prisma.timelineItem.findMany({
        orderBy: { order: 'asc' }
    });

    // If no dynamic items exist, use the fallback legacy structure (migration safety)
    let education = timelineItems;

    if (timelineItems.length === 0) {
        education = (content.education && Array.isArray(content.education))
            ? content.education
            : [
                {
                    year: '2023 - 2027',
                    title: 'BS Computer Science',
                    provider: 'Abdul Wali Khan University Mardan',
                    desc: 'Currently in 5th Semester. Deepening knowledge in Algorithms, Database Management Systems, and Web Security.',
                    type: 'education'
                },
                {
                    year: '2021 - 2023',
                    title: 'FSc (Pre-Engineering)',
                    provider: 'Superior College',
                    desc: 'Graduated with a strong foundation in Mathematics and Physics, providing the bedrock for my engineering journey.',
                    type: 'education'
                },
            ];
    }

    // Ensure type compatibility (Client expects specific fields)
    const educationTyped = education.map((item: any) => ({
        year: item.year,
        title: item.title,
        provider: item.provider,
        desc: item.desc,
        type: item.type || 'education'
    }));

    return <AboutClient content={content} education={educationTyped} />;
}
