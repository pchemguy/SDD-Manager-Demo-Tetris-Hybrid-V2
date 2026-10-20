/**
 * Core engine coordinate, piece, board, and session types.
 * Pure data types only: no DOM, Node, or browser dependencies.
 */

export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export type RotationState = 0 | 1 | 2 | 3;

export interface Point {
  readonly x: number;
  readonly y: number;
}

export type CellValue = TetrominoType | null;

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export type BoardGrid = readonly (readonly CellValue[])[];

export interface ActivePiece {
  readonly type: TetrominoType;
  readonly rotation: RotationState;
  readonly position: Point;
  readonly cells: readonly Point[];
}

export type SessionStatus = 'ready' | 'running' | 'paused' | 'game_over';

export interface EngineSnapshot {
  readonly status: SessionStatus;
  readonly score: number;
  readonly lines: number;
  readonly level: number;
  readonly gravityIntervalMs: number;
  readonly activePiece: ActivePiece | null;
  readonly nextPiece: TetrominoType | null;
  readonly heldPiece: TetrominoType | null;
  readonly canHold: boolean;
  readonly ghostCells: readonly Point[];
  readonly board: BoardGrid;
}

export type PlayerAction =
  | 'move_left'
  | 'move_right'
  | 'rotate_cw'
  | 'rotate_ccw'
  | 'soft_drop'
  | 'hard_drop'
  | 'hold'
  | 'start'
  | 'pause'
  | 'resume'
  | 'restart';

export interface GameEngine {
  getSnapshot(): EngineSnapshot;
  dispatch(action: PlayerAction): boolean;
  tick(elapsedMs: number): boolean;
}
