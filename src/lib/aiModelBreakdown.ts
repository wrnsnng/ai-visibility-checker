import type { ScanResult } from '../types';

export interface AIModelScore {
  model: string;
  icon: string;
  score: number;
  label: string;
  emphasis: string;
}

/**
 * Each AI model weighs different signals differently.
 * This estimates per-model visibility based on which checks each model prioritizes.
 */
const modelWeights: Record<string, Record<string, number>> = {
  chatgpt: {
    'robots-txt': 0.20,      // GPTBot access is critical
    'llms-txt': 0.05,
    'json-ld': 0.15,
    'faq-schema': 0.15,
    'meta-description': 0.10,
    'og-tags': 0.05,
    'headings': 0.10,
    'readability': 0.10,
    'sitemap': 0.05,
    'page-speed': 0.05,
  },
  claude: {
    'robots-txt': 0.18,      // ClaudeBot access
    'llms-txt': 0.12,        // Claude values llms.txt more
    'json-ld': 0.10,
    'faq-schema': 0.10,
    'meta-description': 0.12,
    'og-tags': 0.05,
    'headings': 0.12,
    'readability': 0.13,     // Claude values clear writing
    'sitemap': 0.04,
    'page-speed': 0.04,
  },
  perplexity: {
    'robots-txt': 0.15,
    'llms-txt': 0.08,
    'json-ld': 0.12,
    'faq-schema': 0.18,      // Perplexity loves FAQ data
    'meta-description': 0.10,
    'og-tags': 0.05,
    'headings': 0.08,
    'readability': 0.08,
    'sitemap': 0.10,         // Perplexity indexes heavily
    'page-speed': 0.06,
  },
  gemini: {
    'robots-txt': 0.15,
    'llms-txt': 0.05,
    'json-ld': 0.18,         // Google/Gemini values structured data
    'faq-schema': 0.15,
    'meta-description': 0.10,
    'og-tags': 0.07,
    'headings': 0.08,
    'readability': 0.07,
    'sitemap': 0.10,         // Google indexes heavily
    'page-speed': 0.05,
  },
};

const modelMeta: Record<string, { name: string; icon: string; emphasis: string }> = {
  chatgpt: { name: 'ChatGPT', icon: '🤖', emphasis: 'Crawler access and FAQ schema' },
  claude: { name: 'Claude', icon: '🟠', emphasis: 'Content clarity and llms.txt' },
  perplexity: { name: 'Perplexity', icon: '🔍', emphasis: 'FAQ schema and sitemap coverage' },
  gemini: { name: 'Gemini', icon: '✦', emphasis: 'Structured data and sitemap' },
};

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 40) return 'Needs work';
  return 'Poor';
}

export function calculateAIModelScores(result: ScanResult): AIModelScore[] {
  // Build a map of check scores
  const checkScores: Record<string, number> = {};
  for (const cat of result.categories) {
    for (const check of cat.checks) {
      checkScores[check.id] = check.score;
    }
  }

  return Object.entries(modelWeights).map(([key, weights]) => {
    let weightedScore = 0;
    let totalWeight = 0;

    for (const [checkId, weight] of Object.entries(weights)) {
      const score = checkScores[checkId];
      if (score !== undefined) {
        weightedScore += score * weight;
        totalWeight += weight;
      }
    }

    const finalScore = totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
    const meta = modelMeta[key];

    return {
      model: meta.name,
      icon: meta.icon,
      score: finalScore,
      label: getScoreLabel(finalScore),
      emphasis: meta.emphasis,
    };
  });
}
