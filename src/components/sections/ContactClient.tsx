'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mail, Phone, MapPin, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import styles from './Contact.module.css';

export default function ContactClient() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('Something went wrong. Please try again.');
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('Something went wrong. Please try again.');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, turnstileToken })
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' });
                setTurnstileToken(null);
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setErrorMessage(data.error || 'Something went wrong. Please try again.');
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
            setErrorMessage('Network error. Please try again.');
            setTurnstileToken(null);
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    return (
        <section id="contact" className={styles.section}>
            <div className="mesh-gradient" />
            <div className="container">
                <div className={styles.grid}>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className={styles.info}
                    >
                        <h2 className={styles.title}>Let's Build Something Great</h2>
                        <p className={styles.description}>
                            Whether you have a specific project in mind or just want to say hi, my inbox is always open.
                        </p>

                        <div className={styles.contactMethods}>
                            <div className={styles.method}>
                                <div className={styles.iconWrapper}>
                                    <Mail size={24} />
                                </div>
                                <div className={styles.methodText}>
                                    <h4>Email</h4>
                                    <p>sd9316841122@gmail.com</p>
                                </div>
                            </div>

                            <div className={styles.method}>
                                <div className={styles.iconWrapper}>
                                    <MapPin size={24} />
                                </div>
                                <div className={styles.methodText}>
                                    <h4>Location</h4>
                                    <p>Mardan, KP, Pakistan</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    className={styles.input}
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    className={styles.input}
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    required
                                    className={styles.textarea}
                                    placeholder="Tell me about your project..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>

                            <AnimatePresence mode="wait">
                                {status === 'success' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={styles.successMsg}
                                    >
                                        <CheckCircle2 size={20} />
                                        <span>Message sent! I'll get back to you soon.</span>
                                    </motion.div>
                                )}

                                {status === 'error' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={styles.errorMsg}
                                    >
                                        <AlertCircle size={20} />
                                        <span>{errorMessage}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Cloudflare Turnstile */}
                            <div className={styles.turnstileWrapper}>
                                <Turnstile
                                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                                    onSuccess={(token) => setTurnstileToken(token)}
                                    onError={() => setTurnstileToken(null)}
                                    onExpire={() => setTurnstileToken(null)}
                                />
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={status === 'loading' || !turnstileToken}
                                className={styles.submitBtn}
                            >
                                {status === 'loading' ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        <span>Send Message</span>
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
