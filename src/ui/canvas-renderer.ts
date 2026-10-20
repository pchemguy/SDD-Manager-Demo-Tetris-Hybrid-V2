/**
 * Canvas renderer for Tetris playfield.
 * Draws 10x20 grid, locked cells, active piece, and ghost cells using snapshot data.
 * Conforms to B-VIEW requirements: supplied geometry only, no state mutation or placement calculation.
 */

import type { EngineSnapshot, TetrominoType } from '../engine/types.js';

export const TETROMINO_COLORS: Readonly<Record<TetrominoType, string>> = {
  I: '#06b6d4', // Cyan
  J: '#3b82f6', // Blue
  L: '#f97316', // Orange
  O: '#eab308', // Yellow
  S: '#22c55e', // Green
  T: '#a855f7', // Purple
  Z: '#ef4444'  // Red
};

export interface CanvasRendererOptions {
  readonly cellSize?: number;
  readonly backgroundColor?: string;
  readonly gridLineColor?: string;
}

export class CanvasRenderer {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly cellSize: number;
  private readonly backgroundColor: string;
  private readonly gridLineColor: string;

  constructor(canvas: HTMLCanvasElement, options: CanvasRendererOptions = {}) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D context not available.');
    }
    this.ctx = ctx;
    this.cellSize = options.cellSize ?? 30;
    this.backgroundColor = options.backgroundColor ?? '#09090b';
    this.gridLineColor = options.gridLineColor ?? '#18181b';
  }

  public render(snapshot: EngineSnapshot): void {
    const { ctx, canvas, cellSize } = this;

    // Clear background
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw gridlines
    ctx.strokeStyle = this.gridLineColor;
    ctx.lineWidth = 1;

    for (let x = 0; x <= canvas.width; x += cellSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += cellSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw locked board cells
    for (let y = 0; y < snapshot.board.length; y++) {
      const row = snapshot.board[y];
      for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        if (cell !== null) {
          this.drawCell(x, y, TETROMINO_COLORS[cell]);
        }
      }
    }

    // Draw ghost cells (if present)
    if (snapshot.ghostCells && snapshot.ghostCells.length > 0) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      for (const [gx, gy] of snapshot.ghostCells) {
        ctx.strokeRect(gx * cellSize + 2, gy * cellSize + 2, cellSize - 4, cellSize - 4);
      }
    }

    // Draw active piece cells
    if (snapshot.active) {
      const color = TETROMINO_COLORS[snapshot.active.type];
      for (const [ax, ay] of snapshot.active.cells) {
        this.drawCell(ax, ay, color);
      }
    }
  }

  private drawCell(x: number, y: number, color: string): void {
    const { ctx, cellSize } = this;
    const px = x * cellSize;
    const py = y * cellSize;

    ctx.fillStyle = color;
    ctx.fillRect(px + 1, py + 1, cellSize - 2, cellSize - 2);

    // Top and left bevel highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(px + 1, py + 1, cellSize - 2, 2);
    ctx.fillRect(px + 1, py + 1, 2, cellSize - 2);

    // Bottom and right bevel shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(px + 1, py + cellSize - 3, cellSize - 2, 2);
    ctx.fillRect(px + cellSize - 3, py + 1, 2, cellSize - 2);
  }
}
