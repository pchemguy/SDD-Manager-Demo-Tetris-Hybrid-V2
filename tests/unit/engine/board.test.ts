import { describe, it, expect } from 'vitest';
import { createEmptyBoard, lockPieceToBoard } from '../../../src/engine/board.js';
import { getPieceCells } from '../../../src/engine/geometry.js';
import type { ActivePiece } from '../../../src/engine/types.js';

describe('G-BOARD: Board creation and non-overwriting locking', () => {
  it('creates an empty 10x20 board with all null cells', () => {
    const board = createEmptyBoard();
    expect(board).toHaveLength(20);
    for (const row of board) {
      expect(row).toHaveLength(10);
      expect(row.every(c => c === null)).toBe(true);
    }
  });

  it('locks piece cells to board immutably and preserves un-touched cells', () => {
    const board = createEmptyBoard();
    const piece: ActivePiece = {
      type: 'T',
      rotation: 0,
      position: { x: 3, y: 18 },
      cells: getPieceCells('T', 0, { x: 3, y: 18 })
    };

    const newBoard = lockPieceToBoard(board, piece);

    // Original board remains empty
    expect(board[18][4]).toBeNull();

    // New board has T locked at piece cells
    for (const pt of piece.cells) {
      expect(newBoard[pt.y][pt.x]).toBe('T');
    }

    // Other cells remain null
    expect(newBoard[0][0]).toBeNull();
  });

  it('throws an invariant error if attempting to overwrite an already locked cell', () => {
    const board = createEmptyBoard();
    const piece1: ActivePiece = {
      type: 'O',
      rotation: 0,
      position: { x: 4, y: 18 },
      cells: getPieceCells('O', 0, { x: 4, y: 18 })
    };

    const boardWithO = lockPieceToBoard(board, piece1);

    // Attempting to lock another piece overlapping O's cells must throw
    const piece2: ActivePiece = {
      type: 'I',
      rotation: 0,
      position: { x: 3, y: 17 }, // I at y=17 occupies y=18 at x=3,4,5,6 -> overlaps (4, 18)
      cells: getPieceCells('I', 0, { x: 3, y: 17 })
    };

    expect(() => lockPieceToBoard(boardWithO, piece2)).toThrow(/cannot overwrite/i);
  });

  it('throws an error if attempting to lock a piece outside board bounds', () => {
    const board = createEmptyBoard();
    const outOfBoundsPiece: ActivePiece = {
      type: 'I',
      rotation: 0,
      position: { x: 8, y: 0 },
      cells: getPieceCells('I', 0, { x: 8, y: 0 }) // cells at 8, 9, 10, 11
    };

    expect(() => lockPieceToBoard(board, outOfBoundsPiece)).toThrow(/out of bounds/i);
  });
});
