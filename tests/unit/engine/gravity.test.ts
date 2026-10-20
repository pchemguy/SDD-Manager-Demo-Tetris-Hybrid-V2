import { describe, it, expect } from 'vitest';
import { createSession } from '../../../src/engine/session.js';
import { getGravityInterval, isPieceGrounded } from '../../../src/engine/gravity.js';
import { createEmptyBoard, lockPieceToBoard } from '../../../src/engine/board.js';
import { SPAWN_DEFINITIONS, getPieceCells } from '../../../src/engine/geometry.js';
import type { RandomSource } from '../../../src/engine/sequence.js';
import type { ActivePiece } from '../../../src/engine/types.js';

describe('G-TIME: Chronological gravity and full-interval normal locking', () => {
  // Deterministic random producing fixed values
  const dummyRandom: RandomSource = () => 0.1;

  describe('getGravityInterval formula', () => {
    it('calculates G = max(100, 1000 - 75 * (level - 1)) accurately', () => {
      expect(getGravityInterval(1)).toBe(1000);
      expect(getGravityInterval(2)).toBe(925);
      expect(getGravityInterval(3)).toBe(850);
      expect(getGravityInterval(12)).toBe(175);
      expect(getGravityInterval(13)).toBe(100);
      expect(getGravityInterval(14)).toBe(100);
      expect(getGravityInterval(20)).toBe(100);
    });
  });

  describe('isPieceGrounded helper', () => {
    it('identifies airborne vs floor vs support grounding', () => {
      const board = createEmptyBoard();
      const spawnDef = SPAWN_DEFINITIONS['I'];
      const airbornePiece: ActivePiece = {
        type: 'I',
        rotation: 0,
        position: { x: spawnDef.spawnX, y: 0 },
        cells: getPieceCells('I', 0, { x: spawnDef.spawnX, y: 0 })
      };
      expect(isPieceGrounded(board, airbornePiece)).toBe(false);

      // Floor grounding: For I orientation 0, cells occupy row y+1. At y=18, cells are at row 19.
      const floorPiece: ActivePiece = {
        type: 'I',
        rotation: 0,
        position: { x: spawnDef.spawnX, y: 18 },
        cells: getPieceCells('I', 0, { x: spawnDef.spawnX, y: 18 })
      };
      expect(isPieceGrounded(board, floorPiece)).toBe(true);

      // Support grounding: place a locked cell at (3, 10), piece at y=8 (cells at row 9)
      const baseBoard = createEmptyBoard();
      const stackBoard = baseBoard.map((row, y) =>
        row.map((val, x) => (x === 3 && y === 10 ? 'O' : val))
      );
      const supportedPiece: ActivePiece = {
        type: 'I',
        rotation: 0,
        position: { x: 3, y: 8 }, // cells at row 9: (3,9), (4,9), (5,9), (6,9)
        cells: getPieceCells('I', 0, { x: 3, y: 8 })
      };
      // Moving down 1 row would place cell at (3, 10), colliding with locked 'O'
      expect(isPieceGrounded(stackBoard, supportedPiece)).toBe(true);
    });
  });

  describe('Normal gravity steps and grounding', () => {
    it('attempts downward gravity row after elapsed G ms and retains residual time', () => {
      const session = createSession({ random: dummyRandom });
      session.dispatch('start');

      const s0 = session.getSnapshot();
      expect(s0.active!.y).toBe(0);

      // Advance 999 ms: piece should not drop yet at level 1 (G = 1000)
      session.advance(999);
      expect(session.getSnapshot().active!.y).toBe(0);

      // Advance 1 ms (total 1000 ms): piece steps down to y = 1
      session.advance(1);
      expect(session.getSnapshot().active!.y).toBe(1);

      // Advance 1500 ms: 1 gravity step at 1000 ms, 500 ms residual
      session.advance(1000);
      expect(session.getSnapshot().active!.y).toBe(2);

      session.advance(500);
      expect(session.getSnapshot().active!.y).toBe(2);
      session.advance(500);
      expect(session.getSnapshot().active!.y).toBe(3);
    });

    it('falls under gravity until grounded on the floor', () => {
      const session = createSession({ random: dummyRandom });
      session.dispatch('start');

      const initialType = session.getSnapshot().active!.type;
      // Drop piece to floor using repeated softDrop to test grounding at floor
      for (let i = 0; i < 25; i++) {
        session.dispatch('softDrop');
      }

      const landed = session.getSnapshot();
      expect(landed.status).toBe('running');
      expect(landed.active).not.toBeNull();
      expect(landed.active!.type).toBe(initialType);
    });
  });

  describe('Full-interval normal locking and deadline behavior', () => {
    it('remains active at 999 ms of continuous grounding and locks at 1000 ms at level 1', () => {
      const session = createSession({ random: dummyRandom });
      session.dispatch('start');

      const firstPieceType = session.getSnapshot().active!.type;
      const previewType = session.getSnapshot().next!;

      // Drop to floor with softDrop
      for (let i = 0; i < 25; i++) {
        session.dispatch('softDrop');
      }

      const landedPos = session.getSnapshot().active!.y;

      // Grounding lock timer started at 0 when it reached the floor
      // Advance 999 ms: must still be active and not locked
      session.advance(999);
      const s999 = session.getSnapshot();
      expect(s999.status).toBe('running');
      expect(s999.active).not.toBeNull();
      expect(s999.active!.type).toBe(firstPieceType);
      expect(s999.active!.y).toBe(landedPos);
      // Board has no locked cells yet
      expect(s999.board.flat().every(c => c === null)).toBe(true);

      // Advance 1 ms (total 1000 ms): piece locks to board, next piece spawns
      session.advance(1);
      const s1000 = session.getSnapshot();
      expect(s1000.status).toBe('running');
      expect(s1000.active).not.toBeNull();
      expect(s1000.active!.type).toBe(previewType);
      expect(s1000.active!.y).toBe(0);

      // The board now contains the locked cells of the first piece
      const lockedCells = s1000.board.flat().filter(c => c !== null);
      expect(lockedCells).toHaveLength(4);
      expect(lockedCells.every(c => c === firstPieceType)).toBe(true);
    });

    it('subdivided advance calls match single advance across lock boundary (S-DETERMINISM)', () => {
      // Session A: single advance
      const sessionA = createSession({ random: dummyRandom });
      sessionA.dispatch('start');
      for (let i = 0; i < 25; i++) {
        sessionA.dispatch('softDrop');
      }
      sessionA.advance(1000);

      // Session B: subdivided advances (e.g. 10 x 100 ms)
      const sessionB = createSession({ random: dummyRandom });
      sessionB.dispatch('start');
      for (let i = 0; i < 25; i++) {
        sessionB.dispatch('softDrop');
      }
      for (let i = 0; i < 10; i++) {
        sessionB.advance(100);
      }

      expect(sessionA.getSnapshot()).toEqual(sessionB.getSnapshot());
    });
  });

  describe('Grounded movement and airborne reset', () => {
    it('grounded movement at 900 ms preserves the lock deadline without resetting it', () => {
      const session = createSession({ random: dummyRandom });
      session.dispatch('start');

      // Drop to floor
      for (let i = 0; i < 25; i++) {
        session.dispatch('softDrop');
      }

      // Advance 900 ms while grounded
      session.advance(900);

      // Move horizontally (still grounded on floor)
      session.dispatch('moveLeft');

      // Advance 99 ms (total 999 ms grounded): must still be active
      session.advance(99);
      expect(session.getSnapshot().active).not.toBeNull();
      expect(session.getSnapshot().board.flat().every(c => c === null)).toBe(true);

      // Advance 1 ms (reaches 1000 ms grounded): locks!
      session.advance(1);
      expect(session.getSnapshot().board.flat().some(c => c !== null)).toBe(true);
    });

    it('clears the lock timer when moving off support and starts a fresh full interval upon re-landing', () => {
      // We will create a situation where a piece lands on support, moves off into empty air, and falls to floor.
      // Let's use a session where the first piece locks on the floor, and second piece lands on top of it.
      const session = createSession({ random: dummyRandom });
      session.dispatch('start');

      // Drop first piece to floor and lock it
      for (let i = 0; i < 25; i++) {
        session.dispatch('softDrop');
      }
      session.advance(1000); // locked!

      // Second piece spawns.
      const p2Type = session.getSnapshot().active!.type;
      // Soft drop until it is resting on top of the first piece (grounded)
      let droppedSteps = 0;
      while (droppedSteps < 20) {
        const yBefore = session.getSnapshot().active!.y;
        session.dispatch('softDrop');
        if (session.getSnapshot().active!.y === yBefore) {
          // Blocked by stack: piece is resting on stack
          break;
        }
        droppedSteps++;
      }

      // Piece is now grounded on the stack
      // Advance 800 ms of grounding
      session.advance(800);

      // Now move horizontally off the stack so that downward move is legal again (airborne)
      // Try moving left or right until airborne
      const xBefore = session.getSnapshot().active!.x;
      session.dispatch('moveRight');
      if (session.getSnapshot().active!.x === xBefore) {
        session.dispatch('moveLeft');
      }

      // If downward move is legal, piece is airborne:
      // Now drop it to floor
      for (let i = 0; i < 5; i++) {
        session.dispatch('softDrop');
      }

      // It is now grounded on floor. Lock timer should have reset to 0 upon re-landing.
      // Therefore, it should survive 999 ms on floor!
      session.advance(999);
      expect(session.getSnapshot().active!.type).toBe(p2Type);

      // At 1000 ms from re-landing, it locks
      session.advance(1);
      // Now piece 2 is locked (board has 8 locked cells)
      expect(session.getSnapshot().board.flat().filter(c => c !== null)).toHaveLength(8);
    });

    it('rotation while grounded preserves lock deadline', () => {
      const session = createSession({ random: dummyRandom });
      session.dispatch('start');

      // Drop to floor
      for (let i = 0; i < 25; i++) {
        session.dispatch('softDrop');
      }

      session.advance(500);

      // Rotate CW
      session.dispatch('rotateCW');

      // Advance 499 ms (total 999 ms): still active
      session.advance(499);
      expect(session.getSnapshot().board.flat().every(c => c === null)).toBe(true);

      // Advance 1 ms (total 1000 ms): locks
      session.advance(1);
      expect(session.getSnapshot().board.flat().some(c => c !== null)).toBe(true);
    });
  });

  describe('Failed downward attempts and remaining-time consumption', () => {
    it('failed downward attempts do not lock immediately or reset timing', () => {
      const session = createSession({ random: dummyRandom });
      session.dispatch('start');

      // Drop to floor
      for (let i = 0; i < 25; i++) {
        session.dispatch('softDrop');
      }

      // While grounded, attempt softDrop (failed downward move)
      session.dispatch('softDrop');
      expect(session.getSnapshot().active).not.toBeNull();
      expect(session.getSnapshot().board.flat().every(c => c === null)).toBe(true);

      // Lock deadline is still 1000 ms from landing
      session.advance(999);
      expect(session.getSnapshot().active).not.toBeNull();
      session.advance(1);
      expect(session.getSnapshot().board.flat().some(c => c !== null)).toBe(true);
    });

    it('remaining time in the same advance is consumed by the new active piece', () => {
      const session = createSession({ random: dummyRandom });
      session.dispatch('start');

      // Drop to floor
      for (let i = 0; i < 25; i++) {
        session.dispatch('softDrop');
      }

      // Advance 800 ms while grounded (200 ms remaining until lock deadline)
      session.advance(800);

      // Advance 500 ms:
      // In 200 ms, piece locks and piece 2 spawns at y=0.
      // Remaining 300 ms is consumed by piece 2 (gravityAccumulator = 300 ms).
      session.advance(500);

      const s1 = session.getSnapshot();
      expect(s1.active!.y).toBe(0);

      // Another 700 ms advances piece 2 by 1 gravity step (300 + 700 = 1000 ms)
      session.advance(700);
      expect(session.getSnapshot().active!.y).toBe(1);
    });
  });

  describe('Timed blocked spawn and game over', () => {
    it('ends game on blocked spawn after lock, preserving locked cells and totals', () => {
      const session = createSession({ random: dummyRandom });
      session.dispatch('start');

      // Lock pieces repeatedly without clearing rows until stack reaches the spawn area
      for (let p = 0; p < 20; p++) {
        const snap = session.getSnapshot();
        if (snap.status === 'gameOver') {
          break;
        }
        // Soft drop to stack
        for (let i = 0; i < 25; i++) {
          session.dispatch('softDrop');
        }
        // Advance 1000 ms to lock piece and attempt spawn
        session.advance(1000);
      }

      const finalSnap = session.getSnapshot();
      expect(finalSnap.status).toBe('gameOver');
      expect(finalSnap.active).toBeNull();
      expect(finalSnap.board.flat().some(c => c !== null)).toBe(true);
    });

    it('fails atomically if random source throws during timed spawn, preserving locked board', () => {
      let callCount = 0;
      const failingRandom: RandomSource = () => {
        callCount++;
        // First bag is 6 draws. Refill will be triggered when queue drops below 2.
        if (callCount > 6) {
          throw new Error('Random source exhausted');
        }
        return 0.2;
      };

      const session = createSession({ random: failingRandom });
      session.dispatch('start'); // consumes 1 piece from initial bag of 7 (queue has 6 left)

      // Lock 4 more pieces so queue drops below 2 on the next lock/spawn
      for (let i = 0; i < 4; i++) {
        for (let d = 0; d < 25; d++) {
          session.dispatch('softDrop');
        }
        session.advance(1000);
      }

      // The 5th piece is active. On the next lock, piece 6 is shifted and queue drops below 2, triggering refill.
      // Drop to floor
      for (let d = 0; d < 25; d++) {
        session.dispatch('softDrop');
      }

      // Next lock and spawn will require bag refill, causing random() to throw
      expect(() => {
        session.advance(1000);
      }).toThrow('Random source exhausted');

      // Session snapshot is still coherent: locked piece is preserved on board, active is null
      const snap = session.getSnapshot();
      expect(snap.board.flat().some(c => c !== null)).toBe(true);
      expect(snap.active).toBeNull();
    });
  });

  describe('Lifecycle and input validation', () => {
    it('does not accumulate gravity or lock time while paused', () => {
      const session = createSession({ random: dummyRandom });
      session.dispatch('start');

      session.dispatch('pause');
      session.advance(1000);

      session.dispatch('resume');
      expect(session.getSnapshot().active!.y).toBe(0);

      // Advance 1000 ms to take the gravity step
      session.advance(1000);
      expect(session.getSnapshot().active!.y).toBe(1);
    });
  });
});
