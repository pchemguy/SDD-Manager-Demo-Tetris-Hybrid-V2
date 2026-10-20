/**
 * Detached read-only snapshot projection.
 * Implements S-DATA isolation requirements.
 */

import type {
  EngineSnapshot,
  SessionStatus,
  BoardGrid,
  ActivePiece,
  TetrominoType
} from './types.js';

export interface SnapshotInput {
  readonly status: SessionStatus;
  readonly board: BoardGrid;
  readonly active: ActivePiece | null;
  readonly ghostCells?: readonly [number, number][];
  readonly held: TetrominoType | null;
  readonly next: TetrominoType | null;
  readonly canHold: boolean;
  readonly score: number;
  readonly lines: number;
  readonly level: number;
}

/**
 * Creates an immutable, detached snapshot of the engine state.
 * Modifying any returned nested array/object has zero side-effects on internal engine state.
 */
export function projectSnapshot(input: SnapshotInput): EngineSnapshot {
  return {
    status: input.status,
    board: input.board.map(row => [...row]),
    active: input.active
      ? {
          type: input.active.type,
          orientation: input.active.rotation,
          x: input.active.position.x,
          y: input.active.position.y,
          cells: input.active.cells.map(c => [c.x, c.y] as [number, number])
        }
      : null,
    ghostCells: input.ghostCells ? input.ghostCells.map(([x, y]) => [x, y]) : [],
    held: input.held,
    next: input.next,
    canHold: input.canHold,
    score: input.score,
    lines: input.lines,
    level: input.level
  };
}
