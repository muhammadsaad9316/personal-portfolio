'use client';

import styles from './Header.module.css';
import { Magnetic } from '@/components/ui/Magnetic';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useScrollSpy } from '@/hooks/useScrollSpy';

export default function Header() {
    const activeSection = useScrollSpy({
        sections: ['about', 'skills', 'projects', 'password-tool', 'contact'],
        offset: 200 // Balanced offset for responsive navigation
    });

    return (
        <header className={styles.header}>
            <div className={`container ${styles.container}`}>
                <a href="#" className={styles.logo}>
                    M. Saad
                </a>
                <nav className={styles.nav}>
                    {['About', 'Skills', 'Projects', 'Contact'].map((item) => {
                        const itemId = item.toLowerCase();
                        // If we are in 'password-tool', keep 'projects' active
                        const isActive = activeSection === itemId ||
                            (itemId === 'projects' && activeSection === 'password-tool');

                        return (
                            <Magnetic key={item}>
                                <a
                                    href={`#${itemId}`}
                                    className={`${styles.link} ${isActive ? styles.active : ''}`}
                                >
                                    {item}
                                </a>
                            </Magnetic>
                        );
                    })}
                </nav>
                <div className="flex items-center gap-4">
                    <Magnetic>
                        <ThemeToggle />
                    </Magnetic>
                    <Magnetic>
                        <a href="#contact" className="btn btn-primary">
                            Let's Talk
                        </a>
                    </Magnetic>
                </div>
            </div>
        </header>
    );
}
