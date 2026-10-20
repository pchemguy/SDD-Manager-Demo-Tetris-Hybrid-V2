import { describe, it, expect } from 'vitest';
import { isLegalPlacement, tryRotatePiece } from '../../../src/engine/placement.js';
import { createEmptyBoard } from '../../../src/engine/board.js';
import type { BoardGrid, TetrominoType } from '../../../src/engine/types.js';

describe('G-BOARD & G-ROTATE: Legal board placement and in-place rotation', () => {
  it('allows spawn placement on an empty board for all pieces', () => {
    const board = createEmptyBoard();
    const spawnXMap: Record<TetrominoType, number> = {
      I: 3, J: 3, L: 3, O: 4, S: 3, T: 3, Z: 3
    };

    for (const [type, spawnX] of Object.entries(spawnXMap)) {
      const legal = isLegalPlacement(board, type as TetrominoType, 0, { x: spawnX, y: 0 });
      expect(legal).toBe(true);
    }
  });

  it('rejects placement exceeding board horizontal boundaries', () => {
    const board = createEmptyBoard();
    // I piece extends 4 columns at orientation 0
    expect(isLegalPlacement(board, 'I', 0, { x: -1, y: 0 })).toBe(false);
    expect(isLegalPlacement(board, 'I', 0, { x: 7, y: 0 })).toBe(false); // cells at 7, 8, 9, 10
    expect(isLegalPlacement(board, 'I', 0, { x: 6, y: 0 })).toBe(true);  // cells at 6, 7, 8, 9
  });

  it('rejects placement exceeding board vertical boundaries (floor and negative y)', () => {
    const board = createEmptyBoard();
    // Board height is 20 (y: 0..19)
    // I piece at orientation 0 occupies y = origin.y + 1
    expect(isLegalPlacement(board, 'I', 0, { x: 3, y: -2 })).toBe(false);
    expect(isLegalPlacement(board, 'I', 0, { x: 3, y: 18 })).toBe(true);  // cells at row 19
    expect(isLegalPlacement(board, 'I', 0, { x: 3, y: 19 })).toBe(false); // cells at row 20
  });

  it('rejects placement that collides with non-empty locked board cells', () => {
    // Create board with locked cell at (3, 1)
    const board = createEmptyBoard().map((row, y) =>
      row.map((cell, x) => (x === 3 && y === 1 ? ('J' as const) : cell))
    );

    // I piece spawns with a cell at (3, 1)
    expect(isLegalPlacement(board, 'I', 0, { x: 3, y: 0 })).toBe(false);
  });

  it('tryRotatePiece accepts in-place rotation when unblocked (P1 zero-offset)', () => {
    const board = createEmptyBoard();
    // T piece at center
    const rotated = tryRotatePiece(board, 'T', 0, { x: 3, y: 5 }, 'cw');
    expect(rotated).toEqual({
      rotation: 1,
      position: { x: 3, y: 5 }
    });
  });

  it('tryRotatePiece leaves position and rotation unchanged when candidate is blocked', () => {
    // Put locked blocks next to T piece so rotation 1 collides
    const board = createEmptyBoard().map((row, y) =>
      row.map((cell, x) => (x === 4 && y === 4 ? ('O' as const) : cell))
    );

    // Rotating T clockwise from orientation 0 at (3, 4) would place a cell at (4, 4), which is blocked
    const result = tryRotatePiece(board, 'T', 0, { x: 3, y: 4 }, 'cw');
    expect(result).toEqual({
      rotation: 0,
      position: { x: 3, y: 4 }
    });
  });
});
