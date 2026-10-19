# Game rules

This child of [SPEC](../SPEC.md) owns game behavior for the session engine and its rule collaborators. Coordinates use x increasing rightward and y increasing downward; milliseconds are elapsed game time.

## G-BOARD: Geometry, placement and spawn

The board has columns 0–9 and rows 0–19, with no hidden playable rows. A legal piece has exactly four distinct occupied cells, all within those bounds and all on empty locked-board cells. The padded rotation box itself need not be occupied or entirely within bounds.

Spawn orientation 0 uses these local occupied cells. All boxes spawn at y=0; x is shown below. The I piece therefore initially occupies board row 1.

| Piece | Rotation-box size | Local occupied cells (x,y) | Spawn x |
| --- | ---: | --- | ---: |
| I | 4 | (0,1), (1,1), (2,1), (3,1) | 3 |
| J | 3 | (0,0), (0,1), (1,1), (2,1) | 3 |
| L | 3 | (2,0), (0,1), (1,1), (2,1) | 3 |
| O | 2 | (0,0), (1,0), (0,1), (1,1) | 4 |
| S | 3 | (1,0), (2,0), (0,1), (1,1) | 3 |
| T | 3 | (1,0), (0,1), (1,1), (2,1) | 3 |
| Z | 3 | (0,0), (1,0), (1,1), (2,1) | 3 |

Spawn uses the exact origin/orientation above, without kick search. A blocked spawn ends the game. No cell is inserted over an existing locked cell. Failure after a lock preserves the resulting compacted board and updated totals; failure during hold preserves the locked board and totals. The attempted selection/exchange is consumed, with no active piece after game over.

## G-ROTATE: Rotation and bounded kicks

Orientations 0, 1, 2 and 3 represent successive clockwise rotations. For an N×N box, clockwise rotation maps each local cell (x,y) to (N−1−y,x); counterclockwise maps it to (y,N−1−x). O rotation is a no-op with orientation 0.

For other pieces, test the rotated candidate with these origin offsets in this exact order: (0,0), (−1,0), (1,0), (−2,0), (2,0), (0,−1), (−1,−1), (1,−1), (0,−2). Accept the first legal candidate. If all fail, leave piece position/orientation unchanged. The same bounded search applies to I/J/L/S/T/Z and both rotation directions. There is no 180-degree action, downward kick or wraparound. This is the project's defined kick scheme, not SRS.

## G-SEQUENCE: Bags, preview and hold

A bag contains exactly one each of I,J,L,O,S,T,Z. Shuffle the canonical order with descending Fisher–Yates: for i=6 down to 1, consume one random draw u and swap positions i and floor(u×(i+1)). Each bag consumes six draws. Concatenate bags in draw order; a piece cannot be skipped to avoid an inconvenient spawn.

When selecting a new active piece, ensure at least two queued pieces exist by appending a shuffled bag when needed, then remove the first. The first remaining entry is the one-piece preview. Reading preview consumes no draws or entries. Start/restart discards board, hold, queue, timing and totals and begins a fresh bag using the next draws from the injected source; it does not rewind that source. Reproducible replay uses a freshly initialized equivalent source.

Hold is available once for each active piece before its lock. With empty hold, store the current type and select the next queue entry. With occupied hold, exchange types without consuming the queue. The incoming type uses spawn orientation/origin and fresh timing; hold becomes unavailable. A hold request while unavailable is a no-op: preserve placement, hold/queue, random-source consumption, score and timing. Hold preserves score/lines/level. It becomes available after the next successful lock/spawn, not after a rejected hold request. Spawn failure during hold follows G-BOARD.

## G-MOVE: Movement, ghost and drop

Left/right requests attempt one column; soft drop attempts one row. A blocked request changes neither placement nor score and does not reset timing. A successful soft-drop row awards one point; gravity movement awards none. A successful horizontal move or rotation does not reset the gravity accumulator.

