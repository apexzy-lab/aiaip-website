import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const nonIndexablePaths = ['/404/', '/thank-you/', '/privacy/', '/terms/'];

function shouldIndex(page) {
  const { pathname } = new URL(page);
  if (nonIndexablePaths.includes(pathname)) return false;

  // Current report detail routes contain demonstration copy. Keep them out of
  // search until each report is replaced with an approved publication.
  if (pathname.startsWith('/research/') && pathname !== '/research/') return false;

  return true;
}

export default defineConfig({
  site: 'https://africanaipolicy.org',
  output: 'static',
  integrations: [
    sitemap({
      filter: shouldIndex,
    }),
  ],
  build: { format: 'directory' },
  compressHTML: true,
});
