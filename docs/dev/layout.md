# Repository layout and ownership

Status: accepted; first approval is recorded in [DOCS_TASKS](DOCS_TASKS.md). Paths described as planned are allocations for later implementation, not claims that files or functionality exist.

## Governing structure and present state

This layout maps [ARCHITECTURE](ARCHITECTURE.md) and [DECOMPOSITION](DECOMPOSITION.md) to physical ownership while supporting the accepted [PLAN](PLAN.md) and [SPEC](SPEC.md). PLAN owns phases and milestones; this document owns paths and dependency placement. TASKS will identify bounded changes within these allocations.

The repository currently contains root guidance/disclosure/license/README files, the bundled `.agents` skills/plugin, and the development documents under `docs/dev/`. Product source, package configuration, automated tests and build output are not present. Do not scaffold empty product modules merely to make this layout look implemented.

## Planned source ownership

| Planned path | Logical owner and purpose | Principal checks |
| --- | --- | --- |
| `index.html` | Static application shell: game region, Canvas, semantic controls/status containers and module entry | Browser startup, labels/focus and capability failures |
| `src/main.ts` | Browser entry/composition: construct application dependencies and initialize the controller; supply production randomness | Browser startup/disposal and build smoke |
| `src/engine/index.ts` | Public engine facade: export the specified session factory and consumer-facing types, without browser setup side effects | Public API tests and engine-only type check |
| `src/engine/types.ts` | Engine coordinates, pieces, board, state and snapshot/action types; internal types are not automatically exported by the public facade | Static checking and API/snapshot tests |
| `src/engine/geometry.ts` | Piece geometry and orientation transformations | Geometry and rotation unit checks |
| `src/engine/placement.ts` | Collision/legal-placement, rotation kick candidates and shared landing calculations | Placement/boundary/kick/ghost-drop equivalence checks |
| `src/engine/board.ts` | Legal locking and row compaction transformations | Board/line-clear unit checks |
| `src/engine/sequence.ts` | Seven-piece bag/queue operations using supplied randomness | Draw-count, bag, preview and failure checks |
| `src/engine/progression.ts` | Score, line/level and gravity-parameter calculations | Scoring/level/saturation boundary checks |
| `src/engine/session.ts` | Session facade implementation: validate inputs, own canonical live state and timing, commit completed transitions and expose the specified operations | Session lifecycle, chronological time, invalid-input and atomic-failure checks |
| `src/engine/transitions.ts` | Cohesive state-transition calculations used by the session owner, including movement/spawn/hold/lock collaboration | Explicit-state transition unit checks and session integration |
| `src/engine/snapshot.ts` | Detached read-only projection, including derived ghost/preview data through engine helpers | Read isolation, no-draw/no-mutation and projection checks |
| `src/browser/input.ts` | Keyboard listener/pressed-key/repeat-intent adapter and semantic key mapping | Controlled adapter/controller checks and actual browser keyboard/focus checks |
| `src/browser/clock.ts` | Monotonic time and animation scheduling/cancellation adapter | Controlled clock/scheduler and stale-resource checks |
| `src/browser/controller.ts` | Serialize commands/time/repeats, coordinate engine and views, manage pause/restart/disposal and browser failure handling | Controller integration plus real-browser lifecycle/error checks |
| `src/ui/canvas-renderer.ts` | Board/piece/ghost/preview drawing and Canvas resources | Browser drawing/snapshot agreement and context-failure checks |
| `src/ui/html-view.ts` | DOM status, totals, controls, labels, focus feedback and session/error messages | Browser semantic-control, focus/status and error checks |
| `src/ui/styles.css` | Playfield/panel layout, colors, ghost/focus/availability styling and responsive presentation | Target-viewport and visual/focus checks |

