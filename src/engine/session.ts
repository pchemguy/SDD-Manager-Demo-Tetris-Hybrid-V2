/**
 * Canonical session facade coordinating lifecycle, actions, and detached state projection.
 * Implements S-API, S-DATA, and S-DETERMINISM requirements.
 */

import type {
  Session,
  SessionOptions,
  SessionStatus,
  BoardGrid,
  ActivePiece,
  TetrominoType,
  EngineSnapshot
} from './types.js';
import { createEmptyBoard } from './board.js';
import { SPAWN_DEFINITIONS, getPieceCells } from './geometry.js';
import { isLegalPlacement, tryRotatePiece } from './placement.js';
import { PieceSequence } from './sequence.js';
import { projectSnapshot } from './snapshot.js';

const RECOGNIZED_ACTIONS = new Set([
  'start',
  'restart',
  'pause',
  'resume',
  'moveLeft',
  'moveRight',
  'rotateCW',
  'rotateCCW',
  'softDrop',
  'hardDrop',
  'hold'
]);

export class GameSession implements Session {
  private status: SessionStatus = 'ready';
  private board: BoardGrid = createEmptyBoard();
  private active: ActivePiece | null = null;
  private held: TetrominoType | null = null;
  private canHold = false;
  private score = 0;
  private lines = 0;
  private level = 1;
  private sequence: PieceSequence | null = null;
  private readonly random: () => number;

  constructor(options: SessionOptions) {
    if (!options || typeof options.random !== 'function') {
      throw new TypeError('Session requires an options object with a valid random function.');
    }
    this.random = options.random;
  }

  public dispatch(action: string): void {
    if (typeof action !== 'string') {
      throw new TypeError(`Action must be a string, received ${typeof action}.`);
    }
    if (!RECOGNIZED_ACTIONS.has(action)) {
      throw new RangeError(`Unrecognized action: "${action}".`);
    }

    if (action === 'start') {
      if (this.status === 'ready' || this.status === 'gameOver') {
        this.startFreshGame();
      }
      return;
    }

    if (action === 'restart') {
      this.startFreshGame();
      return;
    }

    if (action === 'pause') {
      if (this.status === 'running') {
        this.status = 'paused';
      }
      return;
    }

    if (action === 'resume') {
      if (this.status === 'paused') {
        this.status = 'running';
      }
      return;
    }

    // Gameplay actions have effect only while running with an active piece
    if (this.status !== 'running' || !this.active) {
      return;
    }

    switch (action) {
      case 'moveLeft': {
        const nextPos = { x: this.active.position.x - 1, y: this.active.position.y };
        if (isLegalPlacement(this.board, this.active.type, this.active.rotation, nextPos)) {
          this.active = {
            ...this.active,
            position: nextPos,
            cells: getPieceCells(this.active.type, this.active.rotation, nextPos)
          };
        }
        break;
      }
      case 'moveRight': {
        const nextPos = { x: this.active.position.x + 1, y: this.active.position.y };
        if (isLegalPlacement(this.board, this.active.type, this.active.rotation, nextPos)) {
          this.active = {
            ...this.active,
            position: nextPos,
            cells: getPieceCells(this.active.type, this.active.rotation, nextPos)
          };
        }
        break;
      }
      case 'rotateCW': {
        const result = tryRotatePiece(
          this.board,
          this.active.type,
          this.active.rotation,
          this.active.position,
          'cw'
        );
        this.active = {
          ...this.active,
          rotation: result.rotation,
          position: result.position,
          cells: getPieceCells(this.active.type, result.rotation, result.position)
        };
        break;
      }
      case 'rotateCCW': {
        const result = tryRotatePiece(
          this.board,
          this.active.type,
          this.active.rotation,
          this.active.position,
          'ccw'
        );
        this.active = {
          ...this.active,
          rotation: result.rotation,
          position: result.position,
          cells: getPieceCells(this.active.type, result.rotation, result.position)
        };
        break;
      }
      case 'softDrop': {
        const nextPos = { x: this.active.position.x, y: this.active.position.y + 1 };
        if (isLegalPlacement(this.board, this.active.type, this.active.rotation, nextPos)) {
          this.active = {
            ...this.active,
            position: nextPos,
            cells: getPieceCells(this.active.type, this.active.rotation, nextPos)
          };
        }
        break;
      }
      case 'hardDrop':
      case 'hold':
        // Modern features explicitly deferred under Phase 1 PLAN
        break;
    }
  }

  public advance(elapsedMs: number): void {
    if (typeof elapsedMs !== 'number') {
      throw new TypeError(`advance expects a number, received ${typeof elapsedMs}.`);
    }
    if (!Number.isFinite(elapsedMs) || elapsedMs < 0 || elapsedMs > 1000) {
      throw new RangeError(
        `advance duration must be a finite number between 0 and 1000, received ${elapsedMs}.`
      );
    }

    if (this.status !== 'running') {
      return;
    }

    // Chronological gravity and locking are integrated in T-005
  }

  public getSnapshot(): EngineSnapshot {
    return projectSnapshot({
      status: this.status,
      board: this.board,
      active: this.active,
      ghostCells: [],
      held: this.held,
      next: this.sequence ? this.sequence.peekNext() : null,
      canHold: this.status === 'running' && this.canHold,
      score: this.score,
      lines: this.lines,
      level: this.level
    });
  }

  private startFreshGame(): void {
    this.board = createEmptyBoard();
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.held = null;
    this.canHold = false;
    this.sequence = new PieceSequence(this.random);

    this.spawnNextPiece();
  }

  private spawnNextPiece(): void {
    if (!this.sequence) return;

    const nextType = this.sequence.dequeueNext();
    const spawnDef = SPAWN_DEFINITIONS[nextType];
    const spawnPos = { x: spawnDef.spawnX, y: 0 };

    if (!isLegalPlacement(this.board, nextType, 0, spawnPos)) {
      // Blocked spawn ends the game per G-BOARD
      this.status = 'gameOver';
      this.active = null;
      return;
    }

    this.status = 'running';
    this.active = {
      type: nextType,
      rotation: 0,
      position: spawnPos,
      cells: getPieceCells(nextType, 0, spawnPos)
    };
  }
}

/**
 * Public session factory conforming to S-API.
 */
export function createSession(options: SessionOptions): Session {
  return new GameSession(options);
}
