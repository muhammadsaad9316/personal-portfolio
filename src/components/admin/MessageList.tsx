'use client';

import { useState, useTransition } from 'react';
import { FaRegCopy, FaCheck, FaRegEnvelope, FaCalendarAlt, FaTrash } from 'react-icons/fa';
import styles from './MessageList.module.css';
import { deleteMessage } from '@/actions/messages';

interface Message {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: Date;
}

export default function MessageList({ messages }: { messages: Message[] }) {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleCopyEmail = (email: string, id: string) => {
        navigator.clipboard.writeText(email);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this message?')) {
            startTransition(async () => {
                await deleteMessage(id);
            });
        }
    };

    if (messages.length === 0) {
        return (
            <div className={styles.emptyState}>
                <FaRegEnvelope size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <h3>No Messages Yet</h3>
                <p>When someone contacts you via the form, it will show up here.</p>
            </div>
        );
    }

    return (
        <div className={styles.grid}>
            {messages.map((msg) => (
                <div key={msg.id} className={styles.card}>
                    <div className={styles.header}>
                        <div className={styles.userInfo}>
                            <h4 className={styles.name}>{msg.name}</h4>
                            <a href={`mailto:${msg.email}`} className={styles.email}>
                                <FaRegEnvelope size={12} /> {msg.email}
                            </a>
                        </div>
                        <div className={styles.meta}>
                            <span className={styles.date}>
                                <FaCalendarAlt size={10} style={{ marginRight: '4px' }} />
                                {new Date(msg.createdAt).toLocaleDateString(undefined, {
                                    month: 'short', day: 'numeric', year: 'numeric'
                                })}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>

                    <div className={styles.messageBody}>
                        {msg.message}
                    </div>

                    <div className={styles.actions}>
                        <button
                            className={styles.actionBtn}
                            onClick={() => handleCopyEmail(msg.email, msg.id)}
                            title="Copy Email"
                        >
                            {copiedId === msg.id ? <FaCheck size={14} color="#10b981" /> : <FaRegCopy size={14} />}
                        </button>
                        <button
                            className={styles.actionBtn}
                            onClick={() => handleDelete(msg.id)}
                            title="Delete Message"
                            disabled={isPending}
                        >
                            <FaTrash size={14} color={isPending ? "#ccc" : "#ef4444"} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
