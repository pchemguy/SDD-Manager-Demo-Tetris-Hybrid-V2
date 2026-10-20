import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const browsersPath = path.join(root, '.browsers');

console.log(`[setup] Provisioning isolated Playwright Chromium and Firefox in: ${browsersPath}`);

execSync('npx playwright install chromium firefox', {
  stdio: 'inherit',
  env: {
    ...process.env,
    PLAYWRIGHT_BROWSERS_PATH: browsersPath
  }
});

console.log('[setup] Browser provisioning completed successfully.');
