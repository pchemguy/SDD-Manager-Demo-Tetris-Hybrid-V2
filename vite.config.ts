import { defineConfig } from 'vite';
import fs from 'node:fs';

const projectRoot = fs.realpathSync(process.cwd());

export default defineConfig({
  root: projectRoot,
  base: './',
  server: {
    fs: {
      allow: [process.cwd(), projectRoot],
      deny: ['**/*.tkn', '**/.env*']
    }
  },
  preview: {
    port: 4173
  }
});
