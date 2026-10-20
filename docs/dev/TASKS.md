# Tetris implementation tasks

Status: accepted; first approval is recorded in [DOCS_TASKS](DOCS_TASKS.md). All implementation checkboxes are unchecked; no executable range is selected.

## Governing inputs and execution boundaries

This list is the sole product implementation checklist, derived from accepted [SPEC](SPEC.md), [game rules](spec/game-rules.md), [browser session](spec/browser-session.md), [PLAN](PLAN.md) and [layout](layout.md), with [ARCHITECTURE](ARCHITECTURE.md) and [DECOMPOSITION](DECOMPOSITION.md) defining ownership. Preparation progress belongs to [DOCS_TASKS](DOCS_TASKS.md). The [TASKS review report](TASKS-REVIEW-REPORT.md) records conformance and count assessment.

Tasks include their own relevant tests, documentation and verification. Scope paths are expected ownership, not permission to modify bundled `.agents` inputs or unrelated files. Verification/evidence below is required future work, not a performed result. Planned npm scripts become usable only after the foundation implements and validates them; empty test collection is not passing gameplay evidence.

Implementation requires accepted TASKS, passing package QC, verified/published documentation integration, a human-selected task range and eligible-phase tracking readback. Activate only the eligible phase. Delivery milestones execute in PLAN order; the first task of a subsequent milestone also requires its predecessor's review and verified milestone closure. P2 additionally requires P1's verified published integration. A completed review task is not itself proof that its milestone closed or its phase integrated.

Each executable task closes with its verified result, evidence and initial owning checkbox in one task commit, then publication/readback and issue closure. Each delivery milestone's final review task covers code review separately from test execution, repairs blockers, retains a report/TODO section and refreshes HANDOFF in its own completion commit. Phase review tasks do the same across milestones. Only complete verified phases merge; partial ranges push and pause. The human selects continuation; no task here authorizes deployment, release/tag creation or further feature work.

## Phase 1 — Classic playable game

