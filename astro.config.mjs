import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://africanaipolicy.org',
  output: 'static',
  integrations: [sitemap()],
  build: { format: 'directory' },
  compressHTML: true,
});
