/**
 * Game controller coordinating engine session, clock, keyboard input, and views.
 * Conforms to B-CONTROLS, B-TIME, B-VIEW, and S-API requirements.
 */

import type { Session } from '../engine/types.js';
import type { CanvasRenderer } from '../ui/canvas-renderer.js';
import type { HtmlView, HtmlViewElements } from '../ui/html-view.js';
import { AnimationClock } from './clock.js';
import { KeyboardInputAdapter } from './input.js';

export interface GameControllerOptions {
  readonly session: Session;
  readonly renderer: CanvasRenderer;
  readonly view: HtmlView;
  readonly canvas: HTMLCanvasElement;
  readonly elements: HtmlViewElements;
}

export class GameController {
  private readonly session: Session;
  private readonly renderer: CanvasRenderer;
  private readonly view: HtmlView;
  private readonly canvas: HTMLCanvasElement;
  private readonly elements: HtmlViewElements;
  private readonly clock: AnimationClock;
  private readonly input: KeyboardInputAdapter;

  constructor(options: GameControllerOptions) {
    this.session = options.session;
    this.renderer = options.renderer;
    this.view = options.view;
    this.canvas = options.canvas;
    this.elements = options.elements;

    this.clock = new AnimationClock((elapsedMs) => {
      this.onFrameTick(elapsedMs);
    });

    this.input = new KeyboardInputAdapter(this.canvas, (action) => {
      this.handleInputAction(action);
    });

    this.wireNativeButtons();
    this.wireCanvasFocus();

    // Initial render
    this.render();
  }

  public render(): void {
    const snapshot = this.session.getSnapshot();
    this.renderer.render(snapshot);
    this.view.update(snapshot);
  }

  private onFrameTick(elapsedMs: number): void {
    const snapshotBefore = this.session.getSnapshot();
    if (snapshotBefore.status !== 'running') {
      this.clock.stop();
      this.render();
      return;
    }

    this.session.advance(elapsedMs);
    this.render();

    const snapshotAfter = this.session.getSnapshot();
    if (snapshotAfter.status !== 'running') {
      this.clock.stop();
    }
  }

  public handleInputAction(action: string): void {
    const snap = this.session.getSnapshot();

    if (action === 'pause') {
      if (snap.status === 'running') {
        this.session.dispatch('pause');
        this.clock.stop();
      } else if (snap.status === 'paused') {
        this.session.dispatch('resume');
        this.clock.start();
      }
    } else if (action === 'start') {
      if (snap.status === 'ready' || snap.status === 'gameOver') {
        this.session.dispatch('start');
        this.clock.start();
      } else if (snap.status === 'paused') {
        this.session.dispatch('resume');
        this.clock.start();
      }
    } else if (action === 'restart') {
      this.clock.stop();
      this.session.dispatch('restart');
      this.clock.start();
    } else {
      // Gameplay actions (moveLeft, moveRight, softDrop, rotateCW, rotateCCW)
      this.session.dispatch(action);
    }

    this.render();
  }

  private wireNativeButtons(): void {
    const { btnStart, btnPause, btnRestart } = this.elements;

    if (btnStart) {
      btnStart.addEventListener('click', () => {
        this.handleInputAction('start');
        this.canvas.focus();
      });
    }

    if (btnPause) {
      btnPause.addEventListener('click', () => {
        this.handleInputAction('pause');
        this.canvas.focus();
      });
    }

    if (btnRestart) {
      btnRestart.addEventListener('click', () => {
        this.handleInputAction('restart');
        this.canvas.focus();
      });
    }
  }

  private wireCanvasFocus(): void {
    this.canvas.addEventListener('click', () => {
      this.canvas.focus();
    });
  }

  public getSession(): Session {
    return this.session;
  }

  public dispose(): void {
    this.clock.stop();
    this.input.detach();
  }
}
