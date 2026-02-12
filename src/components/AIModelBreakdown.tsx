import { Brain } from 'lucide-react';
import type { AIModelScore } from '../lib/aiModelBreakdown';
import styles from './AIModelBreakdown.module.css';

interface AIModelBreakdownProps {
  scores: AIModelScore[];
}

export function AIModelBreakdown({ scores }: AIModelBreakdownProps) {
  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <Brain size={20} className={styles.headerIcon} />
        <div>
          <h3 className={styles.title}>AI model breakdown</h3>
          <p className={styles.subtitle}>Estimated visibility per AI system based on which signals each model prioritizes</p>
        </div>
      </div>

      <div className={styles.grid}>
        {scores.map((s) => {
          const color =
            s.score >= 75 ? 'var(--color-pass)' :
            s.score >= 50 ? 'var(--color-warning)' :
            'var(--color-fail)';

          return (
            <div key={s.model} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.modelIcon}>{s.icon}</span>
                <span className={styles.modelName}>{s.model}</span>
              </div>
              <div className={styles.scoreRow}>
                <span className={styles.score} style={{ color }}>{s.score}</span>
                <span className={styles.label} style={{ color }}>{s.label}</span>
              </div>
              <div className={styles.bar}>
                <div
                  className={styles.barFill}
                  style={{ width: `${s.score}%`, background: color }}
                />
              </div>
              <p className={styles.emphasis}>Weighs: {s.emphasis}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
