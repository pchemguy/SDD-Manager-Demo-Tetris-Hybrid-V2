# GitHub main preparation tracking

Use for `sdd-docs-main` creation/readback, preparation issue lookup/closure and final milestone closure, including direct calls. Load the parent [GitHub backend](github.md) for repository/access, protected authentication and operational-failure rules. The coordinator's [main preparation](../../sdd-manage/references/main-preparation.md) owns readiness, local DOCS_TASKS, first approval, Git persistence and the final human checkpoint. This module performs hosted operations only.

## Identity and pre-write projection

Require the actual repository, selected preparation-tracking scope and its request/project-policy source from **sdd-manage**. Before target files or branches are modified, load the running/pinned package's [tracking definitions](../../../assets/DOCS_TRACKING_TEMPLATE.json) and [local task template](../../../assets/DOCS_TASKS_TEMPLATE.md). The JSON supplies the complete standard milestone/issue content and dependencies; the Markdown owns the local preparation tasks. Target PLAN/TASKS and a local DOCS_TASKS are not prerequisites for projection. Use both assets from the same package source.

On resume also inspect existing `docs/dev/DOCS_TASKS.md`, actual decisions and retained hosted identities. Preserve checked progress and valid documents. Check task IDs/names/order and semantic scope against the definitions; disagreement returns to the coordinator rather than regenerating the list, inventing content or overwriting existing objects.

| Object | Identity and content |
| --- | --- |
| Native milestone | Exact title `sdd-docs-main` and plain-text description from the JSON; no description ownership marker or project-specific title generation |
| Nine task issues | Exact ordered DOCS-001–DOCS-009 definitions from JSON, rendered as `[<id>] <name>` and the standard brief fields; issue body markers identify the stable task and preparation scope |

The [input-authoring contract](../scripts/forge-project-input.md#predefined-main-preparation-content) defines the JSON interface and rendering. Use the existing task opening/closing markers from [TASKS projection](github-projection.md), plus `<!-- sdd-forge:docs-scope=main -->` for each issue. These issue markers remain machine metadata; they do not belong in the milestone description. Do not add issue URLs, links to nonexistent target documents, product implementation IDs, phase labels, phase review milestones or another local issue-map file.

With Node/Git available, the [draft helper](../scripts/forge-project-draft.mjs) binds repository/source to these predefined fields; the [projection utility](../scripts/forge-project.md) consumes its JSON request. Standard preparation needs no agent-authored briefs or dependency inference. The agent verifies actual prerequisites and outgoing content, then supplies runtime eligibility. Other authenticated clients use the same definitions and renderer contract. Keep drafts/requests outside the target repository before the pre-write gate. The logical request/CLI kind remains `docs-main`. The utility may use only the coordinator-defined [transient projection lock exception](../../sdd-manage/references/main-preparation.md#transient-projection-lock); it grants no other repository writes before complete readback.

1. Enumerate open and closed milestones/issues with complete pagination; exclude PRs. Resolve the milestone by exact title and retained numeric identity, and the issues by stable task/scope markers; validate their content and parentage. Duplicate, contradictory or unmarked same-identity candidates block projection. A same-scope milestone with an unprefixed `docs-main` title or description ownership marker is a conflict, not permission to create another one. Resolve an owned discrepancy through explicit backend reconciliation; the optional utility never renames/overwrites it.
2. Create/reuse the native `sdd-docs-main` milestone and all nine issues from the predefined content. Assign each issue to that milestone, preserving unrelated labels/fields and existing evidence. Reuse completed first-approval issues without reopening them for later revisions.
3. Read back the exact milestone and each issue's marker, identity and association. Return IDs/URLs, created/matched/updated state and unresolved differences. **Only complete verified projection clears the coordinator's pre-write gate.** Partial creation, uncertain writes or inaccessible lookup remain pending; inspect real state before retrying, never create duplicates to evade uncertainty.

GitHub is the projection, not authority for local completion. An existing closed milestone or issue does not prove accepted documents, QC or published integration. Report inconsistent prior closure and resolve its scope/evidence rather than certify readiness from provider state.

## Complete preparation issues

Before closure resolve the unique marked issue, current repository and milestone association. Require the coordinator's actual task completion evidence:

- **DOCS-001:** Original retained/copied outcomes for all four root files, verified preservation/copies, DOCS_TASKS completion and published initialization commit, or verified retained completion. A mixed-presence continuation pause may remain after initialization is complete.
- **DOCS-002–008:** First approval or applicable explicit preapproval, required QC, and the commit containing the approved document state and corresponding checked DOCS task, pushed with verified containment. A prior proposal commit leaves the task/issue incomplete. Resumed recognized approvals retain their actual evidence; do not claim a historical checkbox transition that never occurred.
- **DOCS-009:** Passing whole-package `docs/dev/DOCS-QC-REPORT.md` and checked final DOCS task in one verified published commit; all earlier preparation issue closures verified.

Add a concise evidence comment if absent, close as completed and read back state/reason under the existing issue operational-failure rules. Do not duplicate a matching comment or repeat a verified closure. The coordinator publishes before requesting closure; this backend creates no commits.

Document tasks/issues record development **through first approval**. Later revisions leave those tasks complete and issues closed; current document validity is assessed in the owning workflow/package QC instead. Implementation task invalidation/reopening semantics do not apply to these first-approval issues. A false or unsupported claim that first approval occurred is a separate evidence defect for the coordinator, not a normal later revision.

## Close the preparation milestone after integration

1. Resolve the unique milestone and all nine issue identities. Read every associated issue, including closed issues, with full pagination; foreign open issues, PRs or ambiguous ownership block closure and must be preserved.
2. Require all nine issues closed from verified completion, passing package QC and evidence of the documentation branch's **explicit two-parent merge into the actual default branch**, merged-state checks, target push and verified remote containment. Closed issues or a pushed documentation branch alone are insufficient.
3. Close the native `sdd-docs-main` milestone and read it back. An already correctly closed milestone needs verification, not another write. Unknown/failed closure stays pending; read actual state before retry. Return the milestone URL/state, completion and merge identities and any unresolved effects to **sdd-manage**.

The coordinator then confirms the final checkpoint before implementation. This preparation operation does not activate implementation objects, select a range or close an implementation phase. Local-only preparation has no hosted writes; it retains the coordinator's applicable local gates.
