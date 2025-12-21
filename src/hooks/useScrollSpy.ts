'use client';

import { useEffect, useState } from 'react';

interface ScrollSpyProps {
    sections: string[];
    offset?: number;
}

export function useScrollSpy({ sections, offset = 100 }: ScrollSpyProps) {
    const [activeSection, setActiveSection] = useState<string>('');

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + offset;

            // Find the current section
            for (let i = sections.length - 1; i >= 0; i--) {
                const section = document.getElementById(sections[i]);
                if (section) {
                    const sectionTop = section.offsetTop;
                    const sectionBottom = sectionTop + section.offsetHeight;

                    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                        setActiveSection(sections[i]);
                        break;
                    }
                }
            }

            // Handle top of page
            if (window.scrollY < 100) {
                setActiveSection('');
            }
        };

        // Initial check
        handleScroll();

        // Add scroll listener
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [sections, offset]);

    return activeSection;
}
