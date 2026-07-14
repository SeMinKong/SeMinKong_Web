import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const rootDirectory = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        portfolio: resolve(rootDirectory, 'index.html'),
        work: resolve(rootDirectory, 'work/index.html'),
        aqis: resolve(rootDirectory, 'work/aqis/index.html'),
        brainTumorMri: resolve(rootDirectory, 'work/brain-tumor-mri/index.html'),
        alkkagi: resolve(rootDirectory, 'work/alkkagi/index.html'),
        briefit: resolve(rootDirectory, 'work/briefit/index.html'),
        projectPromptGenerator: resolve(rootDirectory, 'work/project-prompt-generator/index.html'),
        about: resolve(rootDirectory, 'about/index.html'),
        resume: resolve(rootDirectory, 'resume/index.html')
      }
    }
  }
});
