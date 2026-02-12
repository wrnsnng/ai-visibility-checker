import { useState } from 'react';
import {
  ListOrdered,
  AlertOctagon,
  AlertTriangle,
  Info,
  ChevronDown,
  Copy,
  Check,
} from 'lucide-react';
import type { PriorityRecommendation } from '../lib/priorityRecommendations';
import styles from './PriorityRecommendations.module.css';

interface PriorityRecommendationsProps {
  recommendations: PriorityRecommendation[];
}

const impactIcons: Record<string, React.ElementType> = {
  critical: AlertOctagon,
  high: AlertTriangle,
  medium: Info,
  low: Info,
};

export function PriorityRecommendations({ recommendations }: PriorityRecommendationsProps) {
  if (recommendations.length === 0) {
    return (
      <div className={styles.section}>
        <div className={styles.header}>
          <ListOrdered size={20} className={styles.headerIcon} />
          <div>
            <h3 className={styles.title}>Priority recommendations</h3>
            <p className={styles.subtitle}>Nothing to fix! Your site is well optimized for AI visibility.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <ListOrdered size={20} className={styles.headerIcon} />
        <div>
          <h3 className={styles.title}>Priority recommendations</h3>
          <p className={styles.subtitle}>Fixes ranked by impact on AI visibility. Start from the top for maximum improvement.</p>
        </div>
      </div>

      <div className={styles.list}>
        {recommendations.map((rec, i) => (
          <RecommendationItem key={rec.check.id} rec={rec} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}

function RecommendationItem({ rec, rank }: { rec: PriorityRecommendation; rank: number }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const ImpactIcon = impactIcons[rec.impact];

  const handleCopy = async () => {
    if (!rec.check.fixSnippet) return;
    try {
      await navigator.clipboard.writeText(rec.check.fixSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // noop
    }
  };

  return (
    <div className={styles.item} data-impact={rec.impact}>
      <button
        className={styles.itemHeader}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <span className={styles.rank}>#{rank}</span>
        <div className={styles.itemInfo}>
          <div className={styles.itemTitleRow}>
            <span className={styles.itemTitle}>{rec.check.title}</span>
            <span className={styles.impactBadge} data-impact={rec.impact}>
              <ImpactIcon size={12} />
              {rec.impact}
            </span>
          </div>
          <p className={styles.reason}>{rec.reason}</p>
        </div>
        <ChevronDown
          size={16}
          className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`}
        />
      </button>

      {expanded && (
        <div className={styles.itemBody}>
          <p className={styles.details}>{rec.check.details}</p>
          {rec.check.fixSnippet && (
            <div className={styles.fixBlock}>
              <div className={styles.fixHeader}>
                <span className={styles.fixLabel}>{rec.check.fixLabel || 'Suggested fix'}</span>
                <button onClick={handleCopy} className={styles.copyBtn}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <pre className={styles.fixCode}>
                <code>{rec.check.fixSnippet}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
