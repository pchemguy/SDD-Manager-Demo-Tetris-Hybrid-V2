# Project handoff

Checkpoint: Milestone 1.1 (*Falling pieces and locking prototype*, tasks `T-001` through `T-008`) complete, verified, and reported on working branch `phase/1-classic-game`.

## 1. Workflow and Governing State

- **Stage:** Phase 1 implementation — Classic playable game.
- **Milestone Completed:** 1.1 — Falling pieces and locking (`T-001` through `T-008`).
- **Working Branch:** `phase/1-classic-game` (tracking `origin/phase/1-classic-game`).
- **Governing Inputs:** [PROJECT](PROJECT.md), [ARCHITECTURE](ARCHITECTURE.md), [DECOMPOSITION](DECOMPOSITION.md), [SPEC](SPEC.md), [PLAN](PLAN.md), [layout](layout.md), [TASKS](TASKS.md), and [BROWSER_DEV_POLICY](../../BROWSER_DEV_POLICY.md).
- **Instructions:** Root [AGENTS](../../AGENTS.md), repository-bundled [SDD Manager](../../.agents/plugins/sdd-manager/PLUGIN.md) 0.15.1.
- **Report:** [Milestone 1.1 Report](reports/phases/1/1.1.md).

## 2. Delivered Baseline and Verification

- **Engine Seams & Tooling (`T-001`):** Strict TypeScript configs (`tsconfig.engine.json` excluding DOM/Node globals, `tsconfig.app.json`, `tsconfig.test.json`), Vite build/preview with credential exclusions (`server.fs.deny`), Vitest, and Playwright with isolated Chromium and Firefox runners in `.browsers/`.
- **Geometry & Board Locking (`T-002`):** Spawn definitions for all 7 tetrominoes, 0-offset rotations, O no-op, board boundary checks, and immutable non-overwriting locking.
- **Deterministic Bag & Preview (`T-003`):** 7-bag randomizer using descending Fisher-Yates consuming 6 draws, atomic failure on throwing/invalid random, and queue maintenance with non-consuming next preview.
- **Session Coordinator & Snapshots (`T-004`):** Central `GameSession` managing lifecycle, action dispatching, advance duration validation ([0, 1000] ms), and immutable deep-copied snapshots under `S-API`, `S-DATA`, and `S-DETERMINISM`.
- **Chronological Gravity & Locking (`T-005`):** Gravity timing ($G = \max(100, 1000 - 75 \times (\text{level} - 1))$ ms), grounding detection, full $G$ lock timer deadline, grounded movement deadline preservation, airborne timer resets, same-timestamp lock precedence, and atomic random-dependent timed spawn failure.
- **Canvas & HTML Presentation (`T-006`):** Pure `CanvasRenderer` for 10x20 playfield and `HtmlView` updating status text, overlay visibility, statistics, and native button states from snapshot data.
- **Keyboard & Clock Integration (`T-007`):** `AnimationClock` (monotonic frame loop via RAF), `KeyboardInputAdapter` (mapping arrows, X, Z, P, Esc, Enter, R while ignoring Ctrl/Alt/Meta and preserving Tab), and `GameController` driving the interactive falling piece prototype.
- **Milestone Review & Verification (`T-008`):** Code review, test execution (48 unit/integration tests passing, 8 browser tests passing in Chromium and Firefox, 0 typecheck errors, clean static production build).

## 3. GitHub Tracking State

- **Milestone:** `sdd-1.1-Falling-pieces-and-locking` (ID: 10).
- **Issues Closed:**
  - #52 (`T-001`): Closed
  - #53 (`T-002`): Closed
  - #54 (`T-003`): Closed
  - #55 (`T-004`): Closed
  - #56 (`T-005`): Closed
  - #57 (`T-006`): Closed
  - #58 (`T-007`): Closed
  - #59 (`T-008`): Closed in completion commit
- **Milestone Status:** Closed upon completion of `T-008`.

## 4. Stopping Boundary and Next Steps

- **Stopping Boundary:** Milestone 1.1 boundary reached. Stopped per authorized implementation range.
- **Next Milestone:** Milestone 1.2 — Classic session progression (`T-009` through `T-014`).
  - `T-009`: Implement simultaneous row removal and compaction.
  - `T-010`: Implement scoring, level and gravity progression.
  - `T-011`: Integrate clearing and progression into lock and spawn.
  - `T-012`: Complete classic session lifecycle and API boundaries.
  - `T-013`: Integrate progression, preview and session controls in interface.
  - `T-014`: Review, test and report milestone 1.2.
