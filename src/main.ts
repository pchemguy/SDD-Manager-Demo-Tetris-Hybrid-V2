/**
 * Browser entry point and foundation composition.
 * Connects GameSession engine with CanvasRenderer and HtmlView.
 * Conforms to B-VIEW, B-CONTROLS, and B-FAIL requirements.
 */

import { createSession } from './engine/session.js';
import type { Session } from './engine/types.js';
import { CanvasRenderer } from './ui/canvas-renderer.js';
import { HtmlView, type HtmlViewElements } from './ui/html-view.js';

export interface AppInstance {
  readonly session: Session;
  readonly renderer: CanvasRenderer;
  readonly view: HtmlView;
}

export function initializeApp(): AppInstance | null {
  const canvas = document.getElementById('playfield-canvas') as HTMLCanvasElement | null;
  if (!canvas) {
    const errorMsg = document.createElement('div');
    errorMsg.id = 'bootstrap-error';
    errorMsg.textContent = 'Failed to initialize: Canvas element not found.';
    document.body.prepend(errorMsg);
    return null;
  }

  let renderer: CanvasRenderer;
  try {
    renderer = new CanvasRenderer(canvas);
  } catch {
    const errorMsg = document.createElement('div');
    errorMsg.id = 'bootstrap-error';
    errorMsg.textContent = 'Failed to initialize: 2D rendering context not supported.';
    document.body.prepend(errorMsg);
    return null;
  }

  const elements: HtmlViewElements = {
    statusMessage: document.getElementById('session-status'),
    sessionOverlay: document.getElementById('session-overlay'),
    btnStart: document.getElementById('btn-start') as HTMLButtonElement | null,
    btnPause: document.getElementById('btn-pause') as HTMLButtonElement | null,
    btnRestart: document.getElementById('btn-restart') as HTMLButtonElement | null,
    scoreDisplay: document.getElementById('score-display'),
    linesDisplay: document.getElementById('lines-display'),
    levelDisplay: document.getElementById('level-display'),
    nextDisplay: document.getElementById('next-display'),
    holdDisplay: document.getElementById('hold-display')
  };

  const view = new HtmlView(elements);
  const session = createSession({ random: Math.random });

  const renderCurrent = () => {
    const snapshot = session.getSnapshot();
    renderer.render(snapshot);
    view.update(snapshot);
  };

  // Wire native buttons per B-CONTROLS
  if (elements.btnStart) {
    elements.btnStart.addEventListener('click', () => {
      session.dispatch('start');
      renderCurrent();
      canvas.focus();
    });
  }

  if (elements.btnPause) {
    elements.btnPause.addEventListener('click', () => {
      const snap = session.getSnapshot();
      if (snap.status === 'running') {
        session.dispatch('pause');
      } else if (snap.status === 'paused') {
        session.dispatch('resume');
      }
      renderCurrent();
      canvas.focus();
    });
  }

  if (elements.btnRestart) {
    elements.btnRestart.addEventListener('click', () => {
      session.dispatch('restart');
      renderCurrent();
      canvas.focus();
    });
  }

  // Clicking playfield focuses it per B-CONTROLS
  canvas.addEventListener('click', () => {
    canvas.focus();
  });

  // Render initial ready state
  renderCurrent();

  return { session, renderer, view };
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initializeApp());
  } else {
    initializeApp();
  }
}
