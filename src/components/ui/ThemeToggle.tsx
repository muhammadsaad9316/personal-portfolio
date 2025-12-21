'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export const ThemeToggle = () => {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
        if (savedTheme) {
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

    return (
        <motion.button
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:opacity-80 transition-opacity"
            style={{ background: 'transparent', border: 'none' }}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            aria-label="Toggle Theme"
        >
            {theme === 'dark' ? (
                <Sun size={22} className="text-warning" />
            ) : (
                <Moon size={22} className="text-primary" />
            )}
        </motion.button>
    );
};
