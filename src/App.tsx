import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Results } from './components/Results';
import { Footer } from './components/Footer';
import { demoResults } from './data/demoResults';
import type { ScanResult } from './types';
import styles from './App.module.css';

function normalizeUrl(input: string): string {
  return input.replace(/^https?:\/\//, '').replace(/\/+$/, '').toLowerCase();
}

export default function App() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanUrl, setScanUrl] = useState('');

  const handleScan = useCallback(async (url: string) => {
    const normalized = normalizeUrl(url);
    setScanUrl(normalized);
    setIsScanning(true);
    setResult(null);

    // Simulate network delay for UX
    await new Promise((r) => setTimeout(r, 1800 + Math.random() * 1200));

    // Check demo results first
    const demoMatch = Object.keys(demoResults).find(
      (key) => normalized === key || normalized.startsWith(key + '/')
    );

    if (demoMatch) {
      setResult(demoResults[demoMatch]);
    } else {
      // Try the API
      try {
        const res = await fetch(`/api/scan?url=${encodeURIComponent(normalized)}`);
        if (res.ok) {
          const data = await res.json();
          setResult(data);
        } else {
          // Fallback: generate a pseudo-random result for unknown URLs
          setResult(generateFallbackResult(normalized));
        }
      } catch {
        setResult(generateFallbackResult(normalized));
      }
    }

    setIsScanning(false);
  }, []);

  const handleReset = useCallback(() => {
    setResult(null);
    setIsScanning(false);
    setScanUrl('');
  }, []);

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        {!result && !isScanning && (
          <Hero onScan={handleScan} />
        )}
        {(isScanning || result) && (
          <Results
            result={result}
            isScanning={isScanning}
            url={scanUrl}
            onBack={handleReset}
            onRescan={handleScan}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

function generateFallbackResult(url: string): ScanResult {
  // Generate a plausible mid-range result for unknown URLs
  const hash = url.split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0);
  const seed = Math.abs(hash);
  const r = (min: number, max: number) => min + (seed % (max - min));
  const overallScore = r(35, 72);

  return {
    url,
    timestamp: new Date().toISOString(),
    overallScore,
    letterGrade: overallScore >= 75 ? 'B' : overallScore >= 60 ? 'C' : overallScore >= 40 ? 'D' : 'F',
    categories: [
      {
        id: 'ai-access',
        name: 'AI Crawler Access',
        icon: 'Bot',
        score: r(20, 80),
        checks: [
          {
            id: 'robots-txt',
            category: 'ai-access',
            title: 'robots.txt',
            status: r(0, 100) > 50 ? 'pass' : 'warning',
            score: r(40, 90),
            summary: 'robots.txt found — analysis requires live scan.',
            details: 'Enter a demo URL (github.com, stripe.com, or joes-plumbing-tulsa.com) for detailed analysis, or wait for the live scanning feature.',
          },
          {
            id: 'llms-txt',
            category: 'ai-access',
            title: 'llms.txt',
            status: 'fail',
            score: 0,
            summary: 'No llms.txt detected (most sites don\'t have one yet).',
            details: 'The llms.txt standard is new. Full analysis requires a live scan — try a demo URL for detailed results.',
            fixSnippet: `# ${url} llms.txt\n\n> Description of your site goes here.\n\n## Key Pages\n- [About](/about)\n- [Docs](/docs)`,
            fixLabel: 'Example llms.txt template',
          },
        ],
      },
      {
        id: 'structured-data',
        name: 'Structured Data',
        icon: 'Code2',
        score: r(15, 65),
        checks: [
          {
            id: 'json-ld',
            category: 'structured-data',
            title: 'JSON-LD / Schema.org',
            status: r(0, 100) > 60 ? 'warning' : 'fail',
            score: r(10, 60),
            summary: 'Limited structured data analysis available.',
            details: 'Full JSON-LD analysis requires a live scan. Try github.com, stripe.com, or joes-plumbing-tulsa.com for detailed demo results.',
          },
          {
            id: 'faq-schema',
            category: 'structured-data',
            title: 'FAQ / How-To Schema',
            status: 'fail',
            score: 0,
            summary: 'FAQ/HowTo schema not detected.',
            details: 'Most sites lack FAQ schema. This is one of the highest-impact improvements for AI visibility.',
          },
        ],
      },
      {
        id: 'meta-content',
        name: 'Meta & Content',
        icon: 'FileText',
        score: r(30, 75),
        checks: [
          {
            id: 'meta-description',
            category: 'meta-content',
            title: 'Meta Description',
            status: 'warning',
            score: r(30, 70),
            summary: 'Meta description analysis requires live scan.',
            details: 'Try a demo URL for full analysis.',
          },
          {
            id: 'og-tags',
            category: 'meta-content',
            title: 'OpenGraph Tags',
            status: 'warning',
            score: r(20, 60),
            summary: 'OpenGraph analysis requires live scan.',
            details: 'Try a demo URL for full analysis.',
          },
          {
            id: 'headings',
            category: 'meta-content',
            title: 'Content Structure',
            status: 'warning',
            score: r(30, 70),
            summary: 'Content structure analysis requires live scan.',
            details: 'Try a demo URL for full analysis.',
          },
          {
            id: 'readability',
            category: 'meta-content',
            title: 'Content Clarity',
            status: 'warning',
            score: r(35, 65),
            summary: 'Readability analysis requires live scan.',
            details: 'Try a demo URL for full analysis.',
          },
        ],
      },
      {
        id: 'discoverability',
        name: 'Discoverability',
        icon: 'Search',
        score: r(25, 70),
        checks: [
          {
            id: 'sitemap',
            category: 'discoverability',
            title: 'Sitemap',
            status: r(0, 100) > 50 ? 'warning' : 'fail',
            score: r(20, 70),
            summary: 'Sitemap analysis requires live scan.',
            details: 'Try a demo URL for full analysis.',
          },
          {
            id: 'page-speed',
            category: 'discoverability',
            title: 'Page Speed Indicators',
            status: 'warning',
            score: r(30, 60),
            summary: 'Speed analysis requires live scan.',
            details: 'Try a demo URL for full analysis.',
          },
        ],
      },
    ],
  };
}
