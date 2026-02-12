import { useState, useCallback } from 'react';
import { Users, Plus, X, Search, Loader2 } from 'lucide-react';
import type { ScanResult } from '../types';
import { getLetterGrade } from '../types';
import styles from './CompetitorComparison.module.css';

interface CompetitorComparisonProps {
  primaryResult: ScanResult;
  onScanUrl: (url: string) => Promise<ScanResult | null>;
}

interface CompetitorEntry {
  url: string;
  result: ScanResult | null;
  scanning: boolean;
}

export function CompetitorComparison({ primaryResult, onScanUrl }: CompetitorComparisonProps) {
  const [competitors, setCompetitors] = useState<CompetitorEntry[]>([]);
  const [inputUrl, setInputUrl] = useState('');
  const [inputVisible, setInputVisible] = useState(false);

  const addCompetitor = useCallback(async () => {
    const url = inputUrl.trim().replace(/^https?:\/\//, '').replace(/\/+$/, '').toLowerCase();
    if (!url) return;
    if (competitors.length >= 3) return;
    if (competitors.some((c) => c.url === url)) return;
    if (url === primaryResult.url) return;

    setInputUrl('');
    setInputVisible(false);

    const entry: CompetitorEntry = { url, result: null, scanning: true };
    setCompetitors((prev) => [...prev, entry]);

    const result = await onScanUrl(url);
    setCompetitors((prev) =>
      prev.map((c) => (c.url === url ? { ...c, result, scanning: false } : c))
    );
  }, [inputUrl, competitors, primaryResult.url, onScanUrl]);

  const removeCompetitor = (url: string) => {
    setCompetitors((prev) => prev.filter((c) => c.url !== url));
  };

  const allResults = [
    { url: primaryResult.url, result: primaryResult, isYou: true },
    ...competitors.map((c) => ({ url: c.url, result: c.result, isYou: false })),
  ];

  const categories = primaryResult.categories;

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <Users size={20} className={styles.headerIcon} />
        <div>
          <h3 className={styles.title}>Competitor comparison</h3>
          <p className={styles.subtitle}>Compare your AI visibility against up to 3 competitors</p>
        </div>
      </div>

      {/* Add competitor input */}
      {competitors.length < 3 && (
        <div className={styles.addArea}>
          {inputVisible ? (
            <form
              className={styles.addForm}
              onSubmit={(e) => {
                e.preventDefault();
                addCompetitor();
              }}
            >
              <Search size={16} className={styles.addIcon} />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter competitor URL"
                className={styles.addInput}
                autoFocus
                spellCheck={false}
                autoCapitalize="none"
              />
              <button type="submit" className={styles.addSubmit} disabled={!inputUrl.trim()}>
                Add
              </button>
              <button
                type="button"
                className={styles.addCancel}
                onClick={() => {
                  setInputVisible(false);
                  setInputUrl('');
                }}
              >
                <X size={16} />
              </button>
            </form>
          ) : (
            <button className={styles.addBtn} onClick={() => setInputVisible(true)}>
              <Plus size={16} />
              <span>Add competitor ({3 - competitors.length} remaining)</span>
            </button>
          )}
        </div>
      )}

      {/* Comparison table */}
      {allResults.length > 0 && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thCategory}>Category</th>
                {allResults.map((r) => (
                  <th key={r.url} className={styles.thSite}>
                    <div className={styles.siteHeader}>
                      <span className={styles.siteUrl}>{r.url}</span>
                      {r.isYou && <span className={styles.youBadge}>You</span>}
                      {!r.isYou && (
                        <button
                          className={styles.removeBtn}
                          onClick={() => removeCompetitor(r.url)}
                          aria-label="Remove"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Overall row */}
              <tr className={styles.overallRow}>
                <td className={styles.tdCategory}>Overall score</td>
                {allResults.map((r) => (
                  <td key={r.url} className={styles.tdScore}>
                    {r.result ? (
                      <ScoreCell score={r.result.overallScore} />
                    ) : (
                      <Loader2 size={16} className={styles.spinner} />
                    )}
                  </td>
                ))}
              </tr>

              {/* Category rows */}
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td className={styles.tdCategory}>{cat.name}</td>
                  {allResults.map((r) => {
                    const catResult = r.result?.categories.find((c) => c.id === cat.id);
                    return (
                      <td key={r.url} className={styles.tdScore}>
                        {catResult ? (
                          <ScoreCell score={catResult.score} />
                        ) : r.result ? (
                          <span className={styles.na}>n/a</span>
                        ) : (
                          <Loader2 size={16} className={styles.spinner} />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Grade row */}
              <tr className={styles.gradeRow}>
                <td className={styles.tdCategory}>Letter grade</td>
                {allResults.map((r) => (
                  <td key={r.url} className={styles.tdScore}>
                    {r.result ? (
                      <GradeCell score={r.result.overallScore} />
                    ) : (
                      <Loader2 size={16} className={styles.spinner} />
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ScoreCell({ score }: { score: number }) {
  const color =
    score >= 75 ? 'var(--color-pass)' :
    score >= 50 ? 'var(--color-warning)' :
    'var(--color-fail)';

  return (
    <div className={styles.scoreCell}>
      <span className={styles.scoreNum} style={{ color }}>{score}</span>
      <div className={styles.miniBar}>
        <div className={styles.miniBarFill} style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  );
}

function GradeCell({ score }: { score: number }) {
  const grade = getLetterGrade(score);
  const color =
    score >= 75 ? 'var(--color-pass)' :
    score >= 50 ? 'var(--color-warning)' :
    'var(--color-fail)';

  return (
    <span className={styles.grade} style={{ color }}>{grade}</span>
  );
}
