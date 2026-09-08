import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { SITE_ROUTES } from './config/site-routes.js';

const rootDirectory = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: './',
  html: {
    additionalAssetSources: {
      // Full-size image links must resolve to the same built asset as <img>.
      a: {
        srcAttributes: ['href'],
        filter: ({ value }) => value.startsWith('/src/assets/')
      }
    }
  },
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries(
        SITE_ROUTES.map(({ name, source }) => [name, resolve(rootDirectory, source)])
      )
    }
  }
});
