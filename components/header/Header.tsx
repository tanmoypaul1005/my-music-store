"use client"
import { message } from 'antd';
import ThemeToggler from '../theme/ThemeToggler';
import styles from './Header.module.scss'

const Header = () => {

    const [messageApi, contextHolder] = message.useMessage();

    const toggleSidebar = () => {
        window.dispatchEvent(new CustomEvent('toggleSidebar'));
    };
  
    return <header className={styles.header}>
        <button className={styles.menuButton} onClick={toggleSidebar} aria-label="Toggle menu">
            <span className={styles.hamburger}></span>
            <span className={styles.hamburger}></span>
            <span className={styles.hamburger}></span>
        </button>
        <div className={styles.box}>
            <ThemeToggler />
        </div>
        {contextHolder}
    </header>
}

export default Header;