import { useEffect, useState } from 'react';
import { getLetterGrade } from '../types';
import styles from './ScoreRing.module.css';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  animated?: boolean;
}

export function ScoreRing({ score, size = 180, strokeWidth = 10, animated = true }: ScoreRingProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  const [progress, setProgress] = useState(animated ? 0 : score);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const grade = getLetterGrade(score);
  const gradeColor =
    score >= 75 ? 'var(--color-pass)' :
    score >= 50 ? 'var(--color-warning)' :
    'var(--color-fail)';

  useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      setProgress(score);
      return;
    }

    let frame: number;
    const duration = 1200;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(eased * score);
      setDisplayScore(current);
      setProgress(eased * score);
      if (t < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    // Small delay for dramatic effect
    const timeout = setTimeout(() => {
      frame = requestAnimationFrame(animate);
    }, 300);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [score, animated]);

  return (
    <div className={styles.wrapper} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={styles.svg}
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-primary)"
          strokeWidth={strokeWidth}
        />
        {/* Score arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={gradeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={styles.progress}
          style={{
            filter: `drop-shadow(0 0 8px ${gradeColor})`,
          }}
        />
      </svg>
      <div className={styles.content}>
        <div className={styles.score} style={{ color: gradeColor }}>
          {displayScore}
        </div>
        <div className={styles.grade} style={{ color: gradeColor }}>
          {grade}
        </div>
        <div className={styles.label}>out of 100</div>
      </div>
    </div>
  );
}
