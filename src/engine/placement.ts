/**
 * Collision, legal placement, and in-place rotation candidate testing.
 * Implements G-BOARD and the zero-offset Phase 1 subset of G-ROTATE.
 */

import type { BoardGrid, TetrominoType, RotationState, Point } from './types.js';
import { getPieceCells, rotateOrientation } from './geometry.js';
import { isCellInBounds } from './board.js';

/**
 * Checks whether a piece at a specified orientation and position occupies
 * only empty board cells within the 10x20 boundaries.
 */
export function isLegalPlacement(
  board: BoardGrid,
  type: TetrominoType,
  rotation: RotationState,
  position: Point
): boolean {
  const cells = getPieceCells(type, rotation, position);
  return cells.every(
    cell => isCellInBounds(cell.x, cell.y) && board[cell.y][cell.x] === null
  );
}

export interface RotationResult {
  readonly rotation: RotationState;
  readonly position: Point;
}

/**
 * Attempts to rotate a piece in the specified direction.
 * Phase 1 subset: tests the in-place candidate (0, 0) only.
 * Nonzero kicks are scheduled for Phase 2 per PLAN and TASKS.
 * If candidate is illegal, position and orientation are preserved.
 */
export function tryRotatePiece(
  board: BoardGrid,
  type: TetrominoType,
  currentRotation: RotationState,
  currentPosition: Point,
  direction: 'cw' | 'ccw'
): RotationResult {
  if (type === 'O') {
    return {
      rotation: 0,
      position: currentPosition
    };
  }

  const candidateRotation = rotateOrientation(type, currentRotation, direction);

  // In Phase 1, only the in-place (0, 0) candidate offset is evaluated
  if (isLegalPlacement(board, type, candidateRotation, currentPosition)) {
    return {
      rotation: candidateRotation,
      position: currentPosition
    };
  }

  // If blocked, remain unchanged
  return {
    rotation: currentRotation,
    position: currentPosition
  };
}
