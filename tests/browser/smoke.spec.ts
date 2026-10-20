import { test, expect } from '@playwright/test';

test.describe('Static Browser Foundation Smoke', () => {
  test('loads static shell with canvas, semantic controls, and initial ready status', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle('Tetris');

    // Canvas element presence and geometry
    const canvas = page.locator('#playfield-canvas');
    await expect(canvas).toBeVisible();
    await expect(canvas).toHaveAttribute('width', '300');
    await expect(canvas).toHaveAttribute('height', '600');

    // Initial status message
    const status = page.locator('#session-status');
    await expect(status).toBeVisible();
    await expect(status).toHaveText('Ready');

    // Controls presence and state
    const btnStart = page.locator('#btn-start');
    const btnPause = page.locator('#btn-pause');
    const btnRestart = page.locator('#btn-restart');

    await expect(btnStart).toBeEnabled();
    await expect(btnPause).toBeDisabled();
    await expect(btnRestart).toBeDisabled();

    // Interaction test on the initial static shell
    await btnStart.click();
    await expect(status).toHaveText('Ready (Prototype Foundation)');
  });

  test('production server does not serve credentials and dist excludes sensitive files', async ({ request }) => {
    const response = await request.get('/gh.tkn');
    const text = await response.text();

    // The response must never contain token or secret content
    expect(text).not.toContain('github_pat_');
    expect(text).not.toContain('TOKEN');

    // In SPA preview mode, non-existent assets return the HTML shell (status 200) or 404/403
    if (response.status() === 200) {
      expect(text).toContain('<!DOCTYPE html>');
      expect(text).toContain('id="app"');
    } else {
      expect([403, 404]).toContain(response.status());
    }
  });
});
