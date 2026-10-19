# Tetris delivery plan

Status: accepted; first approval is recorded in [DOCS_TASKS](DOCS_TASKS.md). This plan defines delivery strategy; it does not select an executable task range.

## Objective and governing inputs

Deliver the complete first version specified in [SPEC](SPEC.md), including its [game rules](spec/game-rules.md) and [browser session](spec/browser-session.md), using the accepted [ARCHITECTURE](ARCHITECTURE.md) and [DECOMPOSITION](DECOMPOSITION.md). The [SPEC review](SPEC-REVIEW-REPORT.md) establishes current document/design readiness; human acceptance is recorded in [DOCS_TASKS](DOCS_TASKS.md).

Two phases build on successive usable baselines. Phase 1 establishes a playable classic game. Phase 2 adds the remaining modern placement and hold capabilities and completes full-version acceptance. Both phases belong to the same first version; Phase 1 completion alone does not complete that version or authorize a release.

## Delivery boundaries and phase map

Stable phase IDs are `1` and `2`; P1/P2 are prose shorthand. Milestone IDs are `1.1`–`1.4` and `2.1`–`2.3`, with names as shown in their headings. TASKS must preserve these identities and parentage.

| Phase | Integrated outcome | Included scope | Explicitly scheduled later |
| --- | --- | --- | --- |
| P1 — Classic playable game | A statically built browser game with a complete classic session and reliable keyboard/session handling | Board/pieces, initial and next-piece supply using 7-bag, movement, in-place quarter-turn rotation, gravity, full-interval normal locking, clearing, score/levels, preview, start/pause/resume/restart, game over, browser focus/repeat/interruption behavior, errors and deterministic checks for delivered contracts | Hold, ghost projection/display, nonzero wall kicks, hard drop and their cross-feature contracts; these belong to P2 |
| P2 — Modern play completion | The complete specified first version on the verified P1 baseline | Bounded kick search, ghost and hard drop with the selected delay; hold and queue/spawn interactions; complete API/snapshot, browser presentation, static delivery documentation and integrated acceptance | No accepted first-version feature deferred beyond P2; excluded product capabilities remain excluded |

The Phase 1 piece supply uses the accepted 7-bag contract because the first playable path already requires active/next selection, randomness validation and repeatable sequence behavior. A temporary alternative generator would introduce an additional unaccepted production rule and a separate sequence/failure model. Hold remains deferred because it is a distinct interaction rather than a prerequisite for spawning or preview.

Other modern capabilities can be added after a useful classic game exists. Phase 1 rotation covers the zero-offset candidate only; nonzero kick acceptance is scheduled in P2, without changing the complete intended SPEC. Ghost and hard drop are not exposed as delivered features until their shared landing path is verified. Scope-based deferrals are not claims that their complete SPEC contracts already pass.

## Phase 1 — Classic playable game

Prerequisites: the complete preparation package is accepted, its QC passes, documentation is explicitly merged/verified/published to the default branch, and eligible-phase GitHub tracking is verified. No product implementation occurs during documentation preparation.

### 1.1 — Falling pieces and locking

Establish the smallest integrated falling-piece path: TypeScript/browser build and test foundation, piece geometry and legal placement, bag-based spawn/preview data, horizontal movement and in-place rotation, gravity, normal full-interval locking, and a basic Canvas/HTML controller that can start/restart a session. Establish deterministic engine seams and a production-build smoke check while the application is small. Verify random-source validation and atomic start/spawn/sequence failures when those transitions are first introduced; do not defer baseline failure safety to P2.

Demonstration: start a session, manipulate a falling piece, observe its landing delay and lock, then observe the next spawn or blocked-spawn game over. This is an early interaction prototype, not the complete classic game; line clearing/progression follows in 1.2.

Exit evidence: direct geometry/placement/sequence/timing checks, browser input-to-render smoke evidence, valid type/build output, scoped failure checks and no blocking implementation finding. The milestone's final code review/testing/report outcome must assess the integrated path. Demonstration feedback can inform a human decision to continue, amend the interaction, simplify or stop; it does not authorize autonomous steering.

### 1.2 — Classic session progression

Build on 1.1 with row clearing/compaction, scoring/levels, visible next preview and session feedback, pause/resume and complete restart/game-over behavior for the delivered classic controls. Keep state transitions and snapshots authoritative in the engine.

Demonstration: play a complete session, clear lines, cross a level boundary, pause/resume, reach game over and restart. This establishes the useful classic experience before modern placement/hold work.

