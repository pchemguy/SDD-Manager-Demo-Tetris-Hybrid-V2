import { describe, it, expect, afterAll, beforeAll } from 'vitest';
import { createServer, ViteDevServer } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

describe('Development server sensitive file refusal (server.fs.deny)', () => {
  let server: ViteDevServer;
  let devUrl: string;
  const synthFixturePath = path.resolve('synthetic-security.tkn');

  beforeAll(async () => {
    // Create synthetic token fixture in root
    fs.writeFileSync(synthFixturePath, 'SYNTHETIC_TEST_SECRET_VALUE');

    // Start Vite dev server on dedicated ephemeral port
    server = await createServer({
      configFile: path.resolve('vite.config.ts'),
      server: { port: 5174 }
    });
    await server.listen();
    const address = server.httpServer?.address();
    const port = typeof address === 'object' && address ? address.port : 5174;
    devUrl = `http://localhost:${port}`;
  });

  afterAll(async () => {
    if (server) {
      await server.close();
    }
    if (fs.existsSync(synthFixturePath)) {
      fs.unlinkSync(synthFixturePath);
    }
  });

  it('refuses access to synthetic .tkn files with HTTP 403 Forbidden', async () => {
    const res = await fetch(`${devUrl}/synthetic-security.tkn`);
    expect(res.status).toBe(403);
  });

  it('excludes sensitive, credential, and test files from the production dist bundle', () => {
    const distPath = path.resolve('dist');
    expect(fs.existsSync(distPath)).toBe(true);

    const distFiles = fs.readdirSync(distPath, { recursive: true }) as string[];
    // None of the dist files may match .tkn, .env, or test patterns
    for (const file of distFiles) {
      expect(file).not.toMatch(/\.tkn$/i);
      expect(file).not.toMatch(/\.env/i);
      expect(file).not.toMatch(/\.test\./i);
      expect(file).not.toMatch(/\.spec\./i);
    }
  });
});
