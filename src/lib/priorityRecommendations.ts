import type { ScanResult, CheckResult } from '../types';

export interface PriorityRecommendation {
  check: CheckResult;
  impact: 'critical' | 'high' | 'medium' | 'low';
  impactScore: number;
  reason: string;
}

/**
 * Impact weights for each check: how much fixing it would improve overall AI visibility.
 * Higher = fix this first.
 */
const impactWeights: Record<string, { weight: number; reason: string }> = {
  'robots-txt': {
    weight: 100,
    reason: 'Blocking AI crawlers prevents all AI systems from indexing your site. This is the single most impactful fix.',
  },
  'json-ld': {
    weight: 85,
    reason: 'Structured data helps every AI model understand your content type, business details, and page context.',
  },
  'faq-schema': {
    weight: 80,
    reason: 'FAQ schema directly feeds AI answers. Sites with FAQ schema are cited 3x more often in AI responses.',
  },
  'llms-txt': {
    weight: 75,
    reason: 'llms.txt gives AI models a structured summary of your site. Early adopters get better representation in AI outputs.',
  },
  'meta-description': {
    weight: 70,
    reason: 'Meta descriptions are the primary text AI uses to summarize your site. A weak one means weak AI references.',
  },
  'sitemap': {
    weight: 65,
    reason: 'Without a sitemap, AI crawlers may miss important pages entirely. Easy to add, broad impact.',
  },
  'headings': {
    weight: 55,
    reason: 'Heading structure helps AI parse your content hierarchy. Important for accurate summarization.',
  },
  'readability': {
    weight: 50,
    reason: 'Clear, well-structured writing is easier for AI to parse, quote, and recommend accurately.',
  },
  'og-tags': {
    weight: 40,
    reason: 'OpenGraph tags improve how AI systems display your site in previews and citations.',
  },
  'page-speed': {
    weight: 35,
    reason: 'Slow pages may time out during AI crawling. Improving speed ensures reliable indexing.',
  },
};

function getImpactLevel(weight: number): 'critical' | 'high' | 'medium' | 'low' {
  if (weight >= 85) return 'critical';
  if (weight >= 65) return 'high';
  if (weight >= 45) return 'medium';
  return 'low';
}

export function getPriorityRecommendations(result: ScanResult): PriorityRecommendation[] {
  const recommendations: PriorityRecommendation[] = [];

  for (const cat of result.categories) {
    for (const check of cat.checks) {
      // Only include checks that need fixing
      if (check.status === 'pass') continue;

      const impact = impactWeights[check.id];
      if (!impact) continue;

      // Scale impact by how badly the check is failing
      const failureSeverity = (100 - check.score) / 100;
      const adjustedWeight = Math.round(impact.weight * failureSeverity);

      recommendations.push({
        check,
        impact: getImpactLevel(impact.weight),
        impactScore: adjustedWeight,
        reason: impact.reason,
      });
    }
  }

  // Sort by adjusted impact score (highest first)
  recommendations.sort((a, b) => b.impactScore - a.impactScore);

  return recommendations;
}
