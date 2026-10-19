# Browser session and interface

This child of [SPEC](../SPEC.md) owns browser input, timing delivery, rendering and resource behavior. Exact game rules belong to [game rules](game-rules.md).

## B-CONTROLS: Keyboard and HTML controls

Provide a focusable, visibly labeled game region. Clicking its playfield focuses it. Gameplay keyboard bindings operate only while that region itself is focused; unrelated page controls retain native keyboard behavior.

| Input | Semantic action |
| --- | --- |
| Left / Right arrow | Move one column left/right |
| Down arrow | Soft drop one row |
| Up arrow or X | Rotate clockwise |
| Z | Rotate counterclockwise |
| Space | Hard drop |
| C or either Shift key | Hold |
| P or Escape | Pause running play / resume paused play |
| Enter | Start from ready/game over; resume from paused |
| R | Restart from any lifecycle state |

Use physical key codes for letter bindings. Ignore keyboard events with Ctrl, Alt or Meta pressed; Shift is independently usable for hold and does not disable other gameplay bindings. Prevent default scrolling only for recognized game keys handled in the focused region. Never intercept Tab. Show the control reference on the page.

Ignore browser-generated repeated keydowns. For left/right and down, perform one immediate action on physical keydown, then repeat from a monotonic held-key timer: left/right first repeat after 150 ms and every 50 ms thereafter; down first repeat after 50 ms and every 50 ms thereafter. If both horizontal directions are held, the most recently pressed direction repeats; releasing it restores the remaining direction with a fresh 150 ms delay and no immediate move. Rotation, hard drop, hold and session actions occur once per press, until keyup. Keyup always releases the adapter's matching held state.

Provide native HTML Start, Pause/Resume and Restart buttons with accessible names. Start is enabled in ready/game over, Pause/Resume in running/paused and Restart in every initialized state. Button activation performs one semantic action and returns focus to the game region. Native button keyboard activation must not also invoke the region's key handler.

## B-TIME: Ordering, pause and interruption

Use one monotonic clock and at most one active animation loop. Before processing an input command at time t, deliver all running time since the last processed timestamp up to t. Process due held-key repeats chronologically within that elapsed span, advancing the engine before each repeat. At equal timestamps, engine deadlines precede repeated input; simultaneous repeated inputs process horizontal movement before soft drop. A physical input at t follows those already-due events. Update the processed timestamp after each delivery so time is never counted twice.

Pause freezes engine time and retains the game snapshot. Clear held-key state and repeat timers on pause, restart, game over, loss of region keyboard focus, window blur or document hiding. Losing region focus alone stops held input but does not pause gravity. Window blur or document hiding while running automatically pauses play. Regaining focus/visibility does not resume automatically.

If the elapsed delivery gap exceeds 1000 ms, pause running play without advancing that gap or replaying missed input. Exactly 1000 ms remains a valid elapsed span. On resume, establish a fresh clock baseline and require fresh key presses. A pause command first processes the valid elapsed span up to that command; an interruption or excessive-gap pause discards the unprocessed gap.

Restart discards pending inputs and stale frame callbacks, creates fresh gameplay state through the engine and establishes a fresh time baseline. A stale callback from a previous run must not advance the new run. Application disposal cancels scheduling and removes listeners; repeated disposal is harmless. A second initialization must not accumulate listeners or loops from a disposed instance.

## B-VIEW: Presentation and feedback

Render a distinct 10×20 grid, locked cells, active piece and translucent/outlined ghost. Coincident ghost cells must not obscure the active piece. Each tetromino has a consistent distinguishable color; ghost treatment is visibly different from solid blocks. The Canvas renderer uses supplied geometry rather than recalculating legal placement.

Show score, total lines, level, held piece, one next-piece preview and a clear hold-unavailable indication. Show ready, paused and game-over messages with the appropriate start/resume/restart instruction. A paused view retains the board behind its message. Game-over totals stay visible. HTML and Canvas must reflect the same refresh snapshot. A successful action's result is drawn at the next available frame, or immediately if no running animation loop exists.

Keep session buttons and important status text outside Canvas in semantic HTML. Provide visible keyboard focus, a labeled game region and programmatically readable status text for ready/running/paused/game over. Avoid announcing every gravity movement through a live region. Color is not the sole indication of focus, hold availability or lifecycle state. Full nonvisual gameplay is outside this version's acceptance.

## B-FAIL: Initialization and engine failures

If Canvas/context acquisition fails, show a readable HTML error, disable play controls and install no running update loop. On a required DOM initialization failure, use an available root/page message location and perform partial-resource cleanup rather than leaving active callbacks. A propagated engine/random-source error stops advancement, clears held input and displays a session error with a reload instruction; it does not auto-retry or present the invalid session as ordinary game over.

## B-ACCEPT: Browser acceptance

- Start with Enter and with the Start button; verify only one game starts per activation and mapped keys do not scroll the focused playfield.
- Check custom repeat timing independently of browser key-repeat settings, including both horizontal keys, key release, Tab navigation and pause/resume with held keys.
- At a lock deadline, verify a same-timestamp input cannot rescue the expired piece. A rotation shortly before the deadline can affect placement without resetting a grounded deadline.
- Hide the page or blur the window, wait and return: play remains paused and no elapsed-time catch-up occurs. Test 1000 ms versus greater-than-1000 ms delivery gaps.
- Restart repeatedly and dispose/recreate the application; verify one effective listener set/update loop and no stale callback affects the new game.
- Verify coherent ghost/hold/next/score feedback, native button labels/focus and a readable layout at the target viewport. Exercise unavailable Canvas and propagated engine-error paths.
