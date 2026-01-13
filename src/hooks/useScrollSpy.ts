import { useState, useEffect } from 'react';

interface UseScrollSpyOptions {
    sections: string[];
    offset?: number;
}

export function useScrollSpy({ sections, offset = 0 }: UseScrollSpyOptions): string {
    const [activeSection, setActiveSection] = useState<string>('');

    useEffect(() => {
        const handleScroll = () => {
            // Find the first section that is active (top of section is above the offset line)
            // We iterate in reverse to find the last one that matches the criteria
            // OR we can iterate forwards and find the last one whose top is <= scroll + offset

            const scrollPosition = window.scrollY + offset;

            let currentSection = '';

            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    // Check if the scroll position is within the section
                    if (
                        scrollPosition >= offsetTop &&
                        scrollPosition < offsetTop + offsetHeight
                    ) {
                        currentSection = sectionId;
                    }
                }
            }

            // Fallback: if we are at the very top, maybe none match if the first section has margin
            // But typically checking if scrollPosition >= offsetTop is enough.
            // Let's refine the logic to be "closest section to the top" or similar.

            // Better approach often used:
            // Find the section whose top is closest to the viewport top (plus offset)
            // but still "past" the viewport top.

            // Let's stick to the range check above. It's solid if sections are contiguous.
            // If we didn't find one in the exact range (e.g. gaps), we might want to keep the previous one
            // or find the nearest one.

            // Actually, a simpler standard approach:
            // Active is the last section whose offsetTop is <= scrollPosition

            let maxSectionId = '';
            let maxSectionTop = -Infinity;

            sections.forEach((sectionId) => {
                const element = document.getElementById(sectionId);
                if (element) {
                    const top = element.offsetTop;
                    if (scrollPosition >= top) {
                        if (top > maxSectionTop) {
                            maxSectionTop = top;
                            maxSectionId = sectionId;
                        }
                    }
                }
            });

            if (maxSectionId) {
                setActiveSection(maxSectionId);
            } else if (sections.length > 0 && window.scrollY < (document.getElementById(sections[0])?.offsetTop || 0)) {
                // Before the first section
                setActiveSection('');
            }
        };

        // Initial check
        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sections, offset]);

    return activeSection;
}
