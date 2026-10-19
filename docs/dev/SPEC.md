# Tetris system specification

Status: accepted; first approval is recorded in [DOCS_TASKS](DOCS_TASKS.md). The user selected one full current gravity interval of lock delay for both normal landings and hard drops. The complete contracts below are accepted.

## S-SCOPE: Outcome and boundaries

Provide a single-player TypeScript browser game with a 10×20 board, all seven tetrominoes, movement, rotation, gravity, soft drop, line clearing, scoring, levels, next preview, hold, ghost, 7-bag randomization, wall kicks and hard drop. Support starting, pausing, resuming, restarting and game over through keyboard and HTML controls.

The governing design is [PROJECT](PROJECT.md), [ARCHITECTURE](ARCHITECTURE.md) and [DECOMPOSITION](DECOMPOSITION.md). Game rules execute without browser dependencies; the controller supplies input/time/randomness; Canvas and HTML render snapshots. This specification defines a project-specific ruleset, with bounded kick search; it does not claim official Tetris Guideline or SRS conformance.

No server, account, multiplayer, online leaderboard, touch controls, audio or saved-game system is required. Gameplay performs no network requests after application assets load. Reload creates a fresh ready session.

## Contract owners

| Source | Canonical behavioral scope | Responsible design components |
| --- | --- | --- |
| [Game rules](spec/game-rules.md) | Coordinates, pieces, rotation/kicks, sequence, movement, timing/locking, hold, scoring, spawning and terminal outcomes | Geometry, placement, board, sequence, scoring and session engine |
| [Browser session](spec/browser-session.md) | Controls/repeat, elapsed-time delivery, focus/interruption, rendering, resource lifecycle and supported desktop interaction | Input/time adapters, controller, Canvas renderer and HTML view |
| This root | Cross-component API/data/error contracts, determinism, compatibility and complete-session acceptance | Session boundary, snapshot projection and application composition |

Each child owns its detailed rules; readers must use both children with this root. Implementation order and paths belong to PLAN and layout.

## S-API: Session boundary and errors

The public engine boundary provides `createSession({ random })`, returning a session with `dispatch(action)`, `advance(elapsedMs)` and `getSnapshot()`. `dispatch` and `advance` return undefined on success, including no-ops; callers obtain state through `getSnapshot`. `random` is a function producing a number in [0, 1). A newly created session is ready and does not draw randomness before play starts.

Actions are `start`, `restart`, `pause`, `resume`, `moveLeft`, `moveRight`, `rotateCW`, `rotateCCW`, `softDrop`, `hardDrop` and `hold`. An action is a single string. Gameplay actions have effects only while running. `start` starts a fresh game from ready or game over; `restart` starts a fresh game from any lifecycle state; `pause` affects running only; `resume` affects paused only. Recognized actions in other states are no-ops, with no random draws or score changes. Unknown action strings throw `RangeError`; non-string actions throw `TypeError`, preserving session state.

`advance` accepts a finite number in [0, 1000], in milliseconds. Non-numbers throw `TypeError`; nonfinite, negative or greater-than-1000 values throw `RangeError`. Invalid input is rejected before state mutation or random draws. Valid time input while not running is a no-op. Zero duration processes no future time. Browser delivery and command ordering are defined in the browser child.

An absent/non-function random dependency throws `TypeError` at creation. A required draw outside [0, 1), nonfinite or nonnumeric throws `RangeError`; a source-thrown error propagates. A transition is one dispatched action or one timed gravity/lock event, including its dependent clear/progression/selection/spawn work. A failed random-dependent transition preserves its pre-transition session state. Earlier completed transitions within the same `advance` remain committed; the failing call stops without processing later time. Already consumed external random draws are not rolled back. The browser stops play and displays an error rather than retrying that transition or silently substituting randomness. Internal invariant failures also remain observable and stop play.

## S-DATA: Snapshot and state isolation

Every snapshot contains:

