/**
 * Seven-piece bag generation, deterministic random helpers, and queue/preview supply.
 * Implements G-SEQUENCE requirements.
 */

import type { TetrominoType, RandomSource } from './types.js';
export type { RandomSource } from './types.js';

export const CANONICAL_BAG: readonly TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

/**
 * Shuffles the canonical bag using descending Fisher-Yates:
 * for i = 6 down to 1:
 *   u = random()
 *   swap i and floor(u * (i + 1))
 * Consumes exactly 6 random draws per bag.
 * Fails atomically without partial updates if the random source throws or returns invalid values.
 */
export function generateShuffledBag(random: RandomSource): TetrominoType[] {
  const bag = [...CANONICAL_BAG];

  for (let i = 6; i >= 1; i--) {
    const u = random();
    if (typeof u !== 'number' || Number.isNaN(u) || u < 0 || u >= 1) {
      throw new Error(`Invalid random value: ${u}. Must be a finite number in [0, 1).`);
    }
    const j = Math.floor(u * (i + 1));
    const temp = bag[i];
    bag[i] = bag[j];
    bag[j] = temp;
  }

  return bag;
}

/**
 * Manages the piece sequence queue and deterministic preview supply.
 * Guarantees that at least 2 pieces exist in the queue so that an active piece
 * can be drawn while maintaining a non-consuming next-piece preview.
 */
export class PieceSequence {
  private queue: TetrominoType[] = [];
  private readonly randomSource: RandomSource;

  constructor(randomSource: RandomSource) {
    this.randomSource = randomSource;
    this.ensureQueueCapacity();
  }

  /**
   * Refills the queue with full 7-piece shuffled bags whenever queue length is < 2.
   * If random generation fails, existing queue state remains uncorrupted.
   */
  private ensureQueueCapacity(): void {
    while (this.queue.length < 2) {
      const nextBag = generateShuffledBag(this.randomSource);
      this.queue.push(...nextBag);
    }
  }

  /**
   * Returns the next queued piece without consuming any draws or removing it.
   */
  public peekNext(): TetrominoType | null {
    return this.queue.length > 0 ? this.queue[0] : null;
  }

  /**
   * Consumes and returns the next active piece from the sequence, refilling if needed.
   */
  public dequeueNext(): TetrominoType {
    this.ensureQueueCapacity();
    const next = this.queue.shift()!;
    this.ensureQueueCapacity();
    return next;
  }

  /**
   * Returns the current number of pieces in the queue.
   */
  public getQueueLength(): number {
    return this.queue.length;
  }
}
