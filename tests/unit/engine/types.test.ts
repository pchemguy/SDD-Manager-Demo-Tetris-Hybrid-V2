import { describe, it, expect } from 'vitest';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../../../src/engine/types.js';

describe('Engine types and foundation constants', () => {
  it('defines the standard 10x20 board dimensions', () => {
    expect(BOARD_WIDTH).toBe(10);
    expect(BOARD_HEIGHT).toBe(20);
  });
});
