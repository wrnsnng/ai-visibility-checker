import { useEffect, useState } from 'react';
import { Globe, Bot, Code2, FileText, Search } from 'lucide-react';
import styles from './ScanningAnimation.module.css';

const steps = [
  { icon: Globe, label: 'Connecting to site...' },
  { icon: Bot, label: 'Checking AI crawler access...' },
  { icon: Code2, label: 'Analyzing structured data...' },
  { icon: FileText, label: 'Evaluating content quality...' },
  { icon: Search, label: 'Checking discoverability...' },
];

interface ScanningAnimationProps {
  url: string;
}

export function ScanningAnimation({ url }: ScanningAnimationProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % steps.length);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const current = steps[step];
  const Icon = current.icon;

  return (
    <div className={styles.container}>
      <div className={styles.ring}>
        <div className={styles.ringInner}>
          <div className={styles.spinner} />
        </div>
        <div className={styles.iconWrapper}>
          <Icon size={28} className={styles.icon} />
        </div>
      </div>
      <div className={styles.url}>{url}</div>
      <div className={styles.label}>{current.label}</div>
      <div className={styles.dots}>
        {steps.map((_, i) => (
          <div
            key={i}
            className={`${styles.dot} ${i === step ? styles.dotActive : ''} ${i < step ? styles.dotDone : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