- `status`: `ready`, `running`, `paused` or `gameOver`.
- `board`: 20 row arrays of 10 cells, each null or one of `I`, `J`, `L`, `O`, `S`, `T`, `Z`; only locked cells appear here.
- `active`: null or `{ type, orientation, x, y, cells }`, with orientation 0–3, an integer origin and `cells` as an array of four absolute `[x,y]` integer pairs.
- `ghostCells`: an array of four absolute `[x,y]` integer pairs while an active piece exists, otherwise an empty array.
- `held` and `next`: null or a tetromino identifier; `next` represents exactly one next piece.
- `canHold`: true only while running and hold is available for the active piece.
- `score`, `lines`, `level`: nonnegative integer score/lines and a positive integer level.

Ready state has an empty board, null active/held/next, empty ghost, unavailable hold, score/lines zero and level one. Paused snapshots retain the board, active piece, hold/preview and score but report unavailable hold. Game-over snapshots have null active, empty ghost and unavailable hold; retain the completed session's board and totals.

Snapshots contain no functions, browser objects or mutable aliases into live engine state. Modifying any returned array/object must not alter later snapshots or gameplay. Snapshot reads do not consume random draws, time or sequence entries. The locked board, active piece and ghost remain distinct representations; views do not infer one by mutating another.

## S-DETERMINISM: Cross-component guarantees

Equivalent starting sessions, action sequences, elapsed-time inputs and random draws produce equivalent snapshots. Splitting an elapsed duration into valid smaller advances produces the same outcome when no command or random-source difference intervenes. All due transitions are processed chronologically, including time remaining after a lock/spawn. An update ends immediately on game over.

The engine owns all legality, landing and scoring calculations. Ghost projection and hard drop use the same legal landing result. The controller owns command delivery and browser resources, never an independently mutable game state. Presentation displays a coherent snapshot and does not generate pieces or determine collisions.

## S-QUALITY: Delivery and supported use

Target desktop keyboard use in Chrome, Edge and Firefox; record actual tested versions with implementation evidence. Support a 1024×768 viewport without losing the board or session controls; larger viewports may scale the layout. At narrower sizes, ordinary page scrolling may be used. Touch interaction is outside acceptance.

The production output is statically hostable. Document verified development, type-check, automated-test and production-build commands when implemented. Automated checks must include deterministic engine scenarios and browser integration; document review is not gameplay verification. No fixed frame rate is required for rule correctness. The browser child defines stall/interruption handling and visual/focus requirements.

## S-ACCEPT: Complete-session acceptance

1. From ready, start a game: the board is empty, a legal active piece and one preview appear, score is zero and level is one. Keyboard and HTML session controls operate as specified.
2. Exercise movement, both rotations, a boundary kick, blocked actions, gravity and soft drop; legal placements remain within the board and never overlap locked cells.
3. Verify consecutive seven-piece bags, non-consuming previews, an empty hold, a held-piece exchange, hold rejection before locking and re-enablement after locking.
4. On the same board/piece, compare ghost and hard-drop landing. Confirm positive-distance drop points and zero-distance no-op behavior, including repeated drop commands during lock delay.
5. At a normal landing and a hard-drop landing, advance to just below the full gravity-interval deadline: the piece is active. At the deadline it locks. Grounded moves preserve the deadline; becoming airborne clears it; re-landing starts a fresh interval.
6. Clear one through four rows, check compaction, score/level transitions and subsequent spawning. A blocked spawn produces game over without overwriting locked cells.
7. Pause/resume, hide/restore the page, interrupt focus and restart. Verify frozen game time, discarded stale input/time, preserved pause state and absence of duplicate loops/listeners.
8. Compare deterministic runs, partitioned advances and snapshots; attempt snapshot mutation and invalid inputs. Confirm state isolation and specified failures without partial transitions.
9. Verify labels, focus visibility, Canvas/HTML agreement, normal keyboard navigation, capability-failure messaging and the production build in the supported browser check scope.

The [SPEC review report](SPEC-REVIEW-REPORT.md) records document/design QC. Passing that review does not supply human acceptance or implementation evidence.
