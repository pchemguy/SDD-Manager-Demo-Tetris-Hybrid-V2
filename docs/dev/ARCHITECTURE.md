# Tetris architecture

Status: accepted; first approval is recorded in [DOCS_TASKS](DOCS_TASKS.md).

## Context and design goals

The accepted [PROJECT](PROJECT.md) defines a TypeScript browser game with the classic game loop and hold, ghost piece, 7-bag randomization, wall kicks and hard drop. This architecture supports that complete scope through a deterministic game engine and a small browser application. It requires no application server, account service or runtime gameplay network connection.

The main goals are predictable gameplay, one authoritative representation of game rules, repeatable tests and a responsive interface. Detailed component contracts belong to DECOMPOSITION; exact rules and acceptance conditions belong to SPEC.

## Major blocks and dependency direction

| Block | Responsibility and ownership | Dependencies |
| --- | --- | --- |
| Game engine | Own the playfield, active piece, sequence/hold state, scoring and progression, gameplay lifecycle and rule decisions. Process semantic commands and elapsed time; expose state and derived gameplay information. | TypeScript data and rule logic; explicit randomness input or an injected random source. No browser APIs. |
| Browser application controller | Translate keyboard and interface events into semantic commands, supply elapsed time and randomness, schedule updates and connect engine output to presentation. Own browser listeners, scheduling and their cleanup. | Game engine and browser adapters. Presentation is connected through supplied snapshots and command callbacks. |
| Presentation | Draw the playfield and piece previews; display score, level, game state and control guidance; expose HTML session controls. | Read-only presentation data and controller-supplied callbacks; Canvas and DOM APIs. No rule execution or engine-state mutation. |

The browser application composes the engine and presentation. The engine has no dependency on either browser block. Presentation receives the information it needs rather than discovering global state or calling game-rule functions. Browser resources remain outside the engine, and the design requires no global event bus or general-purpose application framework.

## Runtime flow and state ownership

Keyboard events and HTML controls enter through the controller. It maps them to semantic actions, advances the engine with explicit elapsed-time input and supplies the resulting snapshot to presentation. Animation scheduling uses the browser's frame callback facility; gameplay timing depends on monotonic elapsed time rather than frame count.

The engine owns the authoritative gameplay lifecycle, including whether the game is running, paused or over. The controller owns scheduling resources and coordinates them with that lifecycle. Pause and restart must keep those resources consistent with engine state; presentation renders the resulting state without maintaining an independent gameplay status.

Game-state mutation occurs through the engine's transition boundary. The controller and presentation must not alter engine-owned collections through retained references. Snapshot and command contracts will be defined in DECOMPOSITION, including how read-only consumers are protected from accidental mutation.

Randomness enters through an explicit boundary. Production composition supplies the random source; tests supply reproducible draws or a seeded source. Given equivalent initial state, commands, elapsed-time inputs and random draws, engine outcomes must be reproducible. The engine does not read wall-clock time, keyboard state or browser storage.

## Rule ownership across modern features

Collision and legal-placement logic are authoritative in the engine. Movement, rotation/wall kicks, gravity and drop behavior reuse those rules. The ghost position is derived from the same landing calculation used by hard drop, so rendering cannot independently invent a different legal landing position.

The engine also owns hold eligibility, sequence consumption, bag refill, piece spawning and the consequences of locking and line clearing. Presentation displays the resulting held piece and preview information; it does not consume the sequence or generate pieces. Exact kick tables, lock timing, scoring and action ordering remain SPEC decisions.

## Rendering and interaction choices

Use Canvas for the board, active piece and ghost, with Canvas or small dedicated drawing surfaces for piece previews. Grid rendering is a natural fit for Canvas and avoids making DOM layout responsible for gameplay geometry. Rendering remains a projection of engine output, allowing the game rules to run in tests without a drawing surface.

Use semantic HTML for buttons, score/level/status information and the control reference. This supports keyboard-operable session controls and readable state outside the Canvas. Canvas alone does not provide an accessible representation of gameplay; SPEC must define the supported keyboard interaction, visible focus, labels and status feedback without claiming complete nonvisual gameplay support.

A DOM-per-cell board is a viable alternative, but adds browser element management without improving rule testability. A UI framework is unnecessary for the accepted interface size. Rendering style, exact bindings and responsive layout details remain downstream decisions.

## Verification boundaries

- Engine tests cover rule transitions and invariants using explicit commands, time and reproducible randomness, without a browser.
- Controller integration tests exercise action translation, timing delivery and pause/restart coordination with controlled adapters.
- Browser checks exercise keyboard input, HTML controls, Canvas output and visible state together. Engine test success alone does not establish browser usability or rendering correctness.
- Static type checks and a production build verify integration and distributable browser assets once the toolchain is selected and implemented.

The core invariant is that timing, random draws and input arrive through explicit boundaries while game rules have a single owner. No persistence, multiplayer protocol, plugin framework or speculative backend layer is introduced.

## Open decisions and next owner

Acceptance of this proposal selects the three-block arrangement, Canvas with HTML interface elements, and the explicit time/randomness boundaries. DECOMPOSITION will define cohesive components, collaboration and design-level interfaces within those blocks. SPEC will settle precise gameplay, interruption and timing contracts, including the general and hard-drop locking policies. PLAN and layout will select delivery increments, tooling and physical paths.
