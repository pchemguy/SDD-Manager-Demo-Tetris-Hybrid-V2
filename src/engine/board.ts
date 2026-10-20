/**
 * Board creation, cell inspection, and legal non-overwriting locking transformations.
 * Matches G-BOARD requirements.
 */

import { BOARD_WIDTH, BOARD_HEIGHT, type BoardGrid, type CellValue, type ActivePiece } from './types.js';

/**
 * Creates a standard 10x20 empty board grid filled with null.
 */
export function createEmptyBoard(): BoardGrid {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, (): CellValue => null)
  );
}

/**
 * Checks if a board coordinate is within the 10x20 playable area.
 */
export function isCellInBounds(x: number, y: number): boolean {
  return x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT;
}

/**
 * Immutably locks an active piece into the board grid.
 * Throws an error if any cell is out of bounds or overwrites an existing locked cell.
 */
export function lockPieceToBoard(board: BoardGrid, piece: ActivePiece): BoardGrid {
  // Validate that all cells are in-bounds and not overwriting existing locked cells
  for (const cell of piece.cells) {
    if (!isCellInBounds(cell.x, cell.y)) {
      throw new Error(`Cannot lock piece: cell (${cell.x}, ${cell.y}) is out of bounds.`);
    }
    if (board[cell.y][cell.x] !== null) {
      throw new Error(
        `Invariant violation: Cannot overwrite already locked cell at (${cell.x}, ${cell.y}).`
      );
    }
  }

  // Construct new board rows
  return board.map((row, y) =>
    row.map((val, x) => {
      const isPieceCell = piece.cells.some(c => c.x === x && c.y === y);
      return isPieceCell ? piece.type : val;
    })
  );
}
