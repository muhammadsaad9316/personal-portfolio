'use client';

import { Github, Linkedin, Twitter, Mail, ArrowUp, Send } from 'lucide-react';
import { Magnetic } from '@/components/ui/Magnetic';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import styles from './Footer.module.css';

export default function Footer() {
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 1000);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.brandSide}>
                        <div className={styles.logo}>M. Saad</div>
                        <p className={styles.quote}>
                            "The only way to do great work is to love what you do."
                        </p>
                        <div className={styles.socials}>
                            <Magnetic>
                                <a href="https://github.com/muhammadsaad9316" target="_blank" className={styles.socialIcon}>
                                    <Github size={20} />
                                </a>
                            </Magnetic>
                            <Magnetic>
                                <a href="https://www.linkedin.com/in/muhammad-saad-529102230/" target="_blank" className={styles.socialIcon}>
                                    <Linkedin size={20} />
                                </a>
                            </Magnetic>
                            <Magnetic>
                                <a href="https://twitter.com" target="_blank" className={styles.socialIcon}>
                                    <Twitter size={20} />
                                </a>
                            </Magnetic>
                        </div>
                    </div>

                    <div>
                        <h4 className={styles.subheading}>Navigation</h4>
                        <div className={styles.links}>
                            <a href="#" className={styles.link}>Home</a>
                            <a href="#about" className={styles.link}>About</a>
                            <a href="#skills" className={styles.link}>Skills</a>
                            <a href="#projects" className={styles.link}>Projects</a>
                        </div>
                    </div>

                    <div>
                        <h4 className={styles.subheading}>Say Hello</h4>
                        <div className={styles.links}>
                            <a href="mailto:sd9316841122@gmail.com" className={styles.link}>sd9316841122@gmail.com</a>
                            <a href="#contact" className={styles.link}>Contact Form</a>
                        </div>
                    </div>

                    <div className={styles.newsletter}>
                        <h4 className={styles.subheading}>Newsletter</h4>
                        <p>Stay updated with my latest projects and articles.</p>
                        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Email Address"
                                className={styles.input}
                            />
                            <button type="submit" className={styles.subscribeBtn}>
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <div className={styles.copy}>
                        &copy; {new Date().getFullYear()} Muhammad Saad. Crafting digital experiences.
                    </div>
                    <div className={styles.status}>
                        <div className={styles.statusIndicator} />
                        <span>Currently reading: <b>Clean Code</b></span>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showBackToTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={styles.backToTop}
                        onClick={scrollToTop}
                        aria-label="Back to top"
                    >
                        <ArrowUp size={24} />
                    </motion.button>
                )}
            </AnimatePresence>
        </footer>
    );
}