Landing is the greatest nonnegative downward displacement obtainable by legal consecutive one-row translations. Ghost cells always show that result, including a projection coincident with the active piece. No piece passes through a locked cell. Hard drop applies exactly that displacement and awards two points per descended row. It does not lock immediately; G-TIME applies. A zero-distance hard drop awards no points and does not reset any timer. Repeating it cannot postpone lock.

## G-TIME: Gravity and full-interval locking

Level begins at 1. Its gravity interval is G=max(100,1000−75×(level−1)) milliseconds. A spawned/held-in piece begins with zero gravity accumulation. Each elapsed G attempts one downward gravity row; retain residual elapsed time. Failed downward attempts do not themselves lock a piece.

A piece is grounded when a one-row downward move is illegal. On first becoming grounded, start a separate lock timer at zero with deadline one full current G later. This includes spawn directly onto support, successful downward movement onto support and positive-distance hard drop. The interval is measured from that landing, not from an earlier gravity tick. Positive-distance hard drop resets gravity accumulation to zero on arrival.

While the piece remains grounded, successful horizontal moves/rotations preserve the elapsed lock timer and deadline; blocked actions, O rotation and zero-distance hard drop do likewise. If a legal move/rotation makes the piece airborne, clear its lock timer. If it later becomes grounded, start a fresh full interval. There is no additional grounded-move reset allowance.

At the lock deadline, merge the piece into the board, clear rows, update progression and attempt the next spawn. Locking takes precedence over a gravity attempt due at that same instant. Commands timestamped at a deadline are delivered after elapsed time is advanced to that timestamp, so the lock occurs first. A new active piece may consume time remaining in the same valid advance. Paused/ready/game-over time does not accumulate.

Soft drop uses repeated one-row commands as defined in the browser child; it does not accelerate or shorten G or its lock deadline. A piece may remain active on the floor during its full lock interval and may be repositioned subject to legal placement.

## G-PROGRESS: Clearing, scoring and game over

After each lock, remove every full row simultaneously and shift surviving rows downward, inserting empty rows at the top. All remaining cells preserve their type and relative row order. Score line clears using the level immediately before the clear:

| Rows cleared | Points multiplied by that level |
| ---: | ---: |
| 0 | 0 |
| 1 | 100 |
| 2 | 300 |
| 3 | 500 |
| 4 | 800 |

Add the clear count to total lines and set level to 1+floor(totalLines/10). Apply the resulting G to the next active piece. Drop points are added independently when their rows are traversed. No combo, back-to-back, T-spin, perfect-clear or hold bonus applies. Store score and line totals as nonnegative safe integers, saturating each total at Number.MAX_SAFE_INTEGER if necessary.

Game over occurs on a blocked required spawn; there is no separate hidden-row top-out rule or winning state. Stop advancement and gameplay commands until start/restart. Session totals remain visible. Restart follows the fresh-session behavior in G-SEQUENCE.

## G-ACCEPT: Rule acceptance examples

- For every type, verify four distinct spawn cells and four quarter-turns returning to its initial geometry; O remains unchanged. Test a legal nonzero kick and a fully blocked rotation, including floor and stack boundaries.
- A controlled stream yields each type once per consecutive bag; preview reads leave the stream unchanged. Hold exchange restores spawn orientation and permits only one hold before locking.
- At level 1, normal and hard-drop landings remain active at 999 ms of continuous grounding and lock at 1000 ms. At level 2, use 924/925 ms; at level 13 and above, use 99/100 ms.
- Grounded movement at 900 ms does not postpone a level-1 deadline. Moving off support clears it; re-landing begins a fresh deadline. A repeated zero-distance hard drop never postpones that deadline.
- With nine cleared lines, a one-row clear awards 100 at level 1, reaches ten lines/level 2 and gives the subsequent piece a 925 ms gravity interval. Two soft-drop rows and three hard-drop rows add 2+6 points independently.
- Row compaction and blocked-spawn scenarios preserve locked cells, terminal totals and snapshot invariants. Large valid advances and equivalent subdivisions agree across lock/spawn boundaries.
