import { Lock, Sparkles, Code, FileDown, Users, ListOrdered, Brain } from 'lucide-react';
import { initiateCheckout, setDemoMode } from '../lib/paidState';
import styles from './UpgradeGate.module.css';

interface UpgradeGateProps {
  onUnlocked: () => void;
}

const features = [
  { icon: Code, label: 'Copy-pasteable fix snippets for every issue' },
  { icon: FileDown, label: 'Download a branded PDF report' },
  { icon: Users, label: 'Compare up to 3 competitor URLs side by side' },
  { icon: ListOrdered, label: 'Priority recommendations ranked by impact' },
  { icon: Brain, label: 'Visibility breakdown per AI model' },
];

export function UpgradeGate({ onUnlocked }: UpgradeGateProps) {
  const handlePurchase = async () => {
    await initiateCheckout();
    onUnlocked();
  };

  const handlePreview = () => {
    setDemoMode(true);
    window.dispatchEvent(new Event('aiv-access-changed'));
    onUnlocked();
  };

  return (
    <div className={styles.gate}>
      {/* Blurred preview */}
      <div className={styles.previewSection}>
        <div className={styles.previewRows}>
          <div className={styles.previewRow}>
            <div className={styles.previewDot} data-color="red" />
            <div className={styles.previewText}>
              <div className={styles.previewLine} style={{ width: '70%' }} />
              <div className={styles.previewLine} style={{ width: '45%' }} />
            </div>
          </div>
          <div className={styles.previewRow}>
            <div className={styles.previewDot} data-color="yellow" />
            <div className={styles.previewText}>
              <div className={styles.previewLine} style={{ width: '60%' }} />
              <div className={styles.previewLine} style={{ width: '55%' }} />
            </div>
          </div>
          <div className={styles.previewRow}>
            <div className={styles.previewDot} data-color="green" />
            <div className={styles.previewText}>
              <div className={styles.previewLine} style={{ width: '80%' }} />
              <div className={styles.previewLine} style={{ width: '40%' }} />
            </div>
          </div>
        </div>
        <div className={styles.previewOverlay}>
          <Lock size={20} />
        </div>
      </div>

      {/* CTA content */}
      <div className={styles.content}>
        <div className={styles.badge}>
          <Sparkles size={14} />
          <span>Full report</span>
        </div>
        <h3 className={styles.title}>Get the complete picture</h3>
        <p className={styles.desc}>
          Unlock detailed fix snippets, priority recommendations, competitor comparison,
          AI model breakdown, and PDF export.
        </p>

        <ul className={styles.featureList}>
          {features.map((f) => (
            <li key={f.label} className={styles.featureItem}>
              <f.icon size={16} className={styles.featureIcon} />
              <span>{f.label}</span>
            </li>
          ))}
        </ul>

        <button onClick={handlePurchase} className={styles.purchaseBtn}>
          Unlock full report for $9
        </button>
        <button onClick={handlePreview} className={styles.previewBtn}>
          Preview paid features (demo)
        </button>
      </div>
    </div>
  );
}
