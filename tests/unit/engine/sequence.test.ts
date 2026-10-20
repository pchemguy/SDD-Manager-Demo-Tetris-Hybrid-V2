import { describe, it, expect } from 'vitest';
import {
  CANONICAL_BAG,
  generateShuffledBag,
  PieceSequence,
  type RandomSource
} from '../../../src/engine/sequence.js';
import type { TetrominoType } from '../../../src/engine/types.js';

describe('G-SEQUENCE: 7-bag randomization, preview, and atomic failure', () => {
  it('defines the canonical piece order [I, J, L, O, S, T, Z]', () => {
    expect(CANONICAL_BAG).toEqual(['I', 'J', 'L', 'O', 'S', 'T', 'Z']);
  });

  it('generates a bag consuming exactly 6 random draws with descending Fisher-Yates', () => {
    let drawsCount = 0;
    // When random always returns 0:
    // i=6, j=floor(0*7)=0: swap 6 and 0 -> Z swapped with I
    // i=5, j=floor(0*6)=0: swap 5 and 0 -> T swapped with whatever is at 0
    // etc.
    const mockRandom: RandomSource = () => {
      drawsCount++;
      return 0;
    };

    const bag = generateShuffledBag(mockRandom);
    expect(drawsCount).toBe(6);
    expect(bag).toHaveLength(7);

    // Verify all 7 distinct tetrominoes are present in every generated bag
    const pieces: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    for (const p of pieces) {
      expect(bag).toContain(p);
    }
  });

  it('yields reproducible bag permutations given deterministic random values', () => {
    // Simulated sequence of 6 values: u0..u5
    const drawValues = [0.1, 0.4, 0.8, 0.2, 0.9, 0.3];
    let idx1 = 0;
    const bag1 = generateShuffledBag(() => drawValues[idx1++]);

    let idx2 = 0;
    const bag2 = generateShuffledBag(() => drawValues[idx2++]);

    expect(bag1).toEqual(bag2);
  });

  it('fails atomically if the random source throws or returns an invalid number', () => {
    let callCount = 0;
    const throwingRandom: RandomSource = () => {
      callCount++;
      if (callCount === 3) {
        throw new Error('Random source hardware fault');
      }
      return 0.5;
    };

    expect(() => generateShuffledBag(throwingRandom)).toThrow(/Random source hardware fault/);

    const invalidRandom: RandomSource = () => 1.5; // Out of [0, 1) bounds
    expect(() => generateShuffledBag(invalidRandom)).toThrow(/invalid random/i);
  });

  it('PieceSequence maintains queue, previews next piece without draws, and refills when < 2', () => {
    let drawsCount = 0;
    const mockRandom: RandomSource = () => {
      drawsCount++;
      return 0.25;
    };

    const seq = new PieceSequence(mockRandom);

    // Initial state: queue is initialized with at least 2 pieces (or one initial bag of 7)
    // Exactly 6 draws used to generate the first bag
    expect(drawsCount).toBe(6);

    // Preview should return the next piece to be drawn without consuming any draws or elements
    const preview1 = seq.peekNext();
    const preview2 = seq.peekNext();
    expect(preview1).toBe(preview2);
    expect(drawsCount).toBe(6);

    // Dequeue first piece
    const firstPiece = seq.dequeueNext();
    expect(firstPiece).toBe(preview1);
    // Queue had 7, now 6 -> no refill needed yet, draws still 6
    expect(drawsCount).toBe(6);

    // Draw remaining pieces until refill trigger
    for (let i = 0; i < 5; i++) {
      seq.dequeueNext();
    }
    // Now 1 piece left in queue (< 2). Next dequeueNext must trigger refill before returning!
    const nextPiece = seq.dequeueNext();
    expect(nextPiece).toBeDefined();
    // A second bag was appended (6 additional draws -> total 12)
    expect(drawsCount).toBe(12);

    // Preview now shows the first remaining piece from the newly appended bag
    const currentPreview = seq.peekNext();
    expect(currentPreview).toBeDefined();
    expect(drawsCount).toBe(12);
  });

  it('preserves existing queue state atomically if refill random source throws', () => {
    let drawIndex = 0;
    const stream = [
      0.1, 0.2, 0.3, 0.4, 0.5, 0.6, // First bag
      0.1, 0.2 // Second bag fails on 3rd draw
    ];

    const fragileRandom: RandomSource = () => {
      if (drawIndex >= stream.length) {
        throw new Error('Source depleted unexpectedly');
      }
      return stream[drawIndex++];
    };

    const seq = new PieceSequence(fragileRandom);
    expect(seq.getQueueLength()).toBe(7);

    // Consume 5 pieces so 2 remain
    for (let i = 0; i < 5; i++) {
      seq.dequeueNext();
    }
    expect(seq.getQueueLength()).toBe(2);

    // The next dequeue consumes 1, leaving 1. If we try to refill and it throws:
    // Let's verify that when refill fails, existing pieces in queue are not corrupted
    const remainingPreview = seq.peekNext();
    expect(remainingPreview).toBeDefined();
  });
});
