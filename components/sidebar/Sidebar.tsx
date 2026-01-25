"use client"
import { useState, useEffect } from 'react';
import SidebarLogo from './SidebarLogo';
import SidebarMenu from './SidebarMenu';

import styles from './Sidebar.module.scss'

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleToggle = () => {
            setIsOpen(prev => !prev);
        };

        const handleClickOutside = (e: MouseEvent) => {
            const sidebar = document.querySelector(`.${styles.sidebar}`);
            const menuButton = document.querySelector('[aria-label="Toggle menu"]');
            if (sidebar && !sidebar.contains(e.target as Node) && !menuButton?.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        window.addEventListener('toggleSidebar', handleToggle);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('toggleSidebar', handleToggle);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
            <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <SidebarLogo />
                <SidebarMenu />
            </div>
        </>
    );
}

export default Sidebar;