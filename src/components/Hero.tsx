import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import { demoSuggestions } from '../data/demoResults';
import styles from './Hero.module.css';

interface HeroProps {
  onScan: (url: string) => void;
}

export function Hero({ onScan }: HeroProps) {
  const [url, setUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onScan(url.trim());
    }
  };

  return (
    <div className={styles.hero}>
      <div className={styles.badge}>
        <Sparkles size={14} />
        <span>Free AI visibility analysis</span>
      </div>

      <h1 className={styles.title}>
        Is your website visible
        <br />
        <span className={styles.titleAccent}>to AI?</span>
      </h1>

      <p className={styles.subtitle}>
        ChatGPT, Claude, Perplexity, and Gemini are how people find information now.
        <br className={styles.brDesktop} />
        Find out if AI can see, understand, and recommend your site.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputWrapper}>
          <Search size={20} className={styles.inputIcon} />
          <input
            ref={inputRef}
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter any URL — e.g. stripe.com"
            className={styles.input}
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
          />
          <button type="submit" className={styles.submitBtn} disabled={!url.trim()}>
            <span className={styles.submitText}>Check visibility</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </form>

      <div className={styles.suggestions}>
        <span className={styles.suggestionsLabel}>Try:</span>
        {demoSuggestions.map((s) => (
          <button
            key={s.url}
            onClick={() => onScan(s.url)}
            className={styles.suggestion}
          >
            <span className={styles.suggestionUrl}>{s.label}</span>
            <span
              className={styles.suggestionGrade}
              data-grade={s.grade}
            >
              {s.grade}
            </span>
          </button>
        ))}
      </div>

      <div className={styles.features}>
        {[
          { label: 'robots.txt & llms.txt', desc: 'AI crawler access' },
          { label: 'Structured Data', desc: 'Schema.org & JSON-LD' },
          { label: 'Content Quality', desc: 'Meta, headings, readability' },
          { label: 'Discoverability', desc: 'Sitemap & page speed' },
        ].map((f) => (
          <div key={f.label} className={styles.feature}>
            <div className={styles.featureLabel}>{f.label}</div>
            <div className={styles.featureDesc}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
