/**
 * Browser entry point and foundation composition.
 * Initializes GameController coordinating engine session, clock, keyboard input, and views.
 * Conforms to B-VIEW, B-CONTROLS, B-TIME, and B-FAIL requirements.
 */

import { createSession } from './engine/session.js';
import { CanvasRenderer } from './ui/canvas-renderer.js';
import { HtmlView, type HtmlViewElements } from './ui/html-view.js';
import { GameController } from './browser/controller.js';

export function initializeApp(): GameController | null {
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

  const controller = new GameController({
    session,
    renderer,
    view,
    canvas,
    elements
  });

  return controller;
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initializeApp());
  } else {
    initializeApp();
  }
}
