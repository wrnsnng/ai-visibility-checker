import { Eye, X } from 'lucide-react';
import { clearAllAccess } from '../lib/paidState';
import styles from './DemoBanner.module.css';

interface DemoBannerProps {
  onExit: () => void;
}

export function DemoBanner({ onExit }: DemoBannerProps) {
  const handleExit = () => {
    clearAllAccess();
    window.dispatchEvent(new Event('aiv-access-changed'));
    onExit();
  };

  return (
    <div className={styles.banner}>
      <div className={styles.inner}>
        <Eye size={14} />
        <span className={styles.text}>
          You are previewing paid features in demo mode
        </span>
        <button onClick={handleExit} className={styles.exitBtn}>
          <span>Exit demo</span>
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
