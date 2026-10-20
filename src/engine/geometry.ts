/**
 * Piece geometry and orientation transformations matching G-BOARD and G-ROTATE.
 * Pure mathematical coordinates: no browser or DOM dependencies.
 */

import type { TetrominoType, RotationState, Point } from './types.js';

export interface PieceDefinition {
  readonly size: number;
  readonly spawnX: number;
  readonly cells: readonly Point[];
}

export const SPAWN_DEFINITIONS: Readonly<Record<TetrominoType, PieceDefinition>> = {
  I: {
    size: 4,
    spawnX: 3,
    cells: [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 }
    ]
  },
  J: {
    size: 3,
    spawnX: 3,
    cells: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 }
    ]
  },
  L: {
    size: 3,
    spawnX: 3,
    cells: [
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 }
    ]
  },
  O: {
    size: 2,
    spawnX: 4,
    cells: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 }
    ]
  },
  S: {
    size: 3,
    spawnX: 3,
    cells: [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 }
    ]
  },
  T: {
    size: 3,
    spawnX: 3,
    cells: [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 }
    ]
  },
  Z: {
    size: 3,
    spawnX: 3,
    cells: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 }
    ]
  }
};

/**
 * Rotates a local coordinate inside an N×N bounding box.
 * Clockwise: (x, y) -> (N - 1 - y, x)
 * Counterclockwise: (x, y) -> (y, N - 1 - x)
 */
export function rotateLocalCell(cell: Point, size: number, direction: 'cw' | 'ccw'): Point {
  if (direction === 'cw') {
    return {
      x: size - 1 - cell.y,
      y: cell.x
    };
  }
  return {
    x: cell.y,
    y: size - 1 - cell.x
  };
}

/**
 * Calculates the next orientation index for a tetromino.
 * O piece is a permanent no-op (orientation 0).
 */
export function rotateOrientation(
  type: TetrominoType,
  current: RotationState,
  direction: 'cw' | 'ccw'
): RotationState {
  if (type === 'O') {
    return 0;
  }
  if (direction === 'cw') {
    return ((current + 1) % 4) as RotationState;
  }
  return ((current + 3) % 4) as RotationState;
}

/**
 * Returns the local cells for a tetromino at a specific orientation (0..3).
 */
export function getLocalCells(type: TetrominoType, rotation: RotationState): readonly Point[] {
  const def = SPAWN_DEFINITIONS[type];
  if (type === 'O' || rotation === 0) {
    return def.cells;
  }

  let cells = def.cells;
  for (let step = 0; step < rotation; step++) {
    cells = cells.map(c => rotateLocalCell(c, def.size, 'cw'));
  }
  return cells;
}

/**
 * Returns the absolute board coordinates for a tetromino placed at position.
 */
export function getPieceCells(
  type: TetrominoType,
  rotation: RotationState,
  position: Point
): readonly Point[] {
  const localCells = getLocalCells(type, rotation);
  return localCells.map(c => ({
    x: position.x + c.x,
    y: position.y + c.y
  }));
}
