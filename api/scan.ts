import { Hono } from 'hono';
import { handle } from 'hono/vercel';

export const config = {
  runtime: 'edge',
};

const app = new Hono().basePath('/api');

interface CrawlerStatus {
  name: string;
  allowed: boolean;
  found: boolean;
}

interface ScanData {
  url: string;
  robotsTxt: {
    exists: boolean;
    content: string;
    crawlers: CrawlerStatus[];
  };
  llmsTxt: {
    exists: boolean;
    content: string;
  };
  sitemap: {
    exists: boolean;
  };
  html: {
    title: string;
    metaDescription: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    h1Count: number;
    h2Count: number;
    h3Count: number;
    h4Count: number;
    h5Count: number;
    h6Count: number;
    hasJsonLd: boolean;
    jsonLdTypes: string[];
    hasFaqSchema: boolean;
    hasHowToSchema: boolean;
    wordCount: number;
    paragraphCount: number;
    imageCount: number;
    imagesWithoutAlt: number;
    hasSemanticHtml: boolean;
  };
}

const AI_CRAWLERS = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'];

function parseRobotsTxt(content: string): CrawlerStatus[] {
  const lines = content.toLowerCase().split('\n');
  return AI_CRAWLERS.map((crawler) => {
    const crawlerLower = crawler.toLowerCase();
    let inSection = false;
    let allowed = true;
    let found = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('user-agent:')) {
        const agent = trimmed.split(':')[1]?.trim();
        if (agent === crawlerLower || agent === '*') {
          inSection = agent === crawlerLower;
          if (agent === crawlerLower) found = true;
        } else {
          inSection = false;
        }
      } else if (inSection && trimmed.startsWith('disallow:')) {
        const path = trimmed.split(':')[1]?.trim();
        if (path === '/' || path === '') {
          allowed = path !== '/';
        }
      } else if (inSection && trimmed.startsWith('allow:')) {
        allowed = true;
      }
    }

    return { name: crawler, allowed, found };
  });
}

async function fetchWithTimeout(url: string, timeoutMs = 5000): Promise<Response | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'AIVisibilityChecker/1.0' },
      redirect: 'follow',
    });
    return res;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function scanUrl(url: string): Promise<ScanData> {
  const baseUrl = url.startsWith('http') ? url : `https://${url}`;
  const origin = new URL(baseUrl).origin;

  // Parallel fetches
  const [robotsRes, llmsRes, sitemapRes, htmlRes] = await Promise.all([
    fetchWithTimeout(`${origin}/robots.txt`),
    fetchWithTimeout(`${origin}/llms.txt`),
    fetchWithTimeout(`${origin}/sitemap.xml`),
    fetchWithTimeout(baseUrl),
  ]);

  const robotsTxt = robotsRes?.ok ? await robotsRes.text() : '';
  const llmsTxt = llmsRes?.ok ? await llmsRes.text() : '';
  const html = htmlRes?.ok ? await htmlRes.text() : '';

  // Parse HTML
  const getMetaContent = (name: string): string => {
    const re = new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']*)["']`, 'i');
    const re2 = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:name|property)=["']${name}["']`, 'i');
    return re.exec(html)?.[1] || re2.exec(html)?.[1] || '';
  };

  const countTag = (tag: string): number => {
    const re = new RegExp(`<${tag}[\\s>]`, 'gi');
    return (html.match(re) || []).length;
  };

  // JSON-LD extraction
  const jsonLdMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  const jsonLdTypes: string[] = [];
  let hasFaqSchema = false;
  let hasHowToSchema = false;

  for (const match of jsonLdMatches) {
    try {
      const content = match.replace(/<\/?script[^>]*>/gi, '');
      const parsed = JSON.parse(content);
      const type = parsed['@type'] || '';
      if (type) jsonLdTypes.push(type);
      if (type === 'FAQPage' || JSON.stringify(parsed).includes('FAQPage')) hasFaqSchema = true;
      if (type === 'HowTo' || JSON.stringify(parsed).includes('HowTo')) hasHowToSchema = true;
    } catch {
      // malformed JSON-LD
    }
  }

  // Word count
  const textContent = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ');
  const words = textContent.split(/\s+/).filter((w) => w.length > 0);

  // Images without alt
  const images = html.match(/<img[^>]*>/gi) || [];
  const imagesWithoutAlt = images.filter((img) => !img.includes('alt=') || /alt=["']\s*["']/.test(img)).length;

  // Semantic HTML
  const semanticTags = ['<nav', '<main', '<article', '<section', '<aside', '<header', '<footer'];
  const hasSemanticHtml = semanticTags.some((tag) => html.toLowerCase().includes(tag));

  // Title
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);

  return {
    url,
    robotsTxt: {
      exists: robotsRes?.ok ?? false,
      content: robotsTxt.slice(0, 2000),
      crawlers: parseRobotsTxt(robotsTxt),
    },
    llmsTxt: {
      exists: llmsRes?.ok ?? false,
      content: llmsTxt.slice(0, 1000),
    },
    sitemap: {
      exists: sitemapRes?.ok ?? false,
    },
    html: {
      title: titleMatch?.[1] || '',
      metaDescription: getMetaContent('description'),
      ogTitle: getMetaContent('og:title'),
      ogDescription: getMetaContent('og:description'),
      ogImage: getMetaContent('og:image'),
      h1Count: countTag('h1'),
      h2Count: countTag('h2'),
      h3Count: countTag('h3'),
      h4Count: countTag('h4'),
      h5Count: countTag('h5'),
      h6Count: countTag('h6'),
      hasJsonLd: jsonLdMatches.length > 0,
      jsonLdTypes,
      hasFaqSchema,
      hasHowToSchema,
      wordCount: words.length,
      paragraphCount: countTag('p'),
      imageCount: images.length,
      imagesWithoutAlt,
      hasSemanticHtml,
    },
  };
}

