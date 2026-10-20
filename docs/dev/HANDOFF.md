# Project handoff

Checkpoint: accepted browser documentation amendment and scoped QC complete; publication/integration pending.

## Workflow and governing state

- Owner/stage: sdd-manage, scoped project-document revision; sdd-specify, sdd-plan and sdd-tasks rechecked their affected contracts. [Package QC](DOCS-QC-REPORT.md) Revision 2 passes.
- Governing inputs: [PROJECT](PROJECT.md), [ARCHITECTURE](ARCHITECTURE.md), [DECOMPOSITION](DECOMPOSITION.md), [SPEC](SPEC.md) and children, [PLAN](PLAN.md), [layout](layout.md), [TASKS](TASKS.md) and [BROWSER_DEV_POLICY](../../BROWSER_DEV_POLICY.md).
- Instructions: root [AGENTS](../../AGENTS.md), repository-bundled [SDD Manager](../../.agents/plugins/sdd-manager/PLUGIN.md) 0.15.1. Standard reporting; publish/read back each commit.
- Initial preparation was integrated in `5ed75070d968081d2c8cbc73ffca004a920fddc7`; [DOCS_TASKS](DOCS_TASKS.md) retains its nine completed tasks and original approvals. The latest accepted document delta is recorded in the appended QC revisions.

## Accepted scope and stopping boundary

- On 2026-10-20 the human directed adoption of Chromium as primary and Playwright-managed Firefox as the second target, coordinated SPEC/layout/T-018 updates, central-policy reference and isolated provisioning evidence in T-001, and rechecking affected QC conclusions without duplicating the policy.
- Browser selection and evidence are updated; the root policy remains the canonical source of detailed setup/isolation rules. No browser installation or product verification was performed during document revision.
- The first version remains TypeScript browser Tetris with classic gameplay, hold, ghost, 7-bag, bounded custom wall kicks and hard drop; normal and hard-drop locking wait a full current gravity interval.
- No implementation range is selected. All 32 product tasks are unchecked, and this amendment activates no phase, hosted tracking or product implementation. The user's prior deletions of open issues/milestones do not authorize recreating them here.
- Authorized work ends after verified documentation publication/integration and reporting the result. Further implementation requires a selected executable range.

## Branch and provenance

- Scoped preparation identity: `001_b488d89-browser-policy`.
- Working branch: `design-docs/001_b488d89-browser-policy`; creation parent/integration target: `main`.
- Full branch-off baseline: `b488d89e156cd333a73d061a26fd4053b0b42527`, matching refreshed origin/main at entry. No unrelated pending changes or suspended parent workflow.
- Scope: SPEC, layout, T-001/T-018 within TASKS, affected SPEC/PLAN/TASKS/package QC reports and this handoff. Policy, gameplay rules, PLAN hierarchy, original approvals and bundled plugin are retained.

## Pending transitions

1. Commit the coherent amendment and QC evidence, push the scoped preparation branch through the supervised publication entry, and verify exact remote state.
2. Integrate the accepted complete documentation boundary into refreshed main with an explicit two-parent merge, reconcile this handoff to main's completed amendment/range-selection boundary, verify merged documents and publish/read back main.
3. Report the amended browser contract and document QC result. Stop before product execution or hosted-object recreation.

Recover later publication/integration effects from Git before repeating them. This snapshot cannot prove its own subsequent commit, push or merge. No credential material belongs in tracked records.
