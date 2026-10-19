# Tetris project brief

Status: accepted; first approval is recorded in [DOCS_TASKS](DOCS_TASKS.md).

## Purpose and intended outcome

Develop a classic browser-based Tetris game with modern play conveniences. The intended user is a person playing a single-player falling-block game with a keyboard. The first version should provide a complete playable session, from starting a game through progression, game over and restart.

The project uses SDD Manager to make requirements, design decisions, delivery tasks and verification evidence reviewable alongside the implementation.

## First-version scope

The TypeScript baseline, extended by the user's explicit request, includes:

- A 10×20 playfield and all seven tetrominoes.
- Horizontal movement, rotation, automatic gravity and soft drop.
- Piece locking, completed-line clearing and game-over detection.
- Score, levels and next-piece preview.
- Start, pause/resume and restart controls.
- Keyboard controls and automated gameplay tests.
- Hold: reserve a piece for later use.
- Ghost piece: show the active piece's projected landing position.
- 7-bag randomization: draw pieces from shuffled sets containing all seven tetrominoes.
- Wall kicks: allow defined positional adjustments when rotation would otherwise be blocked.
- Hard drop: move the active piece directly to its landing position.

All five modern features belong to the first version. Delivery planning may introduce them in successive usable increments without removing them from that version's intended scope.

## Product defaults

The accepted defaults are:

- A single-player game that runs entirely in the browser, with no application server or account requirement.
- Desktop keyboard play as the supported initial interaction; a layout that remains legible at ordinary desktop window sizes.
- Static web delivery, with gameplay requiring no network requests after application assets load.
- A clear playfield, visible game state and an in-game control reference.
- No multiplayer, online leaderboard, touch controls, audio, or saved-game system in the first version.

## Quality goals

Controls should respond predictably, and elapsed-time behavior should remain consistent across ordinary display refresh rates. Game rules should support repeatable automated tests. Browser checks should verify that keyboard input, rendering and session controls work together. Documentation should describe supported behavior and reproducible setup and check commands as those become established.

## Detailed contract owners

[ARCHITECTURE](ARCHITECTURE.md) defines rendering and state boundaries, and [DECOMPOSITION](DECOMPOSITION.md) defines component collaboration. [SPEC](SPEC.md) and its children define exact controls, scoring, progression, spawn, rotation, hold, ghost and drop contracts. The selected lock delay is one full current gravity interval for both normal landings and hard drops.

[PLAN](PLAN.md), [layout](layout.md) and [TASKS](TASKS.md) define delivery, placement and execution units. Document acceptance does not select an implementation range.

## Decision sources

The user requested a classic browser-based Tetris game and then explicitly added hold, ghost piece, 7-bag randomization, wall kicks and hard drop to the proposed TypeScript baseline. Product defaults above are accepted. Preparation progress and approval evidence belong to [DOCS_TASKS.md](DOCS_TASKS.md).
