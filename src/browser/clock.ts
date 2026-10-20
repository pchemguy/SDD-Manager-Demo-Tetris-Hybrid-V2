/**
 * Animation frame clock delivering monotonic elapsed milliseconds.
 * Conforms to B-TIME requirements: at most one loop, elapsed delivery in [0, 1000] ms.
 */

export type TickCallback = (elapsedMs: number) => void;

export class AnimationClock {
  private rafId: number | null = null;
  private lastTimestamp: number | null = null;
  private readonly onTick: TickCallback;

  constructor(onTick: TickCallback) {
    this.onTick = onTick;
  }

  public start(): void {
    if (this.rafId !== null) {
      return; // Already running
    }
    this.lastTimestamp = null;
    this.scheduleFrame();
  }

  public stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.lastTimestamp = null;
  }

  public isRunning(): boolean {
    return this.rafId !== null;
  }

  private scheduleFrame(): void {
    this.rafId = requestAnimationFrame((timestamp) => {
      this.rafId = null;
      if (this.lastTimestamp === null) {
        this.lastTimestamp = timestamp;
        this.scheduleFrame();
        return;
      }

      const rawElapsed = timestamp - this.lastTimestamp;
      this.lastTimestamp = timestamp;

      // Elapsed time is clamped to maximum valid single span [0, 1000] ms per B-TIME
      const elapsedMs = Math.min(1000, Math.max(0, rawElapsed));
      if (elapsedMs > 0) {
        this.onTick(elapsedMs);
      }

      this.scheduleFrame();
    });
  }
}