Exit evidence: clearing and progression boundary checks, blocked spawn, lifecycle no-ops and valid/invalid input checks for the delivered API, independent snapshot reads, preservation of completed events before a later timed-transition failure, and integrated browser agreement. Review all 1.1 regressions and retain the milestone review/testing/report outcome.

### 1.3 — Reliable keyboard and browser sessions

Complete Phase 1's repeat/focus/timing delivery, automatic interruption/stall pause, stale callback protection, disposal/initialization cleanup and visible capability/error paths. Complete semantic controls, focus/status feedback, target-viewport layout, reproducible setup/check instructions and static-asset delivery for the scoped classic game. Explain the not-yet-delivered modern controls in its user-facing documentation rather than exposing nonfunctional controls.

Demonstration: hold/release directional keys, switch focus, pause/hide/restore, restart repeatedly and exercise initialization failure. Verify classic gameplay remains usable in each supported browser.

Exit evidence: controlled-clock/controller integration checks, real-browser keyboard/focus/Canvas/HTML checks, capability and engine-error handling, all scoped regression/type/build checks, actual tested browser versions and a static production-build smoke check. Finish with milestone code review/testing/report and resolved blockers.

### 1.4 — Phase 1 review and integration readiness

This dedicated phase review milestone contains exactly one phase code review/testing/report outcome. It starts only after 1.1–1.3 and their review issues/milestones are complete and closed when tracking is enabled.

Review the combined classic game, responsibility/dependency boundaries, full normal lock delay, deterministic/partitioned time behavior, sequence/preview stability, lifecycle/resource cleanup, usability evidence and scoped SPEC coverage. Run relevant regressions across the delivered browser/engine paths and record omitted modern contracts explicitly.

Phase exit: a complete usable classic session, all included contracts verified, no blocking defect/contract violation, documentation matching the scoped implementation, review evidence and TODO dispositions retained, and every phase issue/milestone closure verified. Explicitly merge the complete phase, verify the merged state and publish the default branch before authorized P2 activation. A partial requested range pushes/pauses without merging the incomplete phase.

## Phase 2 — Modern play completion

Prerequisites: P1's full review, hosted lifecycle and verified published integration are complete; the human has authorized the P2 execution range; P2's own objects and associations are verified before its first task.

### 2.1 — Landing and rotation assistance

Extend the accepted classic path with nonzero bounded kick search, one shared landing calculation, ghost projection/rendering and hard drop. Integrate their input, scoring, snapshot and timer behavior together. Hard drop must preserve the selected full gravity-interval delay, and a repeated zero-distance request must not postpone locking.

Demonstration: rotate against walls/stacks, compare the ghost with hard-drop landing, reposition after a hard drop and observe the original grounded deadline. Use real boundary configurations rather than relying only on empty-board play.

Exit evidence: rotation/kick candidates and rejection, ghost read isolation, landing equivalence, hard-drop distance/scoring, deadline and airborne/re-landing interactions, browser controls/rendering and classic regressions. Milestone review covers the shared rule ownership and integration, with blockers repaired and report evidence retained.

### 2.2 — Hold and complete-game delivery

Add hold once per active piece, empty-hold selection and occupied-hold exchange, spawn reset/failure handling, availability feedback and sequence/preview preservation. Verify interactions with rotation, ghost, drop, locking, pause and restart. Complete every previously scheduled modern API/snapshot contract and update user/setup/check documentation for the full game and statically built output.

Demonstration: reserve a piece, reject a repeated hold, lock another piece, exchange the held piece and compare its reset spawn/ghost/preview. Include a hold-induced blocked spawn and random-dependent failure without partial state publication.

Exit evidence: controlled sequence/draw tests, hold eligibility and no-op preservation, atomic transition failures, cross-feature scenarios, full controls/status/viewport behavior in the supported browsers, type/build checks and static output smoke evidence. Retain review/testing/report evidence and resolve all first-version contract blockers. This is a bounded hold/delivery milestone, not an open cleanup backlog.

### 2.3 — Complete-version review and integration readiness

This dedicated phase review milestone contains exactly one phase code review/testing/report outcome, after 2.1–2.2 and their hosted closures. Review the complete engine/controller/presentation implementation separately from test execution; verify all S-ACCEPT outcomes and applicable game/browser acceptance groups, including failures and cross-feature timing/sequence interactions.

