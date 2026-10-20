# Development Guide

This guide describes the developer environment, verified tooling commands, isolated browser provisioning, and verification workflows for the TypeScript Tetris game.

## Prerequisites

- **Node.js**: >= 22.0.0 (tested with Node 26)
- **npm**: >= 10.0.0
- **Native Git**: on PATH

## Quick Start

1. Install dependencies:
   ```cmd
   npm install
   ```

2. Provision isolated browser binaries (Chromium and Firefox):
   ```cmd
   npm run browser:install
   ```
   *Note: In accordance with `BROWSER_DEV_POLICY.md`, binaries are installed into the project-isolated `.browsers/` directory (`PLAYWRIGHT_BROWSERS_PATH`), preventing global system modifications.*

3. Run verification checks:
   ```cmd
   npm run typecheck
   npm run build
   npm test
   npm run test:browser
   ```

## Available Scripts

| Script | Command | Purpose |
| --- | --- | --- |
| `npm run dev` | `vite` | Start local development server with HMR |
| `npm run typecheck` | `tsc -p tsconfig.engine.json --noEmit && ...` | Typecheck engine, app, and test scopes strictly |
| `npm run build` | `npm run typecheck && vite build` | Typecheck and build static production bundle to `dist/` |
| `npm test` | `vitest run` | Run Node-based unit and integration test suites |
| `npm run preview` | `vite preview` | Locally preview the static `dist/` production output |
| `npm run test:browser` | `playwright test` | Run end-to-end browser tests in isolated Chromium & Firefox |
| `npm run browser:install` | `node scripts/install-browsers.mjs` | Download managed browser binaries into `.browsers/` |

## Browser Development & Isolation Policy

This project strictly adheres to [BROWSER_DEV_POLICY.md](../BROWSER_DEV_POLICY.md):
- **Chromium** is the primary browser target; **Firefox** (Playwright-managed) is the secondary target.
- Binaries, caches, and test artifacts reside exclusively in `.browsers/`, `test-results/`, and `playwright-report/`, all excluded from version control.
- Global system browsers are never altered or invoked.
