'use client';

import { useState, useEffect } from 'react';
import styles from './ThemeToggle.module.css';

// Unused imports removed: Sun, Moon, motion


export const ThemeToggle = () => {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
        if (savedTheme && savedTheme !== theme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // Helper to get class from CSS module
    // Using a simpler approach: import styles from './ThemeToggle.module.css'
    // and access properties.
    // Since we have many dashed class names, we'll need to use bracket notation.

    return (
        <label className={styles['bb8-toggle']} style={{ fontSize: '10px' }}>
            <input
                className={styles['bb8-toggle__checkbox']}
                type="checkbox"
                checked={theme === 'dark'}
                onChange={toggleTheme}
                aria-label="Toggle Night Mode"
            />
            <div className={styles['bb8-toggle__container']}>
                <div className={styles['bb8-toggle__scenery']}>
                    {/* Stars */}
                    <div className={styles['bb8-toggle__star']}></div>
                    <div className={styles['bb8-toggle__star']}></div>
                    <div className={styles['bb8-toggle__star']}></div>
                    <div className={styles['bb8-toggle__star']}></div>
                    <div className={styles['bb8-toggle__star']}></div>
                    <div className={styles['bb8-toggle__star']}></div>
                    <div className={styles['bb8-toggle__star']}></div>

                    {/* Planets/Moons */}
                    <div className={styles['tatto-1']}></div>
                    <div className={styles['tatto-2']}></div>
                    <div className={styles['gomrassen']}></div>
                    <div className={styles['hermes']}></div>
                    <div className={styles['chenini']}></div>

                    {/* Clouds */}
                    <div className={styles['bb8-toggle__cloud']}></div>
                    <div className={styles['bb8-toggle__cloud']}></div>
                    <div className={styles['bb8-toggle__cloud']}></div>
                </div>

                <div className={styles['bb8']}>
                    <div className={styles['bb8__head-container']}>
                        <div className={styles['bb8__antenna']}></div>
                        <div className={styles['bb8__antenna']}></div>
                        <div className={styles['bb8__head']}></div>
                    </div>
                    <div className={styles['bb8__body']}></div>
                </div>

                <div className={styles['artificial__hidden']}>
                    <div className={styles['bb8__shadow']}></div>
                </div>
            </div>
        </label>
    );
};
