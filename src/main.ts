/**
 * Browser entry point and foundation composition.
 * Initializes semantic controls and static shell without claiming full gameplay implementation.
 */

function init(): void {
  const canvas = document.getElementById('playfield-canvas') as HTMLCanvasElement | null;
  if (!canvas) {
    const errorMsg = document.createElement('div');
    errorMsg.id = 'bootstrap-error';
    errorMsg.textContent = 'Failed to initialize: Canvas element not found.';
    document.body.prepend(errorMsg);
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    const errorMsg = document.createElement('div');
    errorMsg.id = 'bootstrap-error';
    errorMsg.textContent = 'Failed to initialize: 2D rendering context not supported.';
    document.body.prepend(errorMsg);
    return;
  }

  // Draw initial empty grid (10 columns by 20 rows, 30px cell size)
  ctx.fillStyle = '#09090b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#18181b';
  ctx.lineWidth = 1;

  for (let x = 0; x <= canvas.width; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= canvas.height; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Wire initial button states for static shell demonstration
  const btnStart = document.getElementById('btn-start') as HTMLButtonElement | null;
  const statusMsg = document.getElementById('session-status');

  if (btnStart && statusMsg) {
    btnStart.addEventListener('click', () => {
      statusMsg.textContent = 'Ready (Prototype Foundation)';
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