These allocations identify cohesive responsibilities rather than a required file-per-task ratio. The session engine is one logical component across its live-state facade and transition calculations; only the session facade retains the active session. Transition helpers receive explicit state/dependencies and cannot create an independent live game. New helpers require a real responsibility and an in-scope layout update, not an automatic directory/file for every operation.

## Dependency and interface placement rules

- `src/engine/` imports only engine modules and standard language facilities; no DOM, Canvas, browser globals, UI/controller modules or hidden time/random reads. Consumer imports go through its public facade where practical; focused unit tests may import internal modules directly.
- `src/browser/` composes the engine boundary and presentation adapters. Adapter contracts are declared beside their owning component and passed into the controller; a general shared service layer or event bus is unnecessary.
- `src/ui/` may use engine snapshot types through type-only imports. It must not import session/placement implementations or calculate gameplay rules. No UI module constructs an engine instance.
- `src/main.ts` is the only application bootstrap entry. Importing engine/adapters/views for tests must not initialize a game or register global listeners. Styles are loaded from the browser entry/shell, never the engine.
- Runtime snapshots cross the boundary as detached data. Type annotations do not substitute for runtime isolation. Private state helpers remain outside the public facade's exported API.

## Planned tests, fixtures and evidence

| Planned location | Ownership and limits |
| --- | --- |
| `tests/unit/engine/` | Geometry, placement, board, sequence, progression, transition, snapshot and session checks. Use matching descriptive `*.test.ts` names; no browser environment is required. |
| `tests/unit/browser/` | Adapter logic that can be checked with controlled collaborators without pretending a fake DOM/Canvas proves browser behavior |
| `tests/integration/` | Controller/engine/presentation-port collaboration with controlled clock, input and view substitutes; chronological delivery and resource ownership |
| `tests/browser/` | Playwright `*.spec.ts` cases against the real built application: controls, focus/repeat, Canvas/HTML agreement, session interruption, supported browsers and failure paths |
| `tests/helpers/` | Deterministic random streams, explicit-state builders, fake clocks/schedulers and reusable test setup. Helpers depend on product contracts, not the reverse. |
| `tests/fixtures/` | Small synthetic boards and legal-input replays with clear scenario meaning; no credentials, user profiles or downloaded browser binaries |

Public engine/browser acceptance scenarios use the specified API and legal input replays. Focused transition tests may use explicit internal-state fixtures; they must not require public test-only state setters or a debug game-state global in the production page. Unit fixtures do not establish full public-API acceptance by themselves.

Committed verification evidence belongs in the existing SDD report locations: milestone reports under `docs/dev/reports/phases/<phase-id>/<milestone-id>.md`, phase reports at that phase prefix's `PHASE-REPORT.md`, and the complete implementation report at `docs/dev/reports/IMPLEMENTATION-REPORT.md`. These are required future records, not present files. Raw runner output is generated separately; retain only relevant durable evidence with the owning task/report.

## Planned tooling and configuration

Use npm with TypeScript, Vite for the static browser application/build, Vitest for Node-based unit/controller checks, and Playwright for actual browser checks. No runtime UI framework or backend is needed. Select mutually compatible versions, record them in the lockfile and verify installation during the initial implementation foundation; this document does not claim dependency provisioning succeeded.

| Planned root path | Owner |
| --- | --- |
| `package.json`, `package-lock.json` | Scripts/development dependencies and reproducible npm resolution; one package-manager lockfile |
| `tsconfig.json` | Shared strict TypeScript options |
| `tsconfig.engine.json` | Engine-only checking with language libraries and an empty ambient `types` list, excluding DOM and Node globals to enforce the engine boundary |
| `tsconfig.app.json` | Browser application checking with required DOM types |
| `tsconfig.test.json` | Test/configuration type checking with runner/Node/browser types as appropriate; keep these types out of the engine-only configuration |
| `vite.config.ts` | Static build/dev/preview configuration, relative asset base suitable for hosting under a path, and development-server file exclusions preserving credential protection |
| `vitest.config.ts` | Node test collection for unit/integration paths; exclude browser cases and bundled `.agents` content |
| `playwright.config.ts` | Real-browser projects, built-output server setup, bounded timeouts and runner evidence locations |

