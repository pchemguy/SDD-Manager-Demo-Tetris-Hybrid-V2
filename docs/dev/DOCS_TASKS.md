# Main documentation tasks

This list owns main documentation preparation. Product implementation tasks belong to `TASKS.md`. Complete these tasks in order, reusing valid existing artifacts and completion evidence when resuming.

## Completion and tracking

Each document task and its issue track development through the document’s first human approval. After that approval, mark the task complete. Later document revisions leave this task complete and its issue closed. An explicit preapproval may satisfy the human checkpoint within its stated scope; it does not waive QC or publication. The user may preapprove future checkpoints at any time.

Include the checked task in `DOCS_TASKS.md` in the same commit that submits the approved document and records its first approval. If the reviewed document was already published unchanged, retain that exact document state in the acceptance commit; do not rewrite it merely to create a diff. Push and verify remote containment before closing the corresponding issue or advancing.

When tracking is enabled, each `DOCS-*` task maps to one issue in the `sdd-docs-main` milestone. Verify the milestone, all nine issues and their associations before modifying the repository. Reuse their stable identities on resume. Close issues only after the corresponding completion commit is published and verified. With tracking disabled, apply the same local task and checkpoint requirements.

The running SDD Manager package's `assets/DOCS_TRACKING_TEMPLATE.json` supplies the fixed milestone title/description and all nine issue definitions, including dependencies. Use those definitions through sdd-forge; this Markdown remains the local completion owner. Neither asset records provider handles or proves runtime eligibility. Resolve source/content conflicts before projection rather than replacing this list or inventing issue text.

## Preparation

- [x] DOCS-001 — Initialize the repository for SDD Manager.
    - Inspect root `AI_DISCLOSURE.md`, `SDD-MANAGER.md`, `AGENTS.md` and `SKILL_DISCOVERY_PROTOCOL.md` before copying. Preserve existing files and copy only missing files from the bundled templates.
    - Record which root files existed and which were copied; verify copied bytes and preserved content.
    - Establish/reconcile `docs/dev/HANDOFF.md` as generated checkpoint metadata, outside the four-file presence/copy test. Include it with this task's completion and initialization result, push and verify; then close and verify its issue when tracking is enabled.
    - Report initialization. If some but not all of the four root files existed initially, warn with the retained/copied filenames and end the turn before document work, unless the user explicitly preapproved continuation through this checkpoint. If none or all existed, continue without an additional approval pause.
- [x] DOCS-002 — Prepare and accept PROJECT.
    - Establish the project brief: purpose, users, outcomes, scope, non-goals and consequential constraints; identify material assumptions and unresolved decisions.
    - Review the proposal with the human and complete its acceptance checkpoint.
- [x] DOCS-003 — Prepare and accept ARCHITECTURE.
    - Define major system blocks, relationships, dependency direction and consequential structural decisions from the accepted brief.
    - Review the proposal with the human and complete its acceptance checkpoint.
- [x] DOCS-004 — Prepare and accept DECOMPOSITION.
    - Define component responsibilities, collaboration, ownership and design-level interface boundaries consistently with ARCHITECTURE.
    - Review the proposal with the human and complete its acceptance checkpoint.
- [x] DOCS-005 — Prepare and accept SPEC.
    - Specify observable behavior, interfaces, error contracts, required qualities and acceptance conditions from the accepted design.
    - Complete required SPEC QC and its human acceptance checkpoint.
- [x] DOCS-006 — Prepare and accept PLAN.
    - Define delivery phases, milestones, dependencies and exit conditions against SPEC.
    - Complete PLAN QC, then present PLAN for human approval.
- [ ] DOCS-007 — Prepare and accept layout.
    - Allocate source, tests, documentation and artifacts to physical paths consistently with the accepted design and PLAN.
    - Review layout against the design and PLAN, update the PLAN review report, then present layout for human approval.
- [ ] DOCS-008 — Prepare and accept TASKS.
    - Derive executable tasks, dependencies and required milestone/phase review units from accepted SPEC, PLAN and layout.
    - Complete required task-list QC and its human acceptance checkpoint. Do not start implementation or project implementation-phase objects yet.