- [ ] Phase 1 — Classic playable game
    - [x] Milestone 1.1 — Falling pieces and locking
        - [x] T-001 — Establish the typed browser and verification foundation
            Scope: package/lockfile, root tool and TypeScript configurations, engine contract types, static HTML/entry and relevant ignore/setup documentation. Depends on: none; preparation integration, selected range and phase projection must be verified first.
            Acceptance: compatible dependencies and an isolated Chromium/Playwright-managed Firefox environment conforming to [BROWSER_DEV_POLICY](../../BROWSER_DEV_POLICY.md) are established; strict engine/app/test scopes, local static build/preview, test collection and credential-serving exclusions are configured without a custom global shell. The shell is real static output, not a claim of playable gameplay.
            Evidence: runner/browser versions and provenance, project/job-owned binary location, isolated profile/cache/download locations, consistent installation/run configuration and actual runner launch evidence; applicable type/build and static-browser smoke checks, synthetic sensitive-file refusal, output exclusions and accurate setup commands. Record missing/empty unit collection honestly until rule tests exist. Contracts: S-QUALITY, B-FAIL and layout tooling/output ownership.
        - [x] T-002 — Implement piece geometry and legal board placement
            Scope: engine geometry, placement and legal board-lock primitives plus focused tests; extend central types where required. Depends on: T-001.
            Acceptance: all seven geometries, in-place clockwise/counterclockwise rotation, O no-op, board boundaries/collisions and non-overwriting lock transformations match G-BOARD and the zero-offset P1 subset of G-ROTATE. Nonzero kicks remain scheduled in P2.
            Evidence: test-first geometry/placement/lock checks including all spawn cells, rotation cycles, boundaries and blocked candidates; engine-only type checking. Update module documentation with the ownership/coordinate contract.
        - [x] T-003 — Implement deterministic bag and preview supply
            Scope: sequence module, deterministic random helpers and focused engine tests. Depends on: T-002.
            Acceptance: canonical Fisher–Yates bags, six draws per bag, queue refill/selection and one non-consuming preview match G-SEQUENCE. Invalid/throwing random sources cannot publish partially updated sequence state.
            Evidence: controlled stream/bag/draw-count checks, refill boundaries, repeated preview reads and failure preservation. Document supplied-source and reset semantics without browser randomness in the engine.
        - [x] T-004 — Establish session actions and detached state projection
            Scope: session facade, transition calculations, snapshot/public exports and focused session tests. Depends on: T-002, T-003.
            Acceptance: ready/start/restart, legal left/right/soft-drop/in-place rotation, spawn/blocked spawn, supported action/time validation and detached classic-state reads are coordinated by one session owner. Modern feature behaviors remain explicitly incomplete under PLAN rather than exposed as working controls.
            Evidence: test-first public lifecycle/action/no-op/input checks, snapshot mutation isolation, no draws on reads and atomic start/spawn failure. Verify import has no browser/setup side effects. Trace S-API/S-DATA/S-DETERMINISM only for the delivered P1 subset.
        - [x] T-005 — Implement chronological gravity and full-interval normal locking
            Scope: session/transition timing and locked-board integration plus engine tests. Depends on: T-004.
            Acceptance: normal gravity, full G after landing, grounded-deadline preservation, airborne reset, chronological lock/spawn and remaining-time processing follow G-TIME. Failed downward requests do not lock immediately.
            Evidence: just-before/at-deadline and partitioned-time checks, movement around support edges, level-1 timing, invalid elapsed input and atomic random-dependent timed spawn failure. No frame count or browser clock is read inside the engine.
        - [x] T-006 — Present an engine session through Canvas and HTML
            Scope: Canvas/HTML views, initial styles/shell and minimal entry/controller composition needed for Start/Restart and snapshot display. Depends on: T-004, T-005.
            Acceptance: a real engine can start/restart through native controls, with board/active piece and ready/running/game-over feedback drawn from coherent snapshots. Presentation does not calculate legal placement or mutate live state; no inactive modern controls are advertised.
            Evidence: actual built-page control/render smoke checks, focused renderer/view checks as useful, type/build checks and readable labels. Record visual evidence limits; fake contexts alone cannot establish browser acceptance. This task delivers presentation wiring, not a second game loop.
        - [x] T-007 — Connect keyboard and elapsed time to the falling-piece prototype
            Scope: input/clock adapters and controller update flow with integration/browser checks. Depends on: T-001, T-005, T-006.
            Acceptance: basic classic keyboard commands and monotonic elapsed delivery drive the engine, with at most one basic loop across Start/Restart. Board updates show landing delay, lock and subsequent spawn or game over. Custom held-repeat and complete interruption behavior remain in 1.3.
            Evidence: controlled clock/input-to-engine tests, real-browser falling/movement/rotation/soft-drop smoke, build/type checks and the 1.1 demonstration. Document the prototype's incomplete line/progression and modern scope accurately.
        - [x] T-008 — Review, test and report milestone 1.1
            Depends on: T-001, T-002, T-003, T-004, T-005, T-006, T-007.
            Acceptance/evidence: review integrated source and dependencies, run 1.1 exits/regressions, repair blockers, retain demonstration/feedback evidence and a report with TODO dispositions. Refresh HANDOFF in this task's completion commit; publish/close the issue, then verify milestone closure before 1.2.
            Report: `docs/dev/reports/phases/1/1.1.md`.
    - [ ] Milestone 1.2 — Classic session progression
        - [ ] T-009 — Implement simultaneous row removal and compaction
            Scope: board operations and focused engine fixtures/tests. Depends on: T-008 and verified milestone 1.1 closure.
            Acceptance: identify/remove all full rows simultaneously, preserve surviving cell types/row order and insert empty top rows under G-PROGRESS. Keep scoring, spawning and live-state ownership outside board helpers.
            Evidence: test-first zero/one/two/three/four-row and nonadjacent-compaction cases; legal lock regressions and engine type checking. Document transformation inputs/results.
        - [ ] T-010 — Implement scoring, level and gravity progression
            Scope: progression module and focused numeric/event checks. Depends on: T-009.
            Acceptance: line awards use pre-clear level, successful soft-drop rows add points, totals saturate safely and level/G boundaries follow G-PROGRESS/G-TIME. Hard-drop scoring behavior is scheduled with its action in P2.
            Evidence: table/boundary checks including nine-to-ten lines, level-13 minimum G, zero clears and safe-integer saturation. No board or clock state is owned by progression helpers.
        - [ ] T-011 — Integrate clearing and progression into lock and spawn
            Scope: session/transition collaboration, snapshot totals and deterministic integration scenarios. Depends on: T-009, T-010.
            Acceptance: lock/clear/progression/select/spawn form the specified transition, blocked spawn preserves the resulting board/totals, and subsequent pieces use the new G. Earlier completed events survive a later failed transition within one advance.
            Evidence: line-clear/level/terminal replay checks, failed random-dependent spawn atomicity and partitioned-time regressions spanning lock/spawn. Maintain a coherent playable session without modifying accepted scoring rules.
        - [ ] T-012 — Complete the classic session lifecycle and API boundaries
            Scope: engine session/snapshot/public facade and necessary controller lifecycle consumption. Depends on: T-011.
            Acceptance: pause/resume/restart, recognized lifecycle no-ops, input/time errors, read isolation and visible terminal state conform for the delivered classic API. Paused time does not accrue; restarting resets gameplay while continuing the supplied random stream.
            Evidence: lifecycle/invalid-input/no-draw checks, snapshot mutation attempts and pause/restart integration with controlled adapters. Keep modern action/derived-data acceptance explicitly scheduled later.
        - [ ] T-013 — Integrate progression, preview and session controls in the interface
            Scope: Canvas/HTML view, classic controller bindings, styles and current user guidance. Depends on: T-012.
            Acceptance: score/lines/level, one next preview, pause/resume, game over and restart agree with the engine snapshot; enabled controls reflect lifecycle. A complete classic session can be played before modern work begins.
            Evidence: real-browser classic session/clear/level/pause/restart scenarios, native control activation without duplicate dispatch and 1.2 demonstration. Update supported controls/scope documentation.
        - [ ] T-014 — Review, test and report milestone 1.2
            Depends on: T-009, T-010, T-011, T-012, T-013.
            Acceptance/evidence: code review plus 1.2 exits and all relevant 1.1 regressions, including failure atomicity and the complete-session demonstration; repair blockers, retain report/TODOs and refresh HANDOFF with the task result. Verify issue/milestone closure before 1.3.
            Report: `docs/dev/reports/phases/1/1.2.md`.
    - [ ] Milestone 1.3 — Reliable keyboard and browser sessions
        - [ ] T-015 — Implement deterministic held-key repeat and event ordering
            Scope: input/controller repeat delivery and controlled-clock/browser checks. Depends on: T-014 and verified milestone 1.2 closure.
            Acceptance: suppress native repeated keydowns, implement specified horizontal/down intervals, resolve opposite horizontal keys and deliver elapsed time/deadlines before due repeat/physical commands under B-CONTROLS/B-TIME.
            Evidence: exact repeat boundaries, release/change-direction cases, same-timestamp deadline precedence and focus/modifier/native-default behavior. Verify the sequence independently of OS keyboard-repeat settings.
        - [ ] T-016 — Implement interruption, resume and stale-resource protection
            Scope: controller/input/clock lifecycle and integration/browser scenarios. Depends on: T-015.
            Acceptance: focus loss clears held input; blur/hiding and greater-than-1000-ms gaps pause without catch-up; restoration requires explicit resume/fresh keys. Restart/disposal cancels old resources and stale callbacks cannot affect new play.
            Evidence: exact gap threshold, pause/hidden/blur/restart and held-key interactions, repeated initialization/disposal and one effective listener/loop set. Distinguish region-focus loss from window interruption per B-TIME.
        - [ ] T-017 — Implement initialization and propagated engine-error handling
            Scope: entry/controller resource setup and HTML error feedback. Depends on: T-016.
            Acceptance: missing Canvas/context/required DOM capability and engine/random-source failures follow B-FAIL, with readable feedback, disabled/stopped play and partial cleanup. No silent recovery or retry hides invariant/transition failures.
            Evidence: actual browser capability-failure injection, controlled engine failure paths and resource cleanup checks. Preserve useful engine error categories and avoid test-only production state globals.
        - [ ] T-018 — Complete semantic controls and supported desktop presentation
            Scope: HTML/Canvas view, styles/shell and real-browser interface checks. Depends on: T-017.
            Acceptance: labels/status/focus, native button navigation, control reference, viewport layout and classic snapshot agreement satisfy B-VIEW/S-QUALITY. Modern controls remain unadvertised as usable until their delivery.
            Evidence: Chromium and Playwright-managed Firefox checks with actual versions/provenance, 1024×768 layout, Tab/focus behavior, state messages and Canvas/HTML agreement. Record visual/manual evidence and limits explicitly.
        - [ ] T-019 — Validate and document classic static-application delivery
            Scope: build/type/test configuration, output exclusions, README, user/development guides and validated AGENTS setup/navigation. Depends on: T-018.
            Acceptance: reproducible scripts/setup/browser provisioning and statically hostable output support the scoped classic game. Engine-only types exclude host globals; runtime assets omit development/credential content and require no gameplay network requests after loading.
            Evidence: clean-install or equivalent reproducibility check, declared type/unit/integration/browser/build commands, built-output smoke under a path, synthetic credential-file refusal and artifact inspection. Document actual tools/browsers and the P2 feature deferrals; required unavailable checks block completion.
        - [ ] T-020 — Review, test and report milestone 1.3
            Depends on: T-015, T-016, T-017, T-018, T-019.
            Acceptance/evidence: code review plus 1.3 reliability/failure/browser/distribution exits and classic regressions, blocker repairs, demonstration evidence and report/TODOs. Refresh HANDOFF in the task commit; verify issue/milestone closure before phase review.
            Report: `docs/dev/reports/phases/1/1.3.md`.
    - [ ] Milestone 1.4 — Phase 1 review and integration readiness
        - [ ] T-021 — Review, test and report phase 1
            Depends on: T-008, T-014, T-020, all delivery milestones 1.1–1.3 complete and their closures verified; not milestone 1.4 closure.
            Acceptance/evidence: code review separately from test execution, plus scoped classic engine/controller/browser/type/build acceptance, preserved dependencies, all PLAN P1 exits, explicit deferred modern contracts and aggregate milestone TODOs. Repair blockers; retain phase report and refreshed HANDOFF in this task's completion commit.
            Report: `docs/dev/reports/phases/1/PHASE-REPORT.md`. After verified publication/issue closure, close 1.4, then explicitly merge/verify/publish the complete phase under the authorized scope. Stop unless the human authorizes P2.

