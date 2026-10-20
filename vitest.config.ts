import { defineConfig } from 'vitest/config';
import fs from 'node:fs';

const projectRoot = fs.realpathSync(process.cwd());

export default defineConfig({
  root: projectRoot,
  server: {
    fs: {
      allow: [process.cwd(), projectRoot]
    }
  },
  test: {
    include: [
      'tests/unit/**/*.test.ts',
      'tests/integration/**/*.test.ts'
    ],
    exclude: [
      'tests/browser/**',
      '.agents/**',
      'node_modules/**',
      'dist/**'
    ]
  }
});
