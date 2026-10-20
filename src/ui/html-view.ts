/**
 * HTML view updater for session controls, status overlay, statistics, and preview.
 * Conforms to B-VIEW and B-CONTROLS: reflects engine snapshot data without mutating live state.
 */

import type { EngineSnapshot } from '../engine/types.js';

export interface HtmlViewElements {
  readonly statusMessage: HTMLElement | null;
  readonly sessionOverlay: HTMLElement | null;
  readonly btnStart: HTMLButtonElement | null;
  readonly btnPause: HTMLButtonElement | null;
  readonly btnRestart: HTMLButtonElement | null;
  readonly scoreDisplay: HTMLElement | null;
  readonly linesDisplay: HTMLElement | null;
  readonly levelDisplay: HTMLElement | null;
  readonly nextDisplay: HTMLElement | null;
  readonly holdDisplay: HTMLElement | null;
}

export class HtmlView {
  private readonly elements: HtmlViewElements;

  constructor(elements: HtmlViewElements) {
    this.elements = elements;
  }

  public update(snapshot: EngineSnapshot): void {
    const {
      statusMessage,
      sessionOverlay,
      btnStart,
      btnPause,
      btnRestart,
      scoreDisplay,
      linesDisplay,
      levelDisplay,
      nextDisplay,
      holdDisplay
    } = this.elements;

    // Update status message text
    if (statusMessage) {
      switch (snapshot.status) {
        case 'ready':
          statusMessage.textContent = 'Ready';
          break;
        case 'running':
          statusMessage.textContent = 'Running';
          break;
        case 'paused':
          statusMessage.textContent = 'Paused';
          break;
        case 'gameOver':
          statusMessage.textContent = 'Game Over';
          break;
      }
    }

    // Toggle overlay visibility (hidden during active gameplay, shown for ready/paused/gameOver)
    if (sessionOverlay) {
      if (snapshot.status === 'running') {
        sessionOverlay.classList.add('hidden');
      } else {
        sessionOverlay.classList.remove('hidden');
      }
    }

    // Update native buttons per B-CONTROLS:
    // Start is enabled in ready / game over
    if (btnStart) {
      btnStart.disabled = snapshot.status === 'running' || snapshot.status === 'paused';
    }

    // Pause/Resume is enabled in running / paused
    if (btnPause) {
      btnPause.disabled = snapshot.status === 'ready' || snapshot.status === 'gameOver';
      btnPause.textContent = snapshot.status === 'paused' ? 'Resume' : 'Pause';
    }

    // Restart is enabled in every initialized running, paused, or gameOver state
    if (btnRestart) {
      btnRestart.disabled = snapshot.status === 'ready';
    }

    // Update statistics
    if (scoreDisplay) {
      scoreDisplay.textContent = String(snapshot.score);
    }
    if (linesDisplay) {
      linesDisplay.textContent = String(snapshot.lines);
    }
    if (levelDisplay) {
      levelDisplay.textContent = String(snapshot.level);
    }

    // Update one next piece preview
    if (nextDisplay) {
      nextDisplay.textContent = snapshot.next ?? 'None';
    }

    // Update held piece
    if (holdDisplay) {
      holdDisplay.textContent = snapshot.held ?? 'None';
      if (!snapshot.canHold) {
        holdDisplay.setAttribute('aria-disabled', 'true');
      } else {
        holdDisplay.removeAttribute('aria-disabled');
      }
    }
  }
}