## Phase 2 — Modern play completion

- [ ] Phase 2 — Modern play completion
    - [ ] Milestone 2.1 — Landing and rotation assistance
        - [ ] T-022 — Implement bounded nonzero rotation kicks
            Scope: geometry/placement rotation candidate handling and focused checks. Depends on: T-021, verified published P1 integration, human-selected P2 range and P2 projection readback.
            Acceptance: use the exact ordered G-ROTATE offsets in both directions for each applicable piece, accept only the first legal candidate, retain O no-op and preserve placement when all candidates fail. Do not substitute an SRS table.
            Evidence: wall/floor/stack/top boundary configurations, candidate precedence, rejected rotations and grounded/airborne timing regressions. Preserve basic P1 rotation/placement behavior where no kick is needed.
        - [ ] T-023 — Implement shared landing and detached ghost projection
            Scope: placement/snapshot projection and relevant engine types/tests. Depends on: T-022.
            Acceptance: derive the greatest legal downward displacement from the existing collision rule; expose four ghost cells for every active piece, including coincident landing, without state/random/time changes. Complete the corresponding S-DATA projection contract.
            Evidence: all pieces and representative stacks/cavities, read isolation, repeated projections and no-overlap checks. No rendering-owned collision implementation is introduced.
        - [ ] T-024 — Integrate ghost visualization with engine snapshots
            Scope: Canvas renderer and corresponding browser presentation cases. Depends on: T-023.
            Acceptance: draw the supplied ghost distinctly and consistently with active/locked cells, avoid obscuring coincident active cells and preserve coherent updates across rotation, pause, restart and terminal state.
            Evidence: real-browser ghost position/style checks at boundaries and during session transitions, with classic rendering regressions and documented visual evidence limits. Renderer reads projection data rather than calculating landings.
        - [ ] T-025 — Implement delayed hard drop through engine and keyboard controls
            Scope: session/transitions, scoring use and Space input/controller route with focused/integrated checks. Depends on: T-024.
            Acceptance: hard drop uses the shared landing operation, awards two points per actual row and starts the selected full interval on positive-distance landing. Zero-distance repeats preserve deadline/score; movement/re-landing and deadline precedence conform to G-TIME.
            Evidence: ghost/drop equivalence, distance/scoring, just-before/at-deadline and repeated-request scenarios, airborne/grounded transitions and real Space-key integration. Preserve all prior classic/rotation/ghost checks and update supported-control guidance.
        - [ ] T-026 — Review, test and report milestone 2.1
            Depends on: T-022, T-023, T-024, T-025.
            Acceptance/evidence: code review of shared legality/landing ownership, 2.1 boundary/interaction acceptance, browser/control/scoring and classic regressions, blocker repair and demonstration/TODO report. Refresh HANDOFF with the task result; verify issue/milestone closure before 2.2.
            Report: `docs/dev/reports/phases/2/2.1.md`.
    - [ ] Milestone 2.2 — Hold and complete-game delivery
        - [ ] T-027 — Implement hold eligibility, exchange and atomic spawn behavior
            Scope: session/transition/sequence collaboration and engine acceptance scenarios. Depends on: T-026 and verified milestone 2.1 closure.
            Acceptance: empty hold consumes the next selection, occupied hold exchanges without queue consumption, incoming pieces reset spawn/timing, and hold is limited until a lock. Unavailable hold preserves every affected value/draw; hold-induced spawn/random failures match G-SEQUENCE/S-API.
            Evidence: both hold paths, rejection, re-enablement, reset geometry/timing, preview/draw accounting, blocked spawn and random-source atomicity with controlled streams.
        - [ ] T-028 — Integrate hold controls and availability presentation
            Scope: input/controller binding and Canvas/HTML held-piece/availability views. Depends on: T-027.
            Acceptance: C/either Shift trigger one hold per physical press, held/next/status feedback reflects the same snapshot and canHold is accurate across running, paused, terminal and restarted states. Complete the specified modern control surface.
            Evidence: actual keyboard/button-focus interactions as applicable, held/preview/ghost coherence, repeat suppression and pause/restart scenarios. Update the displayed control reference without changing accepted bindings.
        - [ ] T-029 — Verify and complete hold interactions across the full engine session
            Scope: focused cross-feature session/controller scenarios and any in-scope implementation repairs they require. Depends on: T-028.
            Acceptance: hold before/after drop or kick, grounded deadlines, queue refill, pause/resume, restart and terminal/failing transitions preserve the complete SPEC invariants. Complete remaining full-session API/snapshot acceptance through public legal-input replays and targeted internal transition checks.
            Evidence: deterministic and partitioned-time replays, sequence/draw preservation, snapshot isolation and earlier-event-versus-failed-transition boundaries. This is integrated capability work, not a substitute for the milestone code review.
        - [ ] T-030 — Complete full-game guidance and static delivery evidence
            Scope: user/development/README guidance, validated setup/check navigation and final output/browser integration as needed. Depends on: T-029.
            Acceptance: all specified controls/features and troubleshooting match the actual full game; production output remains local/static and excludes development/credential content. Record supported browser/tool versions and reproducible commands for the final scope.
            Evidence: full built-game browser smoke, declared type/unit/integration/build/browser checks, artifact/network exclusions and documentation/example/link verification. No Site deployment, release/tag creation or unsupported official-ruleset claim is introduced.
        - [ ] T-031 — Review, test and report milestone 2.2
            Depends on: T-027, T-028, T-029, T-030.
            Acceptance/evidence: code review of hold/queue/timing/API integration and final delivered guidance, complete 2.2 exits and relevant regressions, blockers repaired, demonstration evidence and report/TODOs retained. Refresh HANDOFF in the task commit; verify issue/milestone closure before phase review.
            Report: `docs/dev/reports/phases/2/2.2.md`.
    - [ ] Milestone 2.3 — Complete-version review and integration readiness
        - [ ] T-032 — Review, test and report the complete first version
            Depends on: T-026, T-031, delivery milestones 2.1–2.2 complete and closures verified, plus the published P1 baseline; not milestone 2.3 closure.
            Acceptance/evidence: review the full implementation separately from tests; verify all S-ACCEPT, G-ACCEPT, B-ACCEPT and PLAN P2 exits, including failure paths and browser/type/build evidence. Repair blockers and aggregate all unresolved eligible milestone/phase TODOs with IDs, impact, options and follow-up scope, or None when empty.
            Reports: `docs/dev/reports/phases/2/PHASE-REPORT.md` and `docs/dev/reports/IMPLEMENTATION-REPORT.md`, with the refreshed HANDOFF in this task's completion commit. After publication/issue closure, close 2.3 and explicitly merge/verify/publish the completed phase. Report full implementation completion and stop without unrequested release/deployment or further tasks.

## Current boundary

First human TASKS approval is recorded in DOCS_TASKS. Whole-package DOCS-009 QC and its verified publication/tracking/integration lifecycle complete preparation. Product tasks remain unchecked and no implementation phase has been activated. The final preparation checkpoint must establish the human's executable range before task execution.
