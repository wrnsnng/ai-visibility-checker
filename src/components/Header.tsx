import { useEffect, useState } from 'react';
import { Sun, Moon, Eye } from 'lucide-react';
import styles from './Header.module.css';

export function Header() {
  const [theme, setTheme] = useState(() => {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <Eye size={18} strokeWidth={2.5} />
          </div>
          <span className={styles.logoText}>AI Visibility Checker</span>
        </a>
        <button
          onClick={toggle}
          className={styles.themeToggle}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
