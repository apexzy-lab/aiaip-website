import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://africanaipolicy.org',
  output: 'static',
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/404/') && !page.endsWith('/thank-you/'),
    }),
  ],
  build: { format: 'directory' },
  compressHTML: true,
});
