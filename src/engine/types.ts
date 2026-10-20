/**
 * Core engine coordinate, piece, board, and session types.
 * Matches S-API and S-DATA specifications.
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

export type SessionStatus = 'ready' | 'running' | 'paused' | 'gameOver';

export interface ActivePieceSnapshot {
  readonly type: TetrominoType;
  readonly orientation: RotationState;
  readonly x: number;
  readonly y: number;
  readonly cells: readonly [number, number][];
}

export interface EngineSnapshot {
  readonly status: SessionStatus;
  readonly board: CellValue[][];
  readonly active: ActivePieceSnapshot | null;
  readonly ghostCells: readonly [number, number][];
  readonly held: TetrominoType | null;
  readonly next: TetrominoType | null;
  readonly canHold: boolean;
  readonly score: number;
  readonly lines: number;
  readonly level: number;
}

export type ActionName =
  | 'start'
  | 'restart'
  | 'pause'
  | 'resume'
  | 'moveLeft'
  | 'moveRight'
  | 'rotateCW'
  | 'rotateCCW'
  | 'softDrop'
  | 'hardDrop'
  | 'hold';

export interface Session {
  dispatch(action: string): void;
  advance(elapsedMs: number): void;
  getSnapshot(): EngineSnapshot;
}

export type RandomSource = () => number;

export interface SessionOptions {
  readonly random: RandomSource;
}
