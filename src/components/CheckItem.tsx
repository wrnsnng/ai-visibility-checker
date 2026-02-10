import { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  ChevronDown,
} from 'lucide-react';
import type { CheckResult, CheckStatus } from '../types';
import styles from './CheckItem.module.css';

const statusIcons: Record<CheckStatus, React.ElementType> = {
  pass: CheckCircle2,
  warning: AlertTriangle,
  fail: XCircle,
};

interface CheckItemProps {
  check: CheckResult;
}

export function CheckItem({ check }: CheckItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const StatusIcon = statusIcons[check.status];

  const handleCopy = async () => {
    if (!check.fixSnippet) return;
    try {
      await navigator.clipboard.writeText(check.fixSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // noop
    }
  };

  return (
    <div className={styles.item} data-status={check.status}>
      <button
        className={styles.header}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <div className={styles.headerLeft}>
          <StatusIcon size={16} className={styles.statusIcon} />
          <span className={styles.title}>{check.title}</span>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.summary}>{check.summary}</span>
          <ChevronDown
            size={14}
            className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`}
          />
        </div>
      </button>

      {expanded && (
        <div className={styles.body}>
          <p className={styles.details}>{check.details}</p>

          {check.fixSnippet && (
            <div className={styles.fixBlock}>
              <div className={styles.fixHeader}>
                <span className={styles.fixLabel}>{check.fixLabel || 'Suggested fix'}</span>
                <button onClick={handleCopy} className={styles.copyBtn}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <pre className={styles.fixCode}>
                <code>{check.fixSnippet}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