- [ ] DOCS-009 — Pass documentation package QC.
    - Require all preceding tasks complete and their issue closures verified when tracking is enabled.
    - Review the entire document set, necessary children and QC reports for consistency, traceability, delivery readiness and unresolved blockers. Check initialization, orientation, human acceptance and publication evidence.
    - Resolve blockers through their owning documents and recheck affected readiness and acceptance. Retain the package QC report with the preparation documents.
    - Refresh `docs/dev/HANDOFF.md` with the package outcome, evidence and next boundary, retaining later integration/milestone effects as requiring confirmation. Commit the handoff, passing report and this task marked complete together, push and verify; then close and verify the final QC issue.

## Integration and final checkpoint

After DOCS-009, explicitly merge the verified documentation branch into the actual default branch. Verify the merged result, commit, push and confirm remote containment. Then close and verify the `sdd-docs-main` milestone when tracking is enabled. Failed or uncertain integration or milestone closure remains pending; checked tasks alone do not complete preparation.

Report the package QC result, published merge and tracking status. Confirm the final checkpoint before implementation and obtain the authorized implementation range. Proceed without another pause only when explicit preapproval covers that checkpoint and implementation scope is already established.

On interruption, recover the earliest unmet operation from documents, acceptance decisions, Git and hosted evidence. Preserve a pending mixed-initialization decision. Do not regenerate the list, infer acceptance from file presence or repeat completed work. Honor explicit narrower scope, local-only or no-merge instructions and report any remaining completion steps.

## Preparation evidence

### DOCS-001 initialization — 2026-10-19

