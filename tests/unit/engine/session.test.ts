import { describe, it, expect } from 'vitest';
import { createSession } from '../../../src/engine/session.js';
import type { RandomSource } from '../../../src/engine/sequence.js';

describe('S-API & S-DATA: Session lifecycle, actions, and detached snapshots', () => {
  const dummyRandom: RandomSource = () => 0.1;

  it('rejects invalid or missing random dependency at creation', () => {
    // @ts-expect-error test invalid creation
    expect(() => createSession()).toThrow(TypeError);
    // @ts-expect-error test invalid creation
    expect(() => createSession({})).toThrow(TypeError);
    // @ts-expect-error test invalid creation
    expect(() => createSession({ random: 'not-a-func' })).toThrow(TypeError);
  });

  it('initializes in ready state without drawing randomness before start', () => {
    let drawsCount = 0;
    const trackingRandom: RandomSource = () => {
      drawsCount++;
      return 0.1;
    };

    const session = createSession({ random: trackingRandom });
    expect(drawsCount).toBe(0);

    const snapshot = session.getSnapshot();
    expect(snapshot.status).toBe('ready');
    expect(snapshot.board).toHaveLength(20);
    expect(snapshot.active).toBeNull();
    expect(snapshot.ghostCells).toEqual([]);
    expect(snapshot.held).toBeNull();
    expect(snapshot.next).toBeNull();
    expect(snapshot.canHold).toBe(false);
    expect(snapshot.score).toBe(0);
    expect(snapshot.lines).toBe(0);
    expect(snapshot.level).toBe(1);
    expect(drawsCount).toBe(0);
  });

  it('rejects invalid actions with TypeError (non-string) and RangeError (unknown string)', () => {
    const session = createSession({ random: dummyRandom });
    // @ts-expect-error test non-string action
    expect(() => session.dispatch(123)).toThrow(TypeError);
    // @ts-expect-error test non-string action
    expect(() => session.dispatch(null)).toThrow(TypeError);

    expect(() => session.dispatch('unknownAction')).toThrow(RangeError);
    expect(() => session.dispatch('START')).toThrow(RangeError); // case sensitive
  });

  it('validates advance duration: rejects non-numbers, non-finite, negative, or >1000', () => {
    const session = createSession({ random: dummyRandom });
    // @ts-expect-error test invalid type
    expect(() => session.advance('50')).toThrow(TypeError);
    expect(() => session.advance(NaN)).toThrow(RangeError);
    expect(() => session.advance(Infinity)).toThrow(RangeError);
    expect(() => session.advance(-1)).toThrow(RangeError);
    expect(() => session.advance(1001)).toThrow(RangeError);

    // Valid range [0, 1000] succeeds
    expect(session.advance(0)).toBeUndefined();
    expect(session.advance(500)).toBeUndefined();
    expect(session.advance(1000)).toBeUndefined();
  });

  it('starts game from ready state and spawns first active piece with one preview', () => {
    const session = createSession({ random: dummyRandom });
    session.dispatch('start');

    const snapshot = session.getSnapshot();
    expect(snapshot.status).toBe('running');
    expect(snapshot.active).not.toBeNull();
    expect(snapshot.active?.orientation).toBe(0);
    expect(snapshot.active?.y).toBe(0);
    expect(snapshot.active?.cells).toHaveLength(4);
    expect(snapshot.next).not.toBeNull();
  });

  it('coordinates legal movement (left, right, softDrop) and rotation (CW, CCW)', () => {
    const session = createSession({ random: dummyRandom });
    session.dispatch('start');

    const s0 = session.getSnapshot();
    const initialX = s0.active!.x;

    // Move left
    session.dispatch('moveLeft');
    const sLeft = session.getSnapshot();
    expect(sLeft.active!.x).toBe(initialX - 1);

    // Move right
    session.dispatch('moveRight');
    const sRight = session.getSnapshot();
    expect(sRight.active!.x).toBe(initialX);

    // Soft drop moves down 1 row
    session.dispatch('softDrop');
    const sDrop = session.getSnapshot();
    expect(sDrop.active!.y).toBe(s0.active!.y + 1);

    // Rotation
    session.dispatch('rotateCW');
    const sRotCW = session.getSnapshot();
    expect(sRotCW.active!.orientation).toBe(s0.active!.type === 'O' ? 0 : 1);

    session.dispatch('rotateCCW');
    const sRotCCW = session.getSnapshot();
    expect(sRotCCW.active!.orientation).toBe(0);
  });

  it('handles pause and resume lifecycle transitions', () => {
    const session = createSession({ random: dummyRandom });
    session.dispatch('start');

    session.dispatch('pause');
    expect(session.getSnapshot().status).toBe('paused');

    // In paused state, gameplay commands are no-ops
    const posXBefore = session.getSnapshot().active!.x;
    session.dispatch('moveLeft');
    expect(session.getSnapshot().active!.x).toBe(posXBefore);

    session.dispatch('resume');
    expect(session.getSnapshot().status).toBe('running');

    session.dispatch('moveLeft');
    expect(session.getSnapshot().active!.x).toBe(posXBefore - 1);
  });

  it('restart resets session state from any lifecycle state', () => {
    const session = createSession({ random: dummyRandom });
    session.dispatch('start');
    session.dispatch('moveLeft');
    session.dispatch('pause');

    session.dispatch('restart');
    const snapshot = session.getSnapshot();
    expect(snapshot.status).toBe('running');
    expect(snapshot.score).toBe(0);
    expect(snapshot.lines).toBe(0);
    expect(snapshot.level).toBe(1);
    expect(snapshot.active?.orientation).toBe(0);
  });

  it('guarantees snapshot immutability (modifying returned snapshot does not corrupt engine state)', () => {
    const session = createSession({ random: dummyRandom });
    session.dispatch('start');

    const s1 = session.getSnapshot();
    // Attempt to mutate returned board
    s1.board[0][0] = 'Z';
    // Attempt to mutate active cells
    (s1.active!.cells as [number, number][])[0] = [99, 99];

    const s2 = session.getSnapshot();
    expect(s2.board[0][0]).toBeNull();
    expect(s2.active!.cells[0]).not.toEqual([99, 99]);
  });
});
