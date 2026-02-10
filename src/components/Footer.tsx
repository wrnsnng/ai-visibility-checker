import { ExternalLink } from 'lucide-react';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.text}>
          Built by{' '}
          <a href="https://common-tools.co" target="_blank" rel="noopener noreferrer">
            common-tools.co
            <ExternalLink size={12} className={styles.linkIcon} />
          </a>
        </span>
        <span className={styles.separator}>·</span>
        <span className={styles.text}>
          GEO is the new SEO
        </span>
      </div>
    </footer>
  );
}