- All four root destinations existed at entry: `AI_DISCLOSURE.md`, `SDD-MANAGER.md`, `AGENTS.md` and `SKILL_DISCOVERY_PROTOCOL.md`. Retained all four byte for byte from baseline `6baec3f9c8a652bc4850d27998bbc97db2c99bd9`; copied none.
- Verified preserved bytes against the baseline Git blobs. No mixed-presence continuation pause applies.
- Repository discovery loaded the standalone Technical Writing Assistant and SDD Manager's manifest, plugin entry and all 15 skill entries; findings were reported in chat.
- Tracking is enabled by root `AGENTS.md` for documentation and implementation. Before repository writes, created and read back `sdd-docs-main` (milestone 1) and all nine predefined DOCS issues (#1–#9), verifying exact standard content and milestone associations.
- Established `design-docs/main` from `main` at the baseline above. Added token exclusion while preserving the existing ignore rule. Created this checklist and the initialization HANDOFF together.
- Initialization completion requires publication/readback of this commit, followed by evidence-based closure/readback of issue #1. Reconcile Git and hosted state before continuation.

### Confirmed project direction — 2026-10-19

The user requested a classic browser-based Tetris game. The proposed TypeScript baseline includes a 10×20 board, seven tetrominoes, movement, rotation, gravity, soft drop, line clearing, scoring, levels, next-piece preview, pause, restart, game over, keyboard controls and automated gameplay tests. The user replied to also include hold, ghost piece, 7-bag randomization, wall kicks and hard drop. All five enhancements belong to the first-version scope.

New development documents retain individual review checkpoints under `AGENTS.md`. No future-checkpoint preapproval or executable implementation range has been granted.

### DOCS-002 PROJECT proposal — 2026-10-19

- Published initialization commit: `0f695a4c75f131ab92694feda44b9a8a03423336`; exact remote branch readback matched. DOCS-001 issue #1 was closed and read back as completed before PROJECT authoring.
- Proposed [PROJECT.md](PROJECT.md) covers the classic baseline, all five requested modern features, intended use, quality goals, product defaults and deferred specification choices. README links the brief, preparation, checkpoint, usage notice and disclosure without claiming a playable implementation.
- Owner review checked the brief against the user request and clarification, first-version feature coverage, explicit proposed defaults, document boundaries and unresolved rule decisions. No game behavior has been implemented or tested.
- First human approval is pending. DOCS-002 remains unchecked and issue #2 remains open. Do not begin ARCHITECTURE until the presented PROJECT state is accepted.
- Publication recovery for initialization found that Git supplies `GIT_DIR` to credential helpers, which the bundled helper rejects. A temporary external wrapper removed inherited repository-location variables before invoking the same protected helper; push and exact remote readback succeeded. Repository plugin files were not modified.

### DOCS-002 first approval — 2026-10-19

- Human decision: “approval of new PROJECT.” This accepts the complete PROJECT proposal, including its product defaults, presented at commit `1cdfb44c0eff8a6183a818ec1484da7310ad69cd`.
- Accepted PROJECT blob: `55aa3d452b2efeedf8f77239a4f73f0109984885`. Retain the reviewed document bytes unchanged in this approval commit; its proposal wording identifies the presented artifact, while this record establishes first approval.
- Confirmed the remote design-docs/main ref matched the proposal commit during the read-only diagnostics. Owner checks for scope, feature coverage, document boundaries, heading spacing and local links were recorded with the proposal.
- DOCS-002 is complete. Publish/read back this approval commit, then close/read back issue #2 before ARCHITECTURE authoring. Architecture has its own human checkpoint; future documents and implementation remain unapproved.

### DOCS-003 ARCHITECTURE proposal — 2026-10-19

- PROJECT first approval was published in `f7a9001452bcf44f840061a69729b26096919c3a`, with exact remote ref readback. Issue #2 was closed and read back as completed before architecture authoring.
- Proposed [ARCHITECTURE.md](ARCHITECTURE.md) defines game-engine, browser-controller and presentation responsibilities, one authoritative gameplay state, directed dependencies, explicit time/randomness boundaries, Canvas/HTML rendering and verification seams.
- Owner review checked accepted PROJECT coverage, one owner per major responsibility, acyclic dependency direction, modern-feature consistency, alternatives/tradeoffs and separation from detailed component, behavioral, delivery and physical-layout contracts. Exact gameplay rules remain for SPEC.
- Checked Markdown heading separation, local links, whitespace and the unchanged accepted PROJECT blob. No product code or product tests were created or run.
- First human approval is pending. DOCS-003 remains unchecked and issue #3 remains open. Do not begin DECOMPOSITION until the presented ARCHITECTURE is accepted.

### DOCS-003 first approval — 2026-10-19

- Human decision: “ok” in response to the ARCHITECTURE review checkpoint. Accepted proposal commit: `49b0de9628493776ac68beba8a7498114807df25`; accepted ARCHITECTURE blob: `6a1722636541517c9ba9454dae1acbb80114173d`. Retain the reviewed bytes unchanged.
- Acceptance covers the deterministic engine, browser controller, Canvas/HTML presentation and explicit time/randomness boundaries. The published proposal's source and document checks were verified; its remote branch readback matched.
- DOCS-003 is complete. Publish/read back this approval commit, then close/read back issue #3 before DECOMPOSITION authoring. DECOMPOSITION and later roots retain their individual checkpoints; no implementation range is selected.

### DOCS-004 DECOMPOSITION proposal — 2026-10-19

- ARCHITECTURE approval was published in `a797ebdb223363eb509ac4fea2dcf16e318b8bd9`, with exact remote branch readback. Issue #3 was closed and read back as completed before decomposition authoring.
- Proposed [DECOMPOSITION.md](DECOMPOSITION.md) refines the accepted three-block architecture into cohesive logical components, state/resource ownership, provisional interfaces, principal collaborations, lifecycle/failure boundaries and verification seams.
- Owner review checked coverage of classic and modern mechanics, single session-state ownership, shared landing calculations, acyclic dependencies, explicit adapter boundaries, snapshot isolation and clear deferral of exact rules to SPEC. No physical layout, delivery order or task checklist was introduced.
- Document checks verified local links, heading separation, whitespace, unchanged accepted PROJECT/ARCHITECTURE bytes and DOCS-004's pending approval state. No game code or product tests were created or run.
- First human approval is pending. DOCS-004 remains unchecked and issue #4 remains open. Do not begin SPEC until the presented DECOMPOSITION is accepted.

### DOCS-004 first approval — 2026-10-19

- Human decision: “ok” in response to the DECOMPOSITION review checkpoint. Accepted proposal commit: `3948e92ee152d1941aacf2d644927d28e779fc03`; accepted DECOMPOSITION blob: `5d7b6f56fab0ea2560a3ab75316421aead22db81`. Retain the reviewed bytes unchanged.
- Approval covers component responsibilities, state/resource ownership, provisional interfaces, collaboration and verification boundaries. Exact gameplay contracts were explicitly deferred to SPEC.
- DOCS-004 is complete. Publish/read back this approval commit, then close/read back issue #4 before SPEC authoring. SPEC has a separate human checkpoint; its consequential gameplay decisions must be resolved before relying on them. No implementation range is selected.

### DOCS-005 rule decision and SPEC proposal — 2026-10-19

- DECOMPOSITION first approval was published in `e9c7e88229cda233bc250900a4e5d67db85a3974`, with exact remote branch readback; issue #4 was closed and read back as completed before SPEC authoring.
- In the locking-policy question, the user selected “Full gravity interval (Recommended)”: normal landings and hard drops allow repositioning for one full current gravity interval before locking. This is an explicit rule decision, not first approval of the uncreated SPEC.
- Proposed SPEC and its game/browser children define the complete first-version behavior. Timer-reset details, bounded non-SRS kicks, controls, scoring, repeat/focus/stall rules and engine contracts are presented for confirmation at the SPEC checkpoint. They are not claimed to be previously approved requirements.
- Keep DOCS-005 unchecked and issue #5 open until required SPEC/design QC and first human approval are established. PLAN authoring remains held.
- Completed SPEC/design QC in [SPEC-REVIEW-REPORT.md](SPEC-REVIEW-REPORT.md), retaining three initial findings and Revision 1 corrections/rechecks with exact source identities. Technical gate is Ready for the proposed scope; first human approval remains pending. Source/link/style and inline specification-data sanity checks are document evidence, not gameplay tests.

### DOCS-005 first approval — 2026-10-19

- Human decision: “k” in response to the SPEC checkpoint. Accepted proposal commit: `11089cfc408648a3256df9b51713d5080fa6b9b6`, covering SPEC, both game/browser children and its retained QC report. This accepts the detailed rules presented there, including bounded non-SRS kicks, controls, scoring, lock-timer reset behavior and browser session contracts.
- Retain the reviewed SPEC and child bytes unchanged. The reviewed SHA-256 identities remain those in SPEC-REVIEW-REPORT Revision 1; technical QC has no unresolved finding. Update the report's current human-decision metadata without changing its technical review history.
- DOCS-005 is complete. Publish/read back this approval commit, then close/read back issue #5 before PLAN authoring. PLAN and layout retain separate checkpoints; TASKS and implementation are not yet authorized for execution.

### DOCS-006 PLAN proposal — 2026-10-19

- SPEC approval was published in `14bc2a583d0590d086d71538368d88bbe218c794`, with exact remote ref readback; issue #5 was closed and read back as completed before PLAN authoring.
- Proposed PLAN delivers a usable classic game in P1 and the remaining modern placement/hold behavior in P2, with explicit scoped coverage and complete first-version acceptance. It reserves milestone reviews and one dedicated final review milestone per phase.
- PLAN first approval remains pending. DOCS-006 stays unchecked and issue #6 open. Do not create layout until PLAN is accepted; combined PLAN/layout QC and separate layout approval remain required before TASKS.
- Completed strategy-only QC in [PLAN-REVIEW-REPORT.md](PLAN-REVIEW-REPORT.md). Retained two initial findings and Revision 1 corrections, exact source identities, full contract routes and 3/2 delivery-milestone count assessment with separate phase-review milestones. No technical strategy blocker remains; physical layout and TASKS readiness are pending.

### DOCS-006 first approval — 2026-10-19

- Human decision: “k” in response to the PLAN checkpoint. Accepted proposal commit: `d065dd8ad1b9363e85ff25d2d18450eb611dc2be`; accepted PLAN blob: `0396bf53db6968bb4303a857e71a0ca46e716505`. Retain the reviewed strategy bytes unchanged.
- Acceptance covers the two-phase first-version strategy, stable phase/milestone identities, delivery/review boundaries, dependencies and exits. PLAN-REVIEW-REPORT retains strategy QC with no unresolved finding; layout/placement coverage is still pending.
- DOCS-006 is complete. Publish/read back this approval commit, then close/read back issue #6 before layout authoring. Combined PLAN/layout QC and separate layout first approval are required before TASKS.
