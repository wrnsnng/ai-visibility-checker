export type CheckStatus = 'pass' | 'warning' | 'fail';
export type LetterGrade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface CheckResult {
  id: string;
  category: string;
  title: string;
  status: CheckStatus;
  score: number; // 0-100
  summary: string;
  details: string;
  fixSnippet?: string;
  fixLabel?: string;
}

export interface CategoryResult {
  id: string;
  name: string;
  icon: string;
  score: number;
  checks: CheckResult[];
}

export interface ScanResult {
  url: string;
  timestamp: string;
  overallScore: number;
  letterGrade: LetterGrade;
  categories: CategoryResult[];
}

export function getLetterGrade(score: number): LetterGrade {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 60) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

export function getStatusColor(status: CheckStatus): string {
  switch (status) {
    case 'pass': return 'var(--color-pass)';
    case 'warning': return 'var(--color-warning)';
    case 'fail': return 'var(--color-fail)';
  }
}

export function getGradeColor(grade: LetterGrade): string {
  switch (grade) {
    case 'A': return 'var(--color-pass)';
    case 'B': return 'var(--color-pass)';
    case 'C': return 'var(--color-warning)';
    case 'D': return 'var(--color-fail)';
    case 'F': return 'var(--color-fail)';
  }
}
