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
            // Detect when section enters just below the fixed header
            // Header is ~100px tall, so trigger slightly below it
            const triggerPoint = window.scrollY + 150;

            let foundSection = '';

            // Check sections in reverse order to find current section
            for (let i = sections.length - 1; i >= 0; i--) {
                const section = document.getElementById(sections[i]);
                if (section) {
                    const sectionTop = section.offsetTop;
                    const sectionBottom = sectionTop + section.offsetHeight;

                    // If trigger point is within this section's boundaries
                    if (triggerPoint >= sectionTop && triggerPoint < sectionBottom) {
                        // Highlight the NEXT section instead of current one
                        const nextIndex = i + 1;
                        if (nextIndex < sections.length) {
                            foundSection = sections[nextIndex];
                        } else {
                            // If we're at the last section, keep it highlighted
                            foundSection = sections[i];
                        }
                        break;
                    }
                }
            }

            // Only update if the active section changed
            if (foundSection !== activeSection) {
                setActiveSection(foundSection);
            }
        };

        // Initial check
        handleScroll();

        // Add scroll listener
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [sections, offset, activeSection]);

    return activeSection;
}