Intended npm script names are `dev`, `typecheck`, `test`, `build`, `preview` and `test:browser`. They describe future script ownership, not validated runnable commands. `typecheck` must include engine, application and test/config scopes; `build` must not treat transpilation alone as TypeScript validation. Keep scripts usable through ordinary npm invocation without assuming PowerShell or imposing a custom global script shell. Record actual runtime/tool versions and verified commands when implementation establishes them.

Browser projects cover Chromium as the primary target and Playwright-managed Firefox as the second target. Provisioning and execution follow [BROWSER_DEV_POLICY](../../BROWSER_DEV_POLICY.md); T-001 establishes the isolated environment and records its evidence. Record actual browser versions and managed-build provenance. Missing required targets or incompatible binaries remain blockers under PLAN rather than implicit omissions.

## Generated output, documentation and existing assets

`dist/` owns the generated static site. `node_modules/`, `coverage/`, `test-results/` and `playwright-report/` own local dependencies/runner artifacts and are ignored rather than committed as source. Generated application assets must bundle runtime dependencies locally and exclude tests, fixtures, development documents, bundled `.agents` content and credentials. The existing token-ignore rule is preserved. No browser binary/profile/cache belongs in the tracked tree.

Because repository-local credentials coexist with the root application shell, development-server configuration must deny access to `*.tkn` while retaining the tool's default sensitive-file exclusions. Browser/server smoke checks verify refusal using a synthetic token-shaped fixture, never by requesting or printing a real credential. Production browser checks serve only `dist/`; artifact inspection verifies no token/development files were copied into it.

The root README owns concise user entry/navigation and verified setup/play/check commands. Planned `docs/USER-GUIDE.md` owns supported controls, gameplay and troubleshooting; planned `docs/DEVELOPMENT.md` owns reproducible setup, browser provisioning and check details. Keep user documentation aligned with the phase's delivered scope. `docs/dev/` retains authoritative design/SPEC/PLAN/layout/TASKS, preparation/QC, handoff and implementation evidence. [TASKS](TASKS.md) is accepted and is the sole product execution checklist.

Preserve root LICENSE, AI_DISCLOSURE.md, SDD-MANAGER.md, SKILL_DISCOVERY_PROTOCOL.md and manual AGENTS content. The bundled `.agents/` skills/plugin are development inputs, not product source and not an incidental repair target. Update only accurate governing-document navigation in AGENTS during this layout checkpoint; add setup/check commands there only after validation.

## Integration support and readiness

The same engine/browser/UI homes support both phases; add later modern behavior in its existing owner rather than creating a second engine or phase-specific source tree. P1 foundation can establish the entry/configuration and rule modules incrementally, P1 progression/reliability can extend their collaborators, and P2 can extend placement/projection/hold consumers with colocated relevant tests. TASKS owns concrete edit scopes and ordering.

The [PLAN review report](PLAN-REVIEW-REPORT.md) includes combined strategy/placement QC, component-to-path/test mapping, dependency rules and source identities. Layout and TASKS approvals are recorded in DOCS_TASKS; whole-package QC, published preparation integration and executable-range selection still govern implementation.

## Tooling references inspected

- [Vite getting started](https://vite.dev/guide/): TypeScript/static application tooling and script/build entry points.
- [Vitest getting started](https://vitest.dev/guide/): Vite-based unit-test tooling and compatibility guidance.
- [Playwright browsers](https://playwright.dev/docs/browsers): browser projects and managed Chromium/Firefox provisioning.
- [Vite server options](https://vite.dev/config/server-options#server-fs-deny): development-server sensitive-file exclusions.

These official references support the proposed tool capabilities. They do not establish this host's browser availability, compatible installed dependency set or successful product checks.
