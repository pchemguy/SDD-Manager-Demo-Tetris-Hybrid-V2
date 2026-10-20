/**
 * Gravity timing formulas and piece grounding detection.
 * Implements G-TIME requirements.
 */

import type { BoardGrid, ActivePiece } from './types.js';
import { isLegalPlacement } from './placement.js';

/**
 * Calculates the gravity interval G in milliseconds for a given level:
 * G = max(100, 1000 - 75 * (level - 1))
 */
export function getGravityInterval(level: number): number {
  return Math.max(100, 1000 - 75 * (level - 1));
}

/**
 * Determines whether an active piece is grounded.
 * A piece is grounded when a one-row downward move is illegal (blocked by floor or locked cells).
 */
export function isPieceGrounded(board: BoardGrid, active: ActivePiece): boolean {
  const belowPos = { x: active.position.x, y: active.position.y + 1 };
  return !isLegalPlacement(board, active.type, active.rotation, belowPos);
}