function scoreFromScan(data: ScanData) {
  const checks: any[] = [];

  // 1. robots.txt
  const allAllowed = data.robotsTxt.crawlers.every((c) => c.allowed);
  const someAllowed = data.robotsTxt.crawlers.some((c) => c.allowed);
  const blockedNames = data.robotsTxt.crawlers.filter((c) => !c.allowed).map((c) => c.name);

  checks.push({
    id: 'robots-txt',
    category: 'ai-access',
    title: 'robots.txt',
    status: !data.robotsTxt.exists ? 'warning' : allAllowed ? 'pass' : someAllowed ? 'warning' : 'fail',
    score: !data.robotsTxt.exists ? 40 : allAllowed ? 100 : someAllowed ? 60 : 20,
    summary: !data.robotsTxt.exists
      ? 'No robots.txt found — AI crawlers will assume full access.'
      : allAllowed
        ? 'robots.txt allows all major AI crawlers.'
        : `robots.txt blocks: ${blockedNames.join(', ')}.`,
    details: !data.robotsTxt.exists
      ? 'No robots.txt file was found. While this means AI crawlers aren\'t explicitly blocked, having one gives you control over what gets indexed.'
      : `Found robots.txt. ${data.robotsTxt.crawlers.map((c) => `${c.name}: ${c.allowed ? 'allowed' : 'BLOCKED'}${c.found ? '' : ' (not mentioned, defaults to allowed)'}`).join('. ')}.`,
    ...(blockedNames.length > 0 && {
      fixSnippet: blockedNames.map((n) => `User-agent: ${n}\nAllow: /\n`).join('\n'),
      fixLabel: 'Allow blocked AI crawlers',
    }),
  });

  // 2. llms.txt
  checks.push({
    id: 'llms-txt',
    category: 'ai-access',
    title: 'llms.txt',
    status: data.llmsTxt.exists ? 'pass' : 'fail',
    score: data.llmsTxt.exists ? 100 : 0,
    summary: data.llmsTxt.exists
      ? 'llms.txt found! Your site provides AI-readable summaries.'
      : 'No llms.txt file found.',
    details: data.llmsTxt.exists
      ? `Found llms.txt (${data.llmsTxt.content.length} chars). This helps AI systems understand your site structure and content.`
      : 'The llms.txt standard provides a structured summary of your site for AI models. Adding one can significantly improve how AI systems understand and reference your content.',
    ...(!data.llmsTxt.exists && {
      fixSnippet: `# ${data.url} llms.txt\n\n> Brief description of your site.\n\n## Key Pages\n- [About](/about)\n- [Docs](/docs)\n- [Blog](/blog)`,
      fixLabel: 'Create an llms.txt file',
    }),
  });

  // 3. JSON-LD
  checks.push({
    id: 'json-ld',
    category: 'structured-data',
    title: 'JSON-LD / Schema.org',
    status: data.html.hasJsonLd ? (data.html.jsonLdTypes.length > 1 ? 'pass' : 'warning') : 'fail',
    score: data.html.hasJsonLd ? Math.min(50 + data.html.jsonLdTypes.length * 20, 100) : 0,
    summary: data.html.hasJsonLd
      ? `JSON-LD found with types: ${data.html.jsonLdTypes.join(', ')}.`
      : 'No JSON-LD structured data found.',
    details: data.html.hasJsonLd
      ? `Found ${data.html.jsonLdTypes.length} Schema.org type(s): ${data.html.jsonLdTypes.join(', ')}. This helps AI understand your page content and context.`
      : 'No Schema.org/JSON-LD markup detected. Adding structured data helps AI systems understand what your pages are about.',
    ...(!data.html.hasJsonLd && {
      fixSnippet: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  "name": "${data.html.title || 'Your Page Title'}",\n  "description": "${data.html.metaDescription || 'Your description'}",\n  "url": "https://${data.url}"\n}\n</script>`,
      fixLabel: 'Add basic JSON-LD',
    }),
  });

  // 4. FAQ Schema
  checks.push({
    id: 'faq-schema',
    category: 'structured-data',
    title: 'FAQ / How-To Schema',
    status: data.html.hasFaqSchema || data.html.hasHowToSchema ? 'pass' : 'fail',
    score: (data.html.hasFaqSchema ? 50 : 0) + (data.html.hasHowToSchema ? 50 : 0),
    summary: data.html.hasFaqSchema && data.html.hasHowToSchema
      ? 'Both FAQ and HowTo schemas found.'
      : data.html.hasFaqSchema
        ? 'FAQ schema found.'
        : data.html.hasHowToSchema
          ? 'HowTo schema found.'
          : 'No FAQ or HowTo schema detected.',
    details: 'FAQ and HowTo schemas help AI models extract structured, citable answers from your content.',
  });

  // 5. Meta description
  const descLen = data.html.metaDescription.length;
  checks.push({
    id: 'meta-description',
    category: 'meta-content',
    title: 'Meta Description',
    status: descLen >= 120 && descLen <= 160 ? 'pass' : descLen > 0 ? 'warning' : 'fail',
    score: descLen >= 120 && descLen <= 160 ? 100 : descLen > 0 ? 50 : 0,
    summary: descLen === 0
      ? 'No meta description found.'
      : `Meta description found (${descLen} chars)${descLen < 120 ? ' — too short' : descLen > 160 ? ' — too long' : ''}.`,
    details: descLen === 0
      ? 'Missing meta description. AI models use this to understand and summarize your page.'
      : `"${data.html.metaDescription.slice(0, 200)}" — ${descLen < 120 ? 'Consider expanding to 120-160 chars for optimal AI parsing.' : descLen > 160 ? 'Consider trimming to 120-160 chars.' : 'Good length for AI parsing.'}`,
  });

  // 6. OG Tags
  const hasOg = !!(data.html.ogTitle && data.html.ogDescription);
  checks.push({
    id: 'og-tags',
    category: 'meta-content',
    title: 'OpenGraph Tags',
    status: hasOg && data.html.ogImage ? 'pass' : hasOg || data.html.ogTitle ? 'warning' : 'fail',
    score: (data.html.ogTitle ? 30 : 0) + (data.html.ogDescription ? 30 : 0) + (data.html.ogImage ? 40 : 0),
    summary: hasOg && data.html.ogImage
      ? 'Complete OpenGraph tags found.'
      : `Missing: ${[!data.html.ogTitle && 'og:title', !data.html.ogDescription && 'og:description', !data.html.ogImage && 'og:image'].filter(Boolean).join(', ')}.`,
    details: `og:title: ${data.html.ogTitle || '❌ missing'}. og:description: ${data.html.ogDescription ? '✓' : '❌ missing'}. og:image: ${data.html.ogImage ? '✓' : '❌ missing'}.`,
  });

  // 7. Content Structure
  const goodHeadings = data.html.h1Count === 1 && data.html.h2Count > 0;
  checks.push({
    id: 'headings',
    category: 'meta-content',
    title: 'Content Structure',
    status: goodHeadings && data.html.hasSemanticHtml ? 'pass' : goodHeadings || data.html.h1Count === 1 ? 'warning' : 'fail',
    score: (data.html.h1Count === 1 ? 40 : data.html.h1Count > 0 ? 20 : 0) +
      (data.html.h2Count > 0 ? 20 : 0) +
      (data.html.hasSemanticHtml ? 20 : 0) +
      (data.html.h3Count > 0 ? 10 : 0) +
      (data.html.h1Count <= 1 ? 10 : 0),
    summary: `${data.html.h1Count} H1${data.html.h1Count !== 1 ? 's' : ''}, ${data.html.h2Count} H2s, ${data.html.h3Count} H3s. ${data.html.hasSemanticHtml ? 'Semantic HTML detected.' : 'No semantic HTML elements.'}`,
    details: `Heading counts — H1: ${data.html.h1Count}, H2: ${data.html.h2Count}, H3: ${data.html.h3Count}, H4: ${data.html.h4Count}, H5: ${data.html.h5Count}, H6: ${data.html.h6Count}. ${data.html.h1Count > 1 ? 'Multiple H1 tags detected — use exactly one per page.' : ''} Semantic elements: ${data.html.hasSemanticHtml ? 'Yes (nav, main, article, etc.)' : 'Not detected — consider using semantic HTML5 elements.'}`,
  });

  // 8. Readability
  const avgWordsPerParagraph = data.html.paragraphCount > 0 ? data.html.wordCount / data.html.paragraphCount : 0;
  const readabilityScore = data.html.wordCount > 300 ? (avgWordsPerParagraph < 40 ? 80 : 50) : (data.html.wordCount > 100 ? 50 : 20);
  checks.push({
    id: 'readability',
    category: 'meta-content',
    title: 'Content Clarity',
    status: readabilityScore >= 70 ? 'pass' : readabilityScore >= 40 ? 'warning' : 'fail',
    score: readabilityScore,
    summary: `${data.html.wordCount} words across ${data.html.paragraphCount} paragraphs. ${data.html.wordCount < 200 ? 'Very thin content.' : avgWordsPerParagraph < 40 ? 'Good paragraph length.' : 'Paragraphs may be too long.'}`,
    details: `Word count: ${data.html.wordCount}. Paragraphs: ${data.html.paragraphCount}. Average words/paragraph: ${Math.round(avgWordsPerParagraph)}. Images: ${data.html.imageCount} (${data.html.imagesWithoutAlt} missing alt text). ${data.html.wordCount < 300 ? 'Consider adding more content — AI needs substance to reference.' : 'Good content volume.'}`,
  });

  // 9. Sitemap
  checks.push({
    id: 'sitemap',
    category: 'discoverability',
    title: 'Sitemap',
    status: data.sitemap.exists ? 'pass' : 'fail',
    score: data.sitemap.exists ? 100 : 0,
    summary: data.sitemap.exists ? 'sitemap.xml found.' : 'No sitemap.xml found.',
    details: data.sitemap.exists
      ? 'Your sitemap helps AI crawlers discover all important pages on your site.'
      : 'Without a sitemap, AI crawlers must discover pages by following links, and may miss important content.',
    ...(!data.sitemap.exists && {
      fixSnippet: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://${data.url}/</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <priority>1.0</priority>\n  </url>\n</urlset>`,
      fixLabel: 'Create a sitemap.xml',
    }),
  });

  // 10. Page speed (basic)
  const pageWeight = data.html.wordCount; // rough proxy
  checks.push({
    id: 'page-speed',
    category: 'discoverability',
    title: 'Page Speed Indicators',
    status: data.html.imageCount < 20 && data.html.imagesWithoutAlt < 5 ? 'pass' : 'warning',
    score: Math.max(20, 80 - data.html.imagesWithoutAlt * 10 - Math.max(0, data.html.imageCount - 15) * 5),
    summary: `${data.html.imageCount} images found, ${data.html.imagesWithoutAlt} missing alt text.`,
    details: `Total images: ${data.html.imageCount}. Missing alt text: ${data.html.imagesWithoutAlt}. Basic content weight analysis only — for full performance metrics, use Lighthouse.`,
  });

  // Build categories
  const categoryDefs = [
    { id: 'ai-access', name: 'AI Crawler Access', icon: 'Bot' },
    { id: 'structured-data', name: 'Structured Data', icon: 'Code2' },
    { id: 'meta-content', name: 'Meta & Content', icon: 'FileText' },
    { id: 'discoverability', name: 'Discoverability', icon: 'Search' },
  ];

  const categories = categoryDefs.map((def) => {
    const catChecks = checks.filter((c) => c.category === def.id);
    const avgScore = catChecks.length > 0
      ? Math.round(catChecks.reduce((sum, c) => sum + c.score, 0) / catChecks.length)
      : 0;
    return { ...def, score: avgScore, checks: catChecks };
  });

  const overallScore = Math.round(categories.reduce((sum, c) => sum + c.score, 0) / categories.length);
  const letterGrade = overallScore >= 90 ? 'A' : overallScore >= 75 ? 'B' : overallScore >= 60 ? 'C' : overallScore >= 40 ? 'D' : 'F';

  return {
    url: data.url,
    timestamp: new Date().toISOString(),
    overallScore,
    letterGrade,
    categories,
  };
}

app.get('/scan', async (c) => {
  const url = c.req.query('url');
  if (!url) {
    return c.json({ error: 'Missing url parameter' }, 400);
  }

  try {
    const data = await scanUrl(url);
    const result = scoreFromScan(data);
    return c.json(result);
  } catch (e: any) {
    return c.json({ error: `Scan failed: ${e.message}` }, 500);
  }
});

export default handle(app);
