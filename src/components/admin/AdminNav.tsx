'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import styles from './AdminNav.module.css';
import { FaProjectDiagram, FaCode, FaNewspaper, FaCog, FaHome, FaSignOutAlt } from 'react-icons/fa';

export default function AdminNav() {
    const pathname = usePathname();

    const links = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: <FaHome /> },
        { href: '/admin/messages', label: 'Messages', icon: <FaNewspaper /> },
        { href: '/admin/content', label: 'Content', icon: <FaCog /> },
        { href: '/admin/projects', label: 'Projects', icon: <FaProjectDiagram /> },
        { href: '/admin/skills', label: 'Skills', icon: <FaCode /> },
    ];

    return (
        <nav className={styles.nav}>
            <div className={styles.logo}>CMS Admin</div>
            <div className={styles.links}>
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`${styles.link} ${pathname === link.href ? styles.active : ''}`}
                    >
                        <span className={styles.icon}>{link.icon}</span>
                        {link.label}
                    </Link>
                ))}
            </div>
            <button onClick={() => signOut()} className={styles.logout}>
                <FaSignOutAlt /> Logout
            </button>
        </nav>
    );
}
