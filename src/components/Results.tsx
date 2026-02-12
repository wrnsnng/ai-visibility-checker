import { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, Share2, RefreshCw, Globe } from 'lucide-react';
import type { ScanResult } from '../types';
import { averageScores } from '../data/demoResults';
import { hasFullAccess } from '../lib/paidState';
import { calculateAIModelScores } from '../lib/aiModelBreakdown';
import { getPriorityRecommendations } from '../lib/priorityRecommendations';
import { ScoreRing } from './ScoreRing';
import { CategoryCard } from './CategoryCard';
import { ScanningAnimation } from './ScanningAnimation';
import { UpgradeGate } from './UpgradeGate';
import { PriorityRecommendations } from './PriorityRecommendations';
import { AIModelBreakdown } from './AIModelBreakdown';
import { CompetitorComparison } from './CompetitorComparison';
import { PdfExport } from './PdfExport';
import styles from './Results.module.css';

interface ResultsProps {
  result: ScanResult | null;
  isScanning: boolean;
  url: string;
  onBack: () => void;
  onRescan: (url: string) => void;
  onScanUrl: (url: string) => Promise<ScanResult | null>;
}

export function Results({ result, isScanning, url, onBack, onRescan, onScanUrl }: ResultsProps) {
  const [unlocked, setUnlocked] = useState(hasFullAccess);

  useEffect(() => {
    const handler = () => {
      setUnlocked(hasFullAccess());
    };
    window.addEventListener('aiv-access-changed', handler);
    return () => window.removeEventListener('aiv-access-changed', handler);
  }, []);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}?url=${encodeURIComponent(url)}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // fallback
    }
  };

  const handleUnlocked = useCallback(() => {
    setUnlocked(true);
  }, []);

  if (isScanning) {
    return <ScanningAnimation url={url} />;
  }

  if (!result) return null;

  const scoreColor =
    result.overallScore >= 75 ? 'var(--color-pass)' :
    result.overallScore >= 50 ? 'var(--color-warning)' :
    'var(--color-fail)';

  const modelScores = unlocked ? calculateAIModelScores(result) : [];
  const recommendations = unlocked ? getPriorityRecommendations(result) : [];

  return (
    <div className={styles.results} id="report-content">
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
          {unlocked && <PdfExport url={url} />}
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
            {result.overallScore >= 90 && 'Excellent AI visibility'}
            {result.overallScore >= 75 && result.overallScore < 90 && 'Good AI visibility'}
            {result.overallScore >= 50 && result.overallScore < 75 && 'Needs improvement'}
            {result.overallScore < 50 && 'Poor AI visibility'}
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
        <h3 className={styles.sectionTitle}>Category breakdown</h3>
        {result.categories.map((cat, i) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            averageScore={averageScores[cat.id] ?? 50}
            index={i}
          />
        ))}
      </div>

      {/* Upgrade gate or paid features */}
      {!unlocked ? (
        <div className={styles.paidSection}>
          <UpgradeGate onUnlocked={handleUnlocked} />
        </div>
      ) : (
        <div className={styles.paidSection}>
          <PriorityRecommendations recommendations={recommendations} />
          <AIModelBreakdown scores={modelScores} />
          <CompetitorComparison primaryResult={result} onScanUrl={onScanUrl} />
        </div>
      )}
    </div>
  );
}
