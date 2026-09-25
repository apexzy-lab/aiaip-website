import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const dist = path.resolve('dist');
const canonicalOrigin = 'https://africanaipolicy.org';
const siteName = 'African Institute for Artificial Intelligence Policy';
const errors = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  }));
  return files.flat();
}

function match(html, pattern) {
  return html.match(pattern)?.[1]?.trim() ?? '';
}

const files = await walk(dist);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const indexableCanonicals = new Set();
const titles = new Map();

for (const file of htmlFiles) {
  const relative = path.relative(dist, file).replaceAll('\\', '/');
  const html = await readFile(file, 'utf8');
  const title = match(html, /<title>([\s\S]*?)<\/title>/i);
  const description = match(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
  const canonical = match(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i);
  const robots = match(html, /<meta\s+name="robots"\s+content="([^"]+)"/i);
  const h1Count = (html.match(/<h1(?:\s|>)/gi) ?? []).length;
  const noindex = robots.toLowerCase().includes('noindex') || relative === '404.html';

  if (!title) errors.push(`${relative}: missing title`);
  if (!description) errors.push(`${relative}: missing meta description`);
  if (!canonical.startsWith(canonicalOrigin)) errors.push(`${relative}: invalid canonical ${canonical || '(missing)'}`);
  if (h1Count !== 1) errors.push(`${relative}: expected one h1, found ${h1Count}`);
  if (/africanaipolicy\.com/i.test(html)) errors.push(`${relative}: contains the inactive .com domain`);

  if (!noindex) {
    if (!robots.toLowerCase().startsWith('index, follow')) errors.push(`${relative}: indexable page has unexpected robots value`);
    if (canonical !== `${canonicalOrigin}/` && !canonical.endsWith('/')) errors.push(`${relative}: canonical should end with a slash`);
    if (indexableCanonicals.has(canonical)) errors.push(`${relative}: duplicate canonical ${canonical}`);
    indexableCanonicals.add(canonical);

    const existingFile = titles.get(title);
    if (existingFile) errors.push(`${relative}: duplicate title shared with ${existingFile}`);
    titles.set(title, relative);
  }

  const jsonLd = match(html, /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  if (!jsonLd) {
    errors.push(`${relative}: missing JSON-LD`);
  } else {
    try {
      const schema = JSON.parse(jsonLd);
      const graph = Array.isArray(schema['@graph']) ? schema['@graph'] : [];
      if (!graph.some((node) => node['@type'] === 'WebPage' || ['AboutPage', 'ContactPage', 'CollectionPage', 'Article'].includes(node['@type']))) {
        errors.push(`${relative}: missing page entity in JSON-LD graph`);
      }
      if (relative === 'index.html') {
        const website = graph.find((node) => node['@type'] === 'WebSite');
        if (!website || website.name !== siteName || website.url !== `${canonicalOrigin}/`) {
          errors.push('index.html: WebSite name or URL is inconsistent');
        }
        if (!Array.isArray(website?.alternateName) || !website.alternateName.includes('AIAIP')) {
          errors.push('index.html: WebSite alternateName must include AIAIP');
        }
      }
    } catch (error) {
      errors.push(`${relative}: invalid JSON-LD (${error.message})`);
    }
  }
}

const sitemap = await readFile(path.join(dist, 'sitemap-0.xml'), 'utf8');
const sitemapUrls = new Set([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((item) => item[1]));
for (const canonical of indexableCanonicals) {
  if (!sitemapUrls.has(canonical)) errors.push(`Sitemap is missing ${canonical}`);
}
for (const url of sitemapUrls) {
  if (!indexableCanonicals.has(url)) errors.push(`Sitemap contains a non-indexable or missing URL: ${url}`);
}

const robots = await readFile(path.join(dist, 'robots.txt'), 'utf8');
if (!robots.includes(`Sitemap: ${canonicalOrigin}/sitemap-index.xml`)) {
  errors.push('robots.txt does not reference the canonical sitemap index');
}

if (errors.length) {
  console.error(`SEO audit failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`SEO audit passed: ${indexableCanonicals.size} indexable canonical pages, unique titles, valid JSON-LD, and sitemap parity.`);
