import { ArrowLeft, Share2, RefreshCw, Globe } from 'lucide-react';
import type { ScanResult } from '../types';
import { averageScores } from '../data/demoResults';
import { ScoreRing } from './ScoreRing';
import { CategoryCard } from './CategoryCard';
import { ScanningAnimation } from './ScanningAnimation';
import styles from './Results.module.css';

interface ResultsProps {
  result: ScanResult | null;
  isScanning: boolean;
  url: string;
  onBack: () => void;
  onRescan: (url: string) => void;
}

export function Results({ result, isScanning, url, onBack, onRescan }: ResultsProps) {
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}?url=${encodeURIComponent(url)}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      // Could add a toast here
    } catch {
      // fallback
    }
  };

  if (isScanning) {
    return <ScanningAnimation url={url} />;
  }

  if (!result) return null;

  const scoreColor =
    result.overallScore >= 75 ? 'var(--color-pass)' :
    result.overallScore >= 50 ? 'var(--color-warning)' :
    'var(--color-fail)';

  return (
    <div className={styles.results}>
      {/* Header bar */}
      <div className={styles.topBar}>
        <button onClick={onBack} className={styles.backBtn}>
          <ArrowLeft size={18} />
          <span>New scan</span>
        </button>
        <div className={styles.actions}>
          <button onClick={() => onRescan(url)} className={styles.actionBtn}>
            <RefreshCw size={16} />
            <span>Rescan</span>
          </button>
          <button onClick={handleShare} className={styles.actionBtn}>
            <Share2 size={16} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Score Hero */}
      <div className={styles.scoreSection}>
        <ScoreRing score={result.overallScore} />
        <div className={styles.scoreMeta}>
          <div className={styles.urlDisplay}>
            <Globe size={16} className={styles.urlIcon} />
            <span>{result.url}</span>
          </div>
          <h2 className={styles.scoreTitle}>
            {result.overallScore >= 90 && 'Excellent AI Visibility'}
            {result.overallScore >= 75 && result.overallScore < 90 && 'Good AI Visibility'}
            {result.overallScore >= 50 && result.overallScore < 75 && 'Needs Improvement'}
            {result.overallScore < 50 && 'Poor AI Visibility'}
          </h2>
          <p className={styles.scoreDesc}>
            {result.overallScore >= 75 && 'AI systems can find and reference this site effectively. Keep up the great work!'}
            {result.overallScore >= 50 && result.overallScore < 75 && 'AI can partially see this site, but there are significant gaps to address.'}
            {result.overallScore < 50 && 'AI systems will struggle to find, understand, or recommend this site. There are critical issues to fix.'}
          </p>

          {/* Comparison bar */}
          <div className={styles.comparison}>
            <div className={styles.comparisonLabel}>Your site vs average</div>
            <div className={styles.comparisonBar}>
              <div className={styles.comparisonTrack}>
                <div
                  className={styles.comparisonAvg}
                  style={{ left: `${averageScores.overall}%` }}
                >
                  <span className={styles.comparisonAvgLabel}>Avg: {averageScores.overall}</span>
                </div>
                <div
                  className={styles.comparisonYou}
                  style={{ left: `${result.overallScore}%`, background: scoreColor }}
                >
                  <span className={styles.comparisonYouLabel}>You: {result.overallScore}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className={styles.categories}>
        <h3 className={styles.sectionTitle}>Category Breakdown</h3>
        {result.categories.map((cat, i) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            averageScore={averageScores[cat.id] ?? 50}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
