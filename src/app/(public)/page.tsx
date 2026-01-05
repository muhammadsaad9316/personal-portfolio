import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import FeaturedProjects from '@/components/sections/FeaturedProjects';
import PasswordTool from '@/components/sections/PasswordTool';
import Contact from '@/components/sections/Contact';
import { SectionDivider } from '@/components/ui/SectionDivider';
import { getCachedSkills } from '@/lib/cache';

export const revalidate = 3600;

export default async function Home() {
    const skills = await getCachedSkills();

    return (
        <>
            <Hero />
            <SectionDivider variant="line" />
            <About />
            <SectionDivider variant="dots" />
            <Skills skills={skills} />
            <SectionDivider variant="line" />
            <FeaturedProjects />
            <SectionDivider variant="dots" />
            <PasswordTool />
            <SectionDivider variant="line" />
            <Contact />
        </>
    );
}
