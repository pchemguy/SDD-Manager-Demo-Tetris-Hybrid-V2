import { describe, it, expect } from 'vitest';
import {
  SPAWN_DEFINITIONS,
  rotateLocalCell,
  getPieceCells,
  rotateOrientation
} from '../../../src/engine/geometry.js';
import type { TetrominoType, RotationState } from '../../../src/engine/types.js';

describe('G-BOARD & G-ROTATE: Piece geometry and orientation transformations', () => {
  const pieces: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

  it('defines spawn definitions matching G-BOARD for all 7 tetrominoes', () => {
    expect(SPAWN_DEFINITIONS.I).toEqual({
      size: 4,
      spawnX: 3,
      cells: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }]
    });

    expect(SPAWN_DEFINITIONS.J).toEqual({
      size: 3,
      spawnX: 3,
      cells: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }]
    });

    expect(SPAWN_DEFINITIONS.L).toEqual({
      size: 3,
      spawnX: 3,
      cells: [{ x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }]
    });

    expect(SPAWN_DEFINITIONS.O).toEqual({
      size: 2,
      spawnX: 4,
      cells: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }]
    });

    expect(SPAWN_DEFINITIONS.S).toEqual({
      size: 3,
      spawnX: 3,
      cells: [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }]
    });

    expect(SPAWN_DEFINITIONS.T).toEqual({
      size: 3,
      spawnX: 3,
      cells: [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }]
    });

    expect(SPAWN_DEFINITIONS.Z).toEqual({
      size: 3,
      spawnX: 3,
      cells: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }]
    });
  });

  it('verifies 4 distinct local cells for every tetromino at orientation 0', () => {
    for (const type of pieces) {
      const def = SPAWN_DEFINITIONS[type];
      expect(def.cells).toHaveLength(4);
      const set = new Set(def.cells.map(c => `${c.x},${c.y}`));
      expect(set.size).toBe(4);
    }
  });

  it('rotates local cells clockwise (N-1-y, x) and counterclockwise (y, N-1-x)', () => {
    // For N = 3, (0, 0) clockwise -> (3 - 1 - 0, 0) = (2, 0)
    expect(rotateLocalCell({ x: 0, y: 0 }, 3, 'cw')).toEqual({ x: 2, y: 0 });
    // (2, 0) clockwise -> (3 - 1 - 0, 2) = (2, 2)
    expect(rotateLocalCell({ x: 2, y: 0 }, 3, 'cw')).toEqual({ x: 2, y: 2 });
    // (2, 0) counterclockwise -> (0, 3 - 1 - 2) = (0, 0)
    expect(rotateLocalCell({ x: 2, y: 0 }, 3, 'ccw')).toEqual({ x: 0, y: 0 });
  });

  it('O piece rotation is a no-op that retains orientation 0 and identical cells', () => {
    expect(rotateOrientation('O', 0, 'cw')).toBe(0);
    expect(rotateOrientation('O', 0, 'ccw')).toBe(0);

    const cells0 = getPieceCells('O', 0, { x: 4, y: 0 });
    const cellsCw = getPieceCells('O', rotateOrientation('O', 0, 'cw'), { x: 4, y: 0 });
    expect(cellsCw).toEqual(cells0);
  });

  it('four quarter-turns in either direction return to initial geometry for all pieces', () => {
    for (const type of pieces) {
      for (const dir of ['cw', 'ccw'] as const) {
        let rot: RotationState = 0;
        for (let step = 0; step < 4; step++) {
          rot = rotateOrientation(type, rot, dir);
        }
        expect(rot).toBe(0);
        const originalCells = getPieceCells(type, 0, { x: 3, y: 0 });
        const cycledCells = getPieceCells(type, rot, { x: 3, y: 0 });
        expect(cycledCells).toEqual(originalCells);
      }
    }
  });

  it('I piece at spawn y=0 occupies board row 1', () => {
    const cells = getPieceCells('I', 0, { x: 3, y: 0 });
    expect(cells).toEqual([
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
      { x: 6, y: 1 }
    ]);
  });
});