Phase exit: every accepted first-version capability has direct evidence; all required browser/engine/integration/type/build checks pass; supported setup and controls match the product; no blocking bug or SPEC/PLAN violation remains; and all issues/milestones have verified closure. Aggregate unresolved eligible non-critical TODOs from both phases in the final implementation report, preserving IDs, evidence, impact, options and follow-up scope; write None when empty.

Explicitly merge the complete phase, verify the merged result and publish the default branch. Full-version implementation completion does not create a GitHub release/tag, deploy a Site or select further work. Any later publication request has its own authorized scope.

## Contract coverage and dependencies

| Contract group | First delivery route | Completion / integration route |
| --- | --- | --- |
| G-BOARD and basic G-ROTATE/G-MOVE/G-TIME | 1.1 falling/placement/normal locking | 1.2–1.4 classic regression; 2.1 completes kicks, ghost and hard-drop interactions |
| G-SEQUENCE | 1.1 bags and active/next supply; 1.2 preview | 2.2 hold/exchange, rejected hold and draw preservation |
| G-PROGRESS | 1.2 clear/score/level and terminal outcomes | 2.1 hard-drop points; 2.2 hold spawn failure; final 2.3 acceptance |
| S-API, S-DATA and S-DETERMINISM | 1.1 foundation and sequence/start failure atomicity; 1.2 classic transition/snapshot and multi-event failure coverage; 1.3 delivered failures/resources | 2.1–2.2 extend modern commands/derived data and hold/drop failure atomicity; 2.3 full conformance |
| B-CONTROLS, B-TIME | 1.1 input/time path; 1.2 session controls; 1.3 repeat/focus/stall/resource completion | 2.1 drop/rotation and 2.2 hold input interactions; 2.3 combined deadline ordering |
| B-VIEW, B-FAIL and S-QUALITY | 1.1 rendering/build; 1.2 status/preview; 1.3 semantic/failure/browser/static delivery | 2.1 ghost, 2.2 hold/full documentation and production output; regression at every phase exit |
| S-SCOPE, S-ACCEPT, G-ACCEPT and B-ACCEPT | 1.4 confirms only the included classic subset | 2.3 verifies the complete specified first version |

Milestones within each phase are ordered as listed. 1.4 depends on all P1 delivery milestones; 2.1 depends on published P1 integration, 2.2 on 2.1, and 2.3 on both P2 delivery milestones. The final review milestone never depends on its own closure. Detailed task dependencies belong to TASKS.

## Common verification, persistence and decision gates

Each delivery milestone ends with its own code review, focused/regression testing, blocker repair and report outcome. The dedicated phase review is additional cross-milestone review, not a substitute for the final delivery milestone's review. Reports refresh the workflow handoff at their required boundaries. Passing tests alone do not establish code-review completion.

Test-first development uses the explicit engine/adapter seams; browser checks validate actual input/render/lifecycle behavior. Establish browser provisioning before relying on its checks. An unavailable required browser/check is a blocker, not a silently reduced acceptance scope. Dependency selection and concrete commands must be validated during implementation; layout will allocate source, tests, configuration, documentation and generated output.

Publish each verified task result with its evidence and initial checklist completion, verify remote containment and then close its issue. Close delivery milestones after every constituent issue/review and exit passes; run/close the dedicated phase review afterward. Only a complete verified phase integrates. The human chooses executable ranges and whether to continue, amend, simplify or stop at a checkpoint; demonstration/review outcomes do not expand that range.

Risks requiring direct evidence are deadline/reset correctness, queue/hold draw consumption, ghost/drop equivalence, exception atomicity, repeated-input ordering, focus/stall behavior and stale browser resources. Their checks belong to the milestones introducing the behavior and subsequent regression; none is deferred solely to final testing. Fix contract violations before completion. Preserve only eligible non-critical code findings as documented TODOs under the existing SDD lifecycle.

## Preparation handoff and open decisions

The strategy introduces no new product requirement. Implementation details, dependency versions and physical allocation remain downstream. PLAN first approval precedes layout authoring; combined PLAN/layout QC and separate layout approval precede TASKS. TASKS then defines bounded executable work and mandatory review tasks. Whole-package QC and published documentation integration precede the final preimplementation checkpoint and phase activation.

The [PLAN review report](PLAN-REVIEW-REPORT.md) assesses strategy against SPEC, phase scope/counts and deferred layout readiness. No new layout, task list, implementation branch or implementation hosted object is created by this proposal.
