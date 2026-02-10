import { useState } from 'react';
import {
  ChevronDown,
  Bot,
  Code2,
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import type { CategoryResult, CheckStatus } from '../types';
import { CheckItem } from './CheckItem';
import styles from './CategoryCard.module.css';

const iconMap: Record<string, React.ElementType> = {
  Bot, Code2, FileText, Search,
};

const statusIcon: Record<CheckStatus, React.ElementType> = {
  pass: CheckCircle2,
  warning: AlertTriangle,
  fail: XCircle,
};

interface CategoryCardProps {
  category: CategoryResult;
  averageScore: number;
  index: number;
}

export function CategoryCard({ category, averageScore, index }: CategoryCardProps) {
  const [expanded, setExpanded] = useState(false);

  const Icon = iconMap[category.icon] || FileText;
  const scoreColor =
    category.score >= 75 ? 'var(--color-pass)' :
    category.score >= 50 ? 'var(--color-warning)' :
    'var(--color-fail)';

  const statusCounts = {
    pass: category.checks.filter((c) => c.status === 'pass').length,
    warning: category.checks.filter((c) => c.status === 'warning').length,
    fail: category.checks.filter((c) => c.status === 'fail').length,
  };

  return (
    <div
      className={styles.card}
      style={{ animationDelay: `${index * 100 + 200}ms` }}
    >
      <button
        className={styles.header}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <div className={styles.headerLeft}>
          <div className={styles.icon} style={{ color: scoreColor }}>
            <Icon size={20} />
          </div>
          <div className={styles.headerInfo}>
            <div className={styles.name}>{category.name}</div>
            <div className={styles.statusPills}>
              {(['pass', 'warning', 'fail'] as const).map((status) => {
                const count = statusCounts[status];
                if (count === 0) return null;
                const StatusIcon = statusIcon[status];
                return (
                  <span key={status} className={styles.pill} data-status={status}>
                    <StatusIcon size={12} />
                    {count}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.scoreBlock}>
            <div className={styles.scoreValue} style={{ color: scoreColor }}>
              {category.score}
            </div>
            <div className={styles.scoreBar}>
              <div className={styles.scoreBarTrack}>
                <div
                  className={styles.scoreBarFill}
                  style={{ width: `${category.score}%`, background: scoreColor }}
                />
                <div
                  className={styles.scoreBarAvg}
                  style={{ left: `${averageScore}%` }}
                  title={`Average: ${averageScore}`}
                />
              </div>
            </div>
          </div>
          <ChevronDown
            size={18}
            className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`}
          />
        </div>
      </button>

      {expanded && (
        <div className={styles.body}>
          {category.checks.map((check) => (
            <CheckItem key={check.id} check={check} />
          ))}
        </div>
      )}
    </div>
  );
}
