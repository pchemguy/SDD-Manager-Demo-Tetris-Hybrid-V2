# Task derivation

Derive the complete `docs/dev/TASKS.md` from the accepted design, SPEC, PLAN, and layout. For an active feature workflow, derive `docs/dev/FEATURE-TASKS.md` from its design, FEATURE-SPEC, FEATURE-PLAN when present, main governing documents, current TASKS, and layout. Feature-delta reconciliation of existing task lists belongs to **sdd-integrate-feature**; direct human-commanded checkpoint amendments belong to **sdd-steer**. Preserve PLAN's phase and milestone boundaries and meaningful exit gates. The main hierarchy covers the complete intended work; FEATURE-TASKS covers only the feature delta. Both show progress and the next stopping point. Name the feature objective and affected main requirements and tasks. Give feature work new task IDs, including changes to a completed task's behavior; link to existing TASKS IDs for affected work or prerequisites rather than duplicating their items. Preserve existing phase and milestone IDs and names, or use proposed IDs and names from the accepted FEATURE-PLAN for new groups. Parent checkboxes in FEATURE-TASKS measure only the feature's work in that group, not the entire parent in TASKS.

## Form tasks

1. Trace each milestone outcome to the relevant component boundaries, behavioral contracts, physical owners, integration points, and exit checks. Identify prerequisites and work that must be coordinated across components.
2. Split work into coherent increments that can be implemented, reviewed, and verified without leaving dependent behavior incoherent. Derive bounded work within PLAN's meaningful capability increments; not every task must independently deliver user-visible functionality. Prefer one code module or a few closely related modules, plus their tests and documentation, where feasible. Small module scope does not substitute for bounded behavioral growth. An interface change may need a compatibility step and subsequent consumer changes. Avoid tasks that are merely a single keystroke or an entire subsystem.
3. Give each task a project-wide unique stable ID, outcome, expected edit scope, prerequisite task IDs where needed, and concrete verification or acceptance evidence. Point to owning SPEC and design sections when the connection would otherwise be unclear. The task can identify likely paths from layout but must not make an exhaustive speculative file list.
4. Put meaningful integration, failure-path, documentation, packaging, and milestone-exit work into the breakdown. Reach integrated acceptance and relevant regression evidence within each capability increment; preserve the usable path and account for required failure remediation before dependent growth. Include work needed to gather the milestone's functional/usability decision evidence without requiring a usability trial per task. Do not make every SPEC sentence a separate task or repeat all acceptance wording. Surface an unresolved choice as a blocker with its owning document rather than settling it in a task.
5. Apply the [backend object lifecycle](../../sdd-conventions/references/backend-object-lifecycle.md): make the last task of every delivery milestone an explicit milestone code review/testing/report task, dependent on its delivery tasks. The final milestone of each phase contains exactly one phase code review/testing/report task dependent on completion/closure of all delivery milestones. Give review tasks stable IDs, actual review scope, required check/repair/report evidence and report links at the workflow-specific paths. The last phase review includes the final implementation report/TODO aggregation when the full list completes. If the accepted PLAN lacks these boundaries, return the needed PLAN amendment rather than inventing strategy in TASKS.
6. Check the critical path and phase/milestone totals. Verify that every intended milestone has executable coverage and that its exit evidence can be gathered. TASKS does not prescribe a test implementation for every contract; later verification and implementation workflows choose and run checks.

## Checklist form

Use a `##` Markdown heading for each phase and a checkbox item directly beneath it for the same phase. The heading provides navigation; the checkbox records completion. Use one checkbox item for each phase, milestone, and task. Indent each child **exactly four spaces** beyond its parent; do not use tabs or replace milestone or phase check items with headings. Keep task details within or immediately beneath their own item, indented to remain attached to it. For example:

```markdown
## Phase 1 — Streaming sources

- [ ] Phase 1 — Streaming sources
    - [ ] Milestone 1.1 — Plain stream foundation
        - [ ] T-001 — Define stream ownership and close behavior
            Scope: stream module and focused tests. Depends on: none.
            Evidence: close and early-exit behavior verified against SPEC.
        - [ ] T-002 — Integrate the public stream API
            Scope: public API and integration checks. Depends on: T-001.
            Evidence: package-level usage and error behavior verified.
        - [ ] T-003 — Review, test and report milestone 1.1
            Depends on: T-001, T-002. Evidence: code review, required tests, blocker repairs and committed report.
            Report: docs/dev/reports/phases/1/1.1.md.
    - [ ] Milestone 1.2 — Phase review
        - [ ] T-004 — Review, test and report phase 1
            Depends on: milestone 1.1 completion/closure. Evidence: phase review, exits, repairs and committed report.
            Report: docs/dev/reports/phases/1/PHASE-REPORT.md.

```

Stable IDs may follow the project's existing convention; otherwise use monotonic task IDs such as `T-001`. Do not reuse or renumber an ID because a task is inserted or removed. Keep parent IDs and names in TASKS consistent with PLAN, and in FEATURE-TASKS with the active feature plan and unaffected main hierarchy. Resolve collisions across the lists before selection or hosted projection. The owning task list supplies task and parent names for hosted projection; do not project conflicting names for one stable ID. Use [progress review](progress-review.md) to assess existing completion evidence; the initial breakdown is unchecked unless verified prior completion is established. **sdd-implement** owns completion updates during execution. Apply the same checklist form and indentation to FEATURE-TASKS. Keep feature progress there until **sdd-integrate-feature** incorporates it into TASKS; do not insert its tasks into TASKS merely to select or implement them.

## Required preparation review

Require current PLAN/SPEC QC evidence before deriving dependent work. After generation, run [conformance review](conformance-review.md) before implementation or hosted projection: inspect PLAN coverage and semantic scope, count delivery tasks separately from mandatory review tasks, resolve confirmed issues, append recheck evidence and persist the adjacent root report with the list. This is authoring work, not a new administrative implementation milestone or task. Do not use completion/progress review as proof of generation quality.
