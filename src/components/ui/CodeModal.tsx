'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Terminal, Command, Info } from 'lucide-react';
import { useState } from 'react';
import styles from './CodeModal.module.css';

interface CodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    code: string;
    language?: string;
    context?: string;
}

export const CodeModal = ({
    isOpen,
    onClose,
    title,
    code,
    language = 'typescript',
    context = 'Standard industry implementation following clean code principles and architectural best practices.'
}: CodeModalProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className={styles.modalOverlay}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className={styles.backdrop}
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 30 }}
                        className={styles.modalContent}
                    >
                        {/* Title Bar */}
                        <div className={styles.header}>
                            <div className={styles.headerLeft}>
                                <div className={styles.windowButtons}>
                                    <div className={`${styles.dot} ${styles.dotRed}`} />
                                    <div className={`${styles.dot} ${styles.dotAmber}`} />
                                    <div className={`${styles.dot} ${styles.dotGreen}`} />
                                </div>
                                <div className={styles.divider} />
                                <div className={styles.titleWrapper}>
                                    <Terminal size={14} />
                                    <span>{title}</span>
                                </div>
                            </div>

                            <div className={styles.headerRight}>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleCopy}
                                    className={styles.copyBtn}
                                >
                                    {copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
                                    {copied ? 'Copied!' : 'Copy snippet'}
                                </motion.button>
                                <button
                                    onClick={onClose}
                                    className={styles.closeBtn}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Code Implementation */}
                        <div className={styles.body}>
                            <div className={styles.codeBlockWrapper}>
                                <pre className={styles.codePre}>
                                    <code className={styles.code}>
                                        {code.trim()}
                                    </code>
                                </pre>
                            </div>
                        </div>

                        {/* Footer Context */}
                        <div className={styles.footer}>
                            <div className={styles.contextWrapper}>
                                <Info size={16} style={{ color: 'var(--primary)' }} />
                                <p className={styles.contextText}>
                                    {context}
                                </p>
                            </div>
                            <div className={styles.langBadge}>
                                <Command size={10} />
                                <span>{language}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
