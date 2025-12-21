'use client';

import { motion } from 'framer-motion';

export const SectionDivider = ({ variant = 'line' }: { variant?: 'line' | 'dots' }) => {
    return (
        <div className="container" style={{ position: 'relative', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {variant === 'line' ? (
                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    whileInView={{ width: '100%', opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, var(--glass-border), var(--primary), var(--glass-border), transparent)',
                    }}
                />
            ) : (
                <div style={{ display: 'flex', gap: '20px' }}>
                    {[1, 2, 3].map((i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2, duration: 0.5 }}
                            style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: i === 2 ? 'var(--primary)' : 'var(--glass-border)',
                                boxShadow: i === 2 ? '0 0 10px var(--primary-glow)' : 'none',
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
