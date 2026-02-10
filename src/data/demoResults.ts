import type { ScanResult } from '../types';

export const demoResults: Record<string, ScanResult> = {
  'github.com': {
    url: 'github.com',
    timestamp: new Date().toISOString(),
    overallScore: 88,
    letterGrade: 'B',
    categories: [
      {
        id: 'ai-access',
        name: 'AI Crawler Access',
        icon: 'Bot',
        score: 95,
        checks: [
          {
            id: 'robots-txt',
            category: 'ai-access',
            title: 'robots.txt',
            status: 'pass',
            score: 100,
            summary: 'robots.txt exists and allows most AI crawlers.',
            details: 'Found robots.txt with 221 lines. GPTBot: allowed. ClaudeBot: allowed. Google-Extended: allowed. PerplexityBot: allowed. GitHub maintains a well-structured robots.txt that permits AI indexing of public content.',
            fixSnippet: undefined,
          },
          {
            id: 'llms-txt',
            category: 'ai-access',
            title: 'llms.txt',
            status: 'warning',
            score: 50,
            summary: 'No llms.txt file found.',
            details: 'The llms.txt standard provides a structured summary of your site for AI models. GitHub doesn\'t have one yet, but adding one could improve how AI systems understand and reference the platform.',
            fixSnippet: `# github.com llms.txt

> GitHub is the world's largest platform for software development and version control using Git.

## Core Features
- Git repository hosting
- Pull requests & code review
- Issues & project management
- GitHub Actions (CI/CD)
- GitHub Copilot (AI coding assistant)
- GitHub Pages (static site hosting)

## Documentation
- [GitHub Docs](https://docs.github.com)
- [GitHub API](https://docs.github.com/en/rest)
- [GitHub CLI](https://cli.github.com)`,
            fixLabel: 'Example llms.txt for GitHub',
          },
        ],
      },
      {
        id: 'structured-data',
        name: 'Structured Data',
        icon: 'Code2',
        score: 85,
        checks: [
          {
            id: 'json-ld',
            category: 'structured-data',
            title: 'JSON-LD / Schema.org',
            status: 'pass',
            score: 85,
            summary: 'SoftwareApplication schema detected on repository pages.',
            details: 'GitHub includes Schema.org markup on repository pages including SoftwareSourceCode type. The homepage uses Organization schema. This helps AI understand page context.',
          },
          {
            id: 'faq-schema',
            category: 'structured-data',
            title: 'FAQ / How-To Schema',
            status: 'warning',
            score: 40,
            summary: 'No FAQ or HowTo schema detected on the homepage.',
            details: 'FAQ and HowTo schemas help AI models extract structured answers. GitHub\'s docs use these but the main site doesn\'t.',
            fixSnippet: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What is GitHub?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "GitHub is a platform for version control and collaboration using Git."
    }
  }]
}
</script>`,
            fixLabel: 'Add FAQ schema',
          },
        ],
      },
      {
        id: 'meta-content',
        name: 'Meta & Content',
        icon: 'FileText',
        score: 92,
        checks: [
          {
            id: 'meta-description',
            category: 'meta-content',
            title: 'Meta Description',
            status: 'pass',
            score: 95,
            summary: 'Clear, descriptive meta description found (155 chars).',
            details: '"GitHub is where over 100 million developers shape the future of software, together." — Good length, clear value proposition, AI-friendly.',
          },
          {
            id: 'og-tags',
            category: 'meta-content',
            title: 'OpenGraph Tags',
            status: 'pass',
            score: 100,
            summary: 'Complete OpenGraph tags: og:title, og:description, og:image all present.',
            details: 'All core OG tags present including og:site_name, og:type, og:url. Image is properly sized (1200x630). Twitter card tags also present.',
          },
          {
            id: 'headings',
            category: 'meta-content',
            title: 'Content Structure',
            status: 'pass',
            score: 90,
            summary: 'Good heading hierarchy with single H1 and logical structure.',
            details: 'Found 1 H1, 4 H2s, 8 H3s. Semantic HTML used throughout. No heading level skips detected.',
          },
          {
            id: 'readability',
            category: 'meta-content',
            title: 'Content Clarity',
            status: 'pass',
            score: 85,
            summary: 'Flesch reading ease: 62 (Standard). Average paragraph length: 2.3 sentences.',
            details: 'Content is accessible to a broad audience. Short paragraphs and clear language make it easy for AI to parse and reference. Consider adding more descriptive alt text to images.',
          },
        ],
      },
      {
        id: 'discoverability',
        name: 'Discoverability',
        icon: 'Search',
        score: 90,
        checks: [
          {
            id: 'sitemap',
            category: 'discoverability',
            title: 'Sitemap',
            status: 'pass',
            score: 100,
            summary: 'sitemap.xml found and valid with 15,000+ URLs.',
            details: 'XML sitemap is properly formatted, includes lastmod dates, and is referenced in robots.txt. Multiple sitemap index files found for comprehensive coverage.',
          },
          {
            id: 'page-speed',
            category: 'discoverability',
            title: 'Page Speed Indicators',
            status: 'pass',
            score: 80,
            summary: 'Fast load time. Minimal render-blocking resources.',
            details: 'Total page weight: ~1.2MB. 3 render-blocking scripts detected but deferred. Images are optimized. Good use of CDN. AI crawlers benefit from fast-loading pages.',
          },
        ],
      },
    ],
  },

  'stripe.com': {
    url: 'stripe.com',
    timestamp: new Date().toISOString(),
    overallScore: 91,
    letterGrade: 'A',
    categories: [
      {
        id: 'ai-access',
        name: 'AI Crawler Access',
        icon: 'Bot',
        score: 90,
        checks: [
          {
            id: 'robots-txt',
            category: 'ai-access',
            title: 'robots.txt',
            status: 'pass',
            score: 100,
            summary: 'robots.txt exists and allows AI crawlers.',
            details: 'Well-structured robots.txt. GPTBot: allowed. ClaudeBot: allowed. PerplexityBot: allowed. Google-Extended: allowed. Stripe explicitly permits AI indexing of documentation and marketing pages.',
          },
          {
            id: 'llms-txt',
            category: 'ai-access',
            title: 'llms.txt',
            status: 'warning',
            score: 50,
            summary: 'No llms.txt file found.',
            details: 'Stripe\'s extensive docs would benefit enormously from an llms.txt file. Given that developers frequently ask AI about Stripe integration, this is a missed opportunity.',
            fixSnippet: `# stripe.com llms.txt

> Stripe is a technology company that builds economic infrastructure for the internet.

## Products
- Stripe Payments — Accept payments globally
- Stripe Billing — Subscription management
- Stripe Connect — Multi-party payments
- Stripe Terminal — In-person payments

## Documentation
- [API Reference](https://stripe.com/docs/api)
- [Getting Started](https://stripe.com/docs/development)
- [Libraries & SDKs](https://stripe.com/docs/libraries)`,
            fixLabel: 'Example llms.txt for Stripe',
          },
        ],
      },
      {
        id: 'structured-data',
        name: 'Structured Data',
        icon: 'Code2',
        score: 95,
        checks: [
          {
            id: 'json-ld',
            category: 'structured-data',
            title: 'JSON-LD / Schema.org',
            status: 'pass',
            score: 100,
            summary: 'Rich JSON-LD with Organization, Product, and WebPage schemas.',
            details: 'Stripe uses comprehensive Schema.org markup including Organization (with logo, founding date, social profiles), Product schemas for each offering, and BreadcrumbList for navigation. Excellent for AI comprehension.',
          },
          {
            id: 'faq-schema',
            category: 'structured-data',
            title: 'FAQ / How-To Schema',
            status: 'pass',
            score: 90,
            summary: 'FAQ schema found on documentation and pricing pages.',
            details: 'Stripe\'s pricing page includes FAQPage schema with 12 common questions. Documentation pages use HowTo schema for integration guides. These are highly cited by AI assistants.',
          },
        ],
      },
      {
        id: 'meta-content',
        name: 'Meta & Content',
        icon: 'FileText',
        score: 95,
        checks: [
          {
            id: 'meta-description',
            category: 'meta-content',
            title: 'Meta Description',
            status: 'pass',
            score: 100,
            summary: 'Excellent meta description (143 chars): clear, action-oriented.',
            details: '"Stripe powers online and in-person payment processing and financial solutions for businesses of all sizes." — Concise, keyword-rich, AI-friendly.',
          },
          {
            id: 'og-tags',
            category: 'meta-content',
            title: 'OpenGraph Tags',
            status: 'pass',
            score: 100,
            summary: 'Complete OpenGraph and Twitter Card tags.',
            details: 'All OG tags present with properly sized images. Twitter card type: summary_large_image. Dynamic OG images for documentation pages.',
          },
          {
            id: 'headings',
            category: 'meta-content',
            title: 'Content Structure',
            status: 'pass',
            score: 90,
            summary: 'Excellent semantic structure with logical heading hierarchy.',
            details: 'Single H1, well-organized H2/H3 sections. Semantic HTML5 elements (nav, main, article, section) used throughout. ARIA labels present.',
          },
          {
            id: 'readability',
            category: 'meta-content',
            title: 'Content Clarity',
            status: 'pass',
            score: 88,
            summary: 'Flesch reading ease: 58 (Moderate). Clear technical writing.',
            details: 'Content balances technical accuracy with accessibility. Short paragraphs, active voice, and clear terminology. Documentation is especially well-structured for AI parsing.',
          },
        ],
      },
      {
        id: 'discoverability',
        name: 'Discoverability',
        icon: 'Search',
        score: 88,
        checks: [
          {
            id: 'sitemap',
            category: 'discoverability',
            title: 'Sitemap',
            status: 'pass',
            score: 95,
            summary: 'Comprehensive sitemap with 5,000+ URLs and proper structure.',
            details: 'Multiple sitemap index files covering docs, blog, and marketing pages. Includes lastmod, changefreq, and priority attributes. Referenced in robots.txt.',
          },
          {
            id: 'page-speed',
            category: 'discoverability',
            title: 'Page Speed Indicators',
            status: 'pass',
            score: 82,
            summary: 'Good performance. Optimized assets with minor improvements possible.',
            details: 'Total page weight: ~1.8MB (animations contribute to size). Images use WebP format. Scripts are properly deferred. Consider reducing custom font weight.',
          },
        ],
      },
    ],
  },

  'joes-plumbing-tulsa.com': {
    url: 'joes-plumbing-tulsa.com',
    timestamp: new Date().toISOString(),
    overallScore: 28,
    letterGrade: 'F',
    categories: [
      {
        id: 'ai-access',
        name: 'AI Crawler Access',
        icon: 'Bot',
        score: 15,
        checks: [
          {
            id: 'robots-txt',
            category: 'ai-access',
            title: 'robots.txt',
            status: 'fail',
            score: 30,
            summary: 'robots.txt blocks all AI crawlers.',
            details: 'The robots.txt file uses "Disallow: /" for GPTBot, ClaudeBot, PerplexityBot, and Google-Extended. This means no AI system can crawl or reference this site. This is likely a default WordPress setting that was never updated.',
            fixSnippet: `# Allow AI crawlers to index your site
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /`,
            fixLabel: 'Updated robots.txt to allow AI crawlers',
          },
          {
            id: 'llms-txt',
            category: 'ai-access',
            title: 'llms.txt',
            status: 'fail',
            score: 0,
            summary: 'No llms.txt file found.',
            details: 'An llms.txt file would help AI assistants understand your plumbing services, service area, and contact information. This is especially important for local businesses that people ask AI about.',
            fixSnippet: `# Joe's Plumbing — Tulsa, OK

> Full-service plumbing company serving Tulsa, Oklahoma and surrounding areas since 1998.

## Services
- Emergency plumbing repair (24/7)
- Water heater installation & repair
- Drain cleaning & sewer line repair
- Bathroom & kitchen remodeling
- Commercial plumbing

## Service Area
Tulsa, Broken Arrow, Owasso, Jenks, Bixby, Sand Springs, OK

## Contact
- Phone: (918) 555-0123
- Address: 4521 S Peoria Ave, Tulsa, OK 74105
- Hours: Mon-Fri 7AM-6PM, Emergency 24/7`,
            fixLabel: 'Example llms.txt for a local business',
          },
        ],
      },
      {
        id: 'structured-data',
        name: 'Structured Data',
        icon: 'Code2',
        score: 10,
        checks: [
          {
            id: 'json-ld',
            category: 'structured-data',
            title: 'JSON-LD / Schema.org',
            status: 'fail',
            score: 10,
            summary: 'No structured data found on any page.',
            details: 'Zero JSON-LD or Microdata markup detected. Without structured data, AI systems can\'t reliably extract your business type, location, services, or hours. This is critical for local businesses.',
            fixSnippet: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Plumber",
  "name": "Joe's Plumbing",
  "url": "https://joes-plumbing-tulsa.com",
  "telephone": "(918) 555-0123",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "4521 S Peoria Ave",
    "addressLocality": "Tulsa",
    "addressRegion": "OK",
    "postalCode": "74105"
  },
  "areaServed": ["Tulsa", "Broken Arrow", "Owasso"],
  "openingHours": "Mo-Fr 07:00-18:00",
  "priceRange": "$$"
}
</script>`,
            fixLabel: 'Add LocalBusiness schema',
          },
          {
            id: 'faq-schema',
            category: 'structured-data',
            title: 'FAQ / How-To Schema',
            status: 'fail',
            score: 0,
            summary: 'No FAQ or How-To schema found.',
            details: 'Local service businesses benefit enormously from FAQ schema. When someone asks AI "how much does a plumber cost in Tulsa?", FAQ schema helps your content get cited.',
            fixSnippet: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does a plumber cost in Tulsa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Standard plumbing service calls in Tulsa start at $89. Emergency calls are $149. We provide free estimates for larger projects."
      }
    },
    {
      "@type": "Question",
      "name": "Do you offer 24/7 emergency plumbing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Joe's Plumbing offers 24/7 emergency plumbing service across Tulsa and surrounding areas."
      }
    }
  ]
}
</script>`,
            fixLabel: 'Add FAQ schema for common questions',
          },
        ],
      },
      {
        id: 'meta-content',
        name: 'Meta & Content',
        icon: 'FileText',
        score: 25,
        checks: [
          {
            id: 'meta-description',
            category: 'meta-content',
            title: 'Meta Description',
            status: 'fail',
            score: 20,
            summary: 'Meta description is generic and too short (47 chars).',
            details: '"Joe\'s Plumbing — Tulsa\'s #1 plumber. Call now!" — Too short, no services listed, no service area detail. AI models need more context to reference your business accurately.',
            fixSnippet: `<meta name="description" content="Joe's Plumbing provides 24/7 emergency plumbing, water heater repair, and drain cleaning in Tulsa, Broken Arrow, and Owasso, OK. Licensed & insured since 1998. Free estimates — call (918) 555-0123." />`,
            fixLabel: 'Improved meta description',
          },
          {
            id: 'og-tags',
            category: 'meta-content',
            title: 'OpenGraph Tags',
            status: 'fail',
            score: 0,
            summary: 'No OpenGraph tags found.',
            details: 'Missing og:title, og:description, og:image, and og:url. When your site is shared or referenced, there\'s no rich preview available.',
            fixSnippet: `<meta property="og:title" content="Joe's Plumbing — 24/7 Plumber in Tulsa, OK" />
<meta property="og:description" content="Licensed plumbing services in Tulsa since 1998. Emergency repair, water heaters, drain cleaning. Free estimates." />
<meta property="og:image" content="https://joes-plumbing-tulsa.com/images/og-image.jpg" />
<meta property="og:url" content="https://joes-plumbing-tulsa.com" />
<meta property="og:type" content="website" />`,
            fixLabel: 'Add OpenGraph tags',
          },
          {
            id: 'headings',
            category: 'meta-content',
            title: 'Content Structure',
            status: 'warning',
            score: 35,
            summary: 'Multiple H1 tags and heading hierarchy issues.',
            details: 'Found 3 H1 tags (should be 1). Headings skip from H1 to H4 in places. Limited use of semantic HTML — mostly divs with classes. This makes it harder for AI to parse page structure.',
            fixSnippet: `<!-- Use ONE H1 per page, then logical H2/H3 hierarchy -->
<h1>Joe's Plumbing — Tulsa, OK</h1>
<h2>Our Services</h2>
  <h3>Emergency Plumbing</h3>
  <h3>Water Heater Repair</h3>
  <h3>Drain Cleaning</h3>
<h2>Service Area</h2>
<h2>About Us</h2>
<h2>Contact</h2>`,
            fixLabel: 'Fix heading hierarchy',
          },
          {
            id: 'readability',
            category: 'meta-content',
            title: 'Content Clarity',
            status: 'warning',
            score: 45,
            summary: 'Flesch reading ease: 72 (Fairly Easy), but very thin content.',
            details: 'Only 180 words of body content across the entire homepage. While the language is accessible, there\'s not enough content for AI to work with. Add service descriptions, FAQs, and area information.',
          },
        ],
      },
      {
        id: 'discoverability',
        name: 'Discoverability',
        icon: 'Search',
        score: 30,
        checks: [
          {
            id: 'sitemap',
            category: 'discoverability',
            title: 'Sitemap',
            status: 'fail',
            score: 0,
            summary: 'No sitemap.xml found.',
            details: 'Without a sitemap, AI crawlers (and search engines) have to discover pages by following links. Many pages may never be indexed.',
            fixSnippet: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://joes-plumbing-tulsa.com/</loc>
    <lastmod>2024-01-15</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://joes-plumbing-tulsa.com/services</loc>
    <lastmod>2024-01-15</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://joes-plumbing-tulsa.com/contact</loc>
    <lastmod>2024-01-15</lastmod>
    <priority>0.7</priority>
  </url>
</urlset>`,
            fixLabel: 'Example sitemap.xml',
          },
          {
            id: 'page-speed',
            category: 'discoverability',
            title: 'Page Speed Indicators',
            status: 'fail',
            score: 30,
            summary: 'Slow load time with unoptimized assets.',
            details: 'Total page weight: 4.8MB. Found 12 unoptimized JPEG images (largest: 2.1MB). 5 render-blocking scripts. No lazy loading. Slow pages are deprioritized by AI crawlers.',
            fixSnippet: `<!-- Add lazy loading to images -->
<img src="hero.jpg" loading="lazy" width="800" height="600" alt="Joe's Plumbing van in Tulsa" />

<!-- Defer non-critical scripts -->
<script src="analytics.js" defer></script>

<!-- Use modern image formats -->
<picture>
  <source srcset="hero.webp" type="image/webp" />
  <img src="hero.jpg" alt="Joe's Plumbing van" />
</picture>`,
            fixLabel: 'Optimize page speed',
          },
        ],
      },
    ],
  },
};

export const demoSuggestions = [
  { url: 'github.com', label: 'GitHub', grade: 'B' },
  { url: 'stripe.com', label: 'Stripe', grade: 'A' },
  { url: 'joes-plumbing-tulsa.com', label: "Joe's Plumbing", grade: 'F' },
];

export const averageScores: Record<string, number> = {
  'ai-access': 42,
  'structured-data': 35,
  'meta-content': 58,
  'discoverability': 51,
  overall: 47,
};
