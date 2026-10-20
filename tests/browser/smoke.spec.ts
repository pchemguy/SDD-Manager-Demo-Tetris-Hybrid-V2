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
    await expect(canvas).toHaveAttribute('tabindex', '0');

    // Initial status message
    const status = page.locator('#session-status');
    const overlay = page.locator('#session-overlay');
    await expect(status).toBeVisible();
    await expect(status).toHaveText('Ready');
    await expect(overlay).toBeVisible();
    await expect(overlay).not.toHaveClass(/hidden/);

    // Initial controls presence and state
    const btnStart = page.locator('#btn-start');
    const btnPause = page.locator('#btn-pause');
    const btnRestart = page.locator('#btn-restart');

    await expect(btnStart).toBeEnabled();
    await expect(btnPause).toBeDisabled();
    await expect(btnRestart).toBeDisabled();

    // Stats and preview initial display
    await expect(page.locator('#score-display')).toHaveText('0');
    await expect(page.locator('#lines-display')).toHaveText('0');
    await expect(page.locator('#level-display')).toHaveText('1');
    await expect(page.locator('#next-display')).toHaveText('None');
    await expect(page.locator('#hold-display')).toHaveText('None');

    // Start game via native Start button
    await btnStart.click();

    // Running state transitions
    await expect(btnStart).toBeDisabled();
    await expect(btnPause).toBeEnabled();
    await expect(btnPause).toHaveText('Pause');
    await expect(btnRestart).toBeEnabled();

    // Overlay is hidden during active running play
    await expect(overlay).toHaveClass(/hidden/);

    // Next piece preview is populated with one canonical piece
    const nextText = await page.locator('#next-display').textContent();
    expect(['I', 'J', 'L', 'O', 'S', 'T', 'Z']).toContain(nextText?.trim());

    // Playfield canvas receives focus
    await expect(canvas).toBeFocused();
  });

  test('coordinates pause, resume, and restart through native controls', async ({ page }) => {
    await page.goto('/');

    const btnStart = page.locator('#btn-start');
    const btnPause = page.locator('#btn-pause');
    const btnRestart = page.locator('#btn-restart');
    const status = page.locator('#session-status');
    const overlay = page.locator('#session-overlay');

    // Start game
    await btnStart.click();
    await expect(overlay).toHaveClass(/hidden/);

    // Click Pause
    await btnPause.click();
    await expect(overlay).toBeVisible();
    await expect(overlay).not.toHaveClass(/hidden/);
    await expect(status).toHaveText('Paused');
    await expect(btnPause).toHaveText('Resume');

    // Click Resume
    await btnPause.click();
    await expect(overlay).toHaveClass(/hidden/);
    await expect(btnPause).toHaveText('Pause');

    // Click Restart
    await btnRestart.click();
    await expect(overlay).toHaveClass(/hidden/);
    await expect(btnStart).toBeDisabled();
    await expect(btnPause).toBeEnabled();
    await expect(btnRestart).toBeEnabled();
  });

  test('drives falling piece prototype via keyboard inputs and elapsed time', async ({ page }) => {
    await page.goto('/');

    const canvas = page.locator('#playfield-canvas');
    const overlay = page.locator('#session-overlay');
    const status = page.locator('#session-status');

    // Focus canvas and press Enter to start
    await canvas.focus();
    await page.keyboard.press('Enter');

    await expect(overlay).toHaveClass(/hidden/);
    await expect(page.locator('#btn-start')).toBeDisabled();
    await expect(page.locator('#btn-restart')).toBeEnabled();

    // Move left and right
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowRight');

    // Rotate CW and CCW
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('KeyZ');

    // Soft drop
    await page.keyboard.press('ArrowDown');

    // Pause via keyboard (KeyP)
    await page.keyboard.press('KeyP');
    await expect(status).toHaveText('Paused');
    await expect(overlay).not.toHaveClass(/hidden/);

    // Resume via keyboard (KeyP)
    await page.keyboard.press('KeyP');
    await expect(overlay).toHaveClass(/hidden/);

    // Restart via keyboard (KeyR)
    await page.keyboard.press('KeyR');
    await expect(overlay).toHaveClass(/hidden/);
    await expect(page.locator('#btn-restart')).toBeEnabled();
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
