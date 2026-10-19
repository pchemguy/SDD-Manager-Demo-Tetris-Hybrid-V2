# Main documentation preparation

Use this procedure for greenfield projects and resumed incomplete main documentation preparation, including direct calls to a document owner. It owns preparation task progression, initialization and final completion; focused skills still own their documents and QC. Feature/revision adoption and active implementation retain their existing procedures. Read-only exploration creates no files or hosted objects.

## Establish preparation before repository writes

1. Use current orientation to identify the eligible target Git repository, instructions, actual default branch, pending ownership, existing documents and decisions, and the requested scope/stop. Reuse the active main preparation and its branch instead of allocating another campaign. Do not initialize Git implicitly.
2. Establish [tracking selection](tracking-decision.md#main-documentation-preparation), including the prospective project policy when DOCS-001 will install the bundled AGENTS template. Resolve its effective mode before any repository write, preserving explicit choices, existing controlling instructions and resumed decisions. An explicit request to maintain tracking throughout development includes preparation; preserve a narrower selection or decline. Report the actual source/scope; authentication alone is not selection.
3. When preparation tracking is enabled, have **sdd-forge** establish and read back the native `sdd-docs-main` milestone, all nine preparation issues and their associations from the bundled [tracking definitions](../../../assets/DOCS_TRACKING_TEMPLATE.json) before **any target-repository modification other than the [transient projection lock](#transient-projection-lock)**, including branch/ref creation, credential/ignore-file writes, setup copies, document edits or commits. The milestone title/description and complete issue briefs/dependencies are predefined; do not generate project-specific replacements. Read-only orientation and authentication using existing access may precede this gate. If credential recovery is needed, use [pre-write authentication](credentials.md#authentication-before-main-preparation-writes), deferring repository storage. Unknown or incomplete projection blocks writes unless the human explicitly authorizes scoped local-only continuation.
4. After that gate, establish/reuse the [documentation branch](branch-management.md#preparation-integration-gate) and complete any deferred [credential storage](credentials.md#find-request-and-save). Copy the bundled [DOCS task template](../../../assets/DOCS_TASKS_TEMPLATE.md) to `docs/dev/DOCS_TASKS.md` if absent; otherwise preserve the existing list and recover progress. Resolve assets from the same installed/pinned plugin source. Do not overwrite a list, invent task IDs from implementation TASKS or create a second preparation status registry.

### Transient projection lock

After tracking selection and read-only eligibility checks, the optional forge utility may create only its nonce-owned `sdd-forge-close.lock/owner.json` in the target Git common directory while establishing/read-backing projection. This temporary coordination effect serializes linked worktrees; it does not clear the tracking gate. Cleanup removes only that owned lock. A retained or conflicting lock requires process/effect reconciliation before another operation.

This exception permits no credential/config/ignore files, branch/ref changes, setup copies, document/product edits or commits before complete association readback. Keep drafts outside the target repository and use existing or externally protected transient authentication. Other clients do not acquire a general pre-write exception.

## Preparation tasks

The predefined `DOCS-*` IDs are separate from product implementation `T-*` IDs. Each has one issue in `sdd-docs-main` when tracking is enabled; there is no preparation phase label or Phase 0. Keep these units in order:

| Task | Output / completion boundary | Owner |
| --- | --- | --- |
| DOCS-001 | Root initialization and recorded file outcomes | sdd-manage |
| DOCS-002 | PROJECT: first approval of the project brief | sdd-design |
| DOCS-003 | ARCHITECTURE: first approval | sdd-design |
| DOCS-004 | DECOMPOSITION: first approval | sdd-design |
| DOCS-005 | SPEC: required QC and first approval | sdd-specify |
| DOCS-006 | PLAN: strategy QC and first approval | sdd-plan |
| DOCS-007 | layout: combined PLAN/layout QC and separate first approval | sdd-plan |
| DOCS-008 | TASKS: required QC and first approval | sdd-tasks |
| DOCS-009 | Whole documentation package QC and report | sdd-verify; sdd-manage coordinates repairs/persistence |

Necessary focused children travel with their root; they do not acquire extra preparation issues. Existing valid documents are reusable inputs, not a reason to regenerate them. On resume, assess readiness and real decisions under [human document review](human-document-review.md); preserve pending reviews without demanding retrospective interactive replay solely for missing historical records. If introducing the list into an older incomplete preparation, record the actual evidence supporting recognized first approvals without claiming historical commits had this new atomic format.

## DOCS-001: Initialize root guidance

Inspect **all four** target-root destinations before copying anything. Read existing controlling instructions and establish owned changes independently of unrelated files/index contents.

| Package asset | Target-root destination |
| --- | --- |
| `assets/AI_DISCLOSURE.md` | `AI_DISCLOSURE.md` |
| `assets/SDD-MANAGER.md` | `SDD-MANAGER.md` |
| [AGENTS_TEMPLATE.md](../../../assets/AGENTS_TEMPLATE.md) | `AGENTS.md` |
| [SKILL_DISCOVERY_PROTOCOL.md](../../../assets/SKILL_DISCOVERY_PROTOCOL.md) | `SKILL_DISCOVERY_PROTOCOL.md` |

Preserve existing files byte for byte. Copy missing files unchanged from the running package; do not fetch another version or reconcile existing text in this task. Unsafe path types, external symlink targets, conflicting instructions or unclear ownership block affected writes; do not overwrite or follow an occupied non-file path.

Verify copied bytes and preserved content. Record the original retained/copied filenames and any required continuation decision with DOCS-001 in the task list. Establish or reconcile `docs/dev/HANDOFF.md` under [continuity](continuity.md) with this initialization checkpoint, governing records and actual continuation/pause. It is generated workflow metadata, not a fifth member of the four-file presence/copy test; preserve an existing record and its ownership. Include the handoff in the same initialization commit. The normal complete preparation merge later exposes it on default; unfinished design-docs is discoverable before then. Commit the initialization result and DOCS-001 marked complete together, including the new task list; push and read back. When all four root files already exist, the list/evidence may still need a commit; if valid completion already exists, reuse it without an empty commit. Then close/read back its issue with actual evidence when tracking is enabled.

Report **repository initialized**, distinguishing it from preparation complete. If none or all of the four files existed initially, continue without an added approval pause. If some but not all existed, warn with exact retained/copied filenames and **end the turn before document work**, unless an explicit applicable [preapproval](human-document-review.md#future-checkpoint-preapproval) covers that continuation. Copying missing files and completing initialization precede this pause; the question is whether to continue, not permission to make those copies.

Keep initial AGENTS guidance generic. Subsequent project-specific maintenance follows [agent orientation](agent-orientation.md). Add root README disclosure/usage links with the PROJECT checkpoint, preserving existing text and truthful scope; do not add them before a pending mixed-state stop. This is the main-preparation exception to [bootstrap](repository-bootstrap.md)'s combined-first-result/README rule.

## Document tasks through first approval

Apply [document QC](document-qc-gates.md) and [human review](human-document-review.md) to each root. Publish the reviewable proposal, present substantive results and pause unless explicit preapproval applies. A proposal commit leaves its document task unchecked.

Once the document is first approved, include the task marked complete in `DOCS_TASKS.md` in the same commit that submits the approved document state. Record the decision and accepted state with that task. If the proposal was already published unchanged, the approval commit retains its exact blob; do not rewrite it to manufacture a diff. With applicable preapproval, the completed document, evidence and checked task can be submitted together. The coordinator performs these non-implementation commits; focused document owners return their actual accepted/QC state.

Push and verify remote containment before closing/readback of the corresponding issue, then proceed to the next eligible task. Failed or unknown publication/closure remains pending and blocks dependent progression. Explicit scoped local-only exceptions retain their limits and outstanding hosted operations.

Intermediate document decisions/progress remain in DOCS_TASKS and existing evidence; do not rewrite HANDOFF at every proposal, approval or document commit. Recover changes since its entry checkpoint under [continuity](continuity.md#reconstruct-after-the-checkpoint).

**These tasks and issues track development through first approval.** Later revisions leave their checkboxes complete and issues closed. This does not freeze documents or establish permanent readiness: assess/review revised content under its owning procedure and reflect blockers in the current work or package QC. Never route DOCS tasks through the implementation owner's `T-*` commit/audit contract.

## Final package QC, integration and checkpoint

After DOCS-001–008 and their enabled issue closures, use **sdd-verify** to assess the whole set and retain `docs/dev/DOCS-QC-REPORT.md`. Include current PROJECT, ARCHITECTURE, DECOMPOSITION, SPEC, PLAN, layout, TASKS, needed children and QC reports, initialization/orientation and task/approval/publication evidence. Assess scope/contracts, cross-document consistency, traceability, dependencies, physical allocation, executable task derivation, unresolved decisions and implementation readiness. List actual source state, checks, outcomes, findings and limits. Per-document passing QC is insufficient.

Coordinate in-scope repairs with document owners, return consequential decisions to the human, and recheck affected readiness/acceptance. Previous first-approval tasks remain complete. While required package evidence fails or remains missing, DOCS-009 stays unchecked and its issue open.

1. Refresh HANDOFF with the verified package outcome, evidence, authorized next boundary and merge/milestone operations requiring confirmation. Commit it, the passing package QC report and DOCS-009 marked complete together. Push/read back, then close/read back the final QC issue.
2. Explicitly merge the complete verified documentation branch into the actual default branch using [Git integration](git-workflows.md#merge-verify-and-publish). Verify the merged result, commit, push and confirm remote containment. Preparation-only includes this main-documentation merge unless an explicit narrower stop/no-merge/local-only instruction excludes it.
3. Only after verified published integration, have **sdd-forge** close/read back the `sdd-docs-main` milestone. With tracking disabled, keep the same local order without hosted operations. An integration or closure failure retains the outstanding transition; checked tasks and closed issues alone do not complete preparation.
4. Report the final preparation checkpoint: package/QC result, published merge, milestone state and pending operations. Pause before implementation unless explicit preapproval covers that checkpoint **and** an implementation range is already authorized. Only then apply phase activation and dependent implementation branching; document approval or milestone closure alone does not select a range.

## Recovery

Recover the earliest unmet authorized operation from actual files, original presence evidence, decisions, list, Git and hosted state. Preserve completed work, IDs, pending publication/closure and a mixed-initialization stop; final file presence cannot erase its original partial-presence decision. Read uncertain effects before retrying. Finish the retained commit/push/closure/merge rather than regenerate documents or repeat operations. Preserve completed first-approval tasks through later revisions and assess current package readiness separately. Missing or contradictory ownership/decision evidence requires resolution, not guessed approval.
