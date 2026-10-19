# Human review of development documents

## Entry and existing progress

At greenfield entry, walk the human through the necessary document chain. At existing or interrupted project/feature entry, sdd-orient observes actual progress, decisions, document identities and unresolved instructions; the selected owners assess missing technical readiness. Orientation remains read-only and does not silently author or repair documents.

Reuse acceptable existing inputs and proceed to the next eligible stage within the request. Missing retrospective human-acceptance records alone do not require interactive replay. File presence alone does not establish readiness. Preserve an actual pending checkpoint, requested review or explicit stopping instruction; interruption does not erase it.

If the human explicitly requests interactive review of existing artifacts, begin with that review before dependent progression. Present concise substantive analysis and resolve the selected review, rather than listing files or announcing a Ready result. Important issues found at startup warrant a concrete concern, its consequence and affected next stage, and an offer of interactive review before advancing. An offer does not activate interactive mode until selected. Declining it does not clear a consequential readiness blocker; continue independent eligible work when possible.

## Future-checkpoint preapproval

The user may explicitly preapprove any future human checkpoint at any point, individually or as a scoped set, including document acceptance, initialization continuation and the final preimplementation checkpoint. Retain the actual scope, conditions and later revocation in existing workflow evidence, including across interruptions. A covered checkpoint still requires authoring, QC, reporting, persistence and required hosted operations, but no repeated acceptance pause. Preapproval does not clear technical blockers or unresolved consequential decisions, grant missing repository authority or select/expand an implementation range. A generic development request, repository-operation authority, silence or clarification is not preapproval. Persist a changed grant/revocation in its owning evidence before dependent work so [checkpoint recovery](continuity.md#reconstruct-after-the-checkpoint) finds it even when HANDOFF predates that decision; no per-decision handoff refresh is required when the existing records suffice.

## Created-document checkpoints

Unless explicitly covered by applicable preapproval, each newly created necessary root/proposal has its own human review checkpoint, including direct owner calls and combined preparation requests. Relevant focused children are presented with their root.

| New document/proposal | Owner | Hold before |
| --- | --- | --- |
| PROJECT | sdd-design | Dependent ARCHITECTURE or other use of the brief. |
| ARCHITECTURE / FEATURE_ARCHITECTURE | sdd-design | Dependent DECOMPOSITION or contract work. |
| DECOMPOSITION / FEATURE_DECOMPOSITION | sdd-design | Dependent SPEC. |
| SPEC / FEATURE-SPEC | sdd-specify | Dependent PLAN. |
| PLAN / FEATURE-PLAN | sdd-plan | Dependent layout or TASKS. |
| layout / needed feature layout proposal | sdd-plan | Dependent TASKS. |
| TASKS / FEATURE-TASKS | sdd-tasks | Implementation or hosted task projection. |

Preserve dependency order: PROJECT, ARCHITECTURE, DECOMPOSITION, SPEC, PLAN, layout, TASKS. PLAN and layout have distinct checkpoints even when requested together. Optional feature overlays remain optional; reuse sufficient main design, strategy and layout. Do not create documents merely to fill this table. A feature brief is established in exploration/package evidence; create PROJECT only when genuinely selected. Use existing layout/feature-plan owners for a scoped placement proposal, without inventing a FEATURE-LAYOUT filename.

1. Complete the selected root/proposal and children and perform applicable owner QC. Under existing Git authority, commit, push and verify remote containment before presenting the reviewable result, following [per-commit publication](git-workflows.md#publish-each-commit).
2. Present links and concise analysis of purpose/coverage, consequential choices and rationale, consistency/gaps, assumptions/open questions, QC evidence/limits and a reasoned recommendation. For features, include changed behavior, affected main guarantees, compatibility/integration effects and scope/deferrals. Name the dependent operation being held.
3. Pause for the human decision unless explicit applicable preapproval covers this checkpoint; record that preapproval as the decision basis rather than claiming a later interactive approval. Agent QC, Ready, commits/pushes and broad authorization to develop or prepare through TASKS do not accept an unreviewed new document. Clarification answers supply requirements or decisions within their stated scope; they do not accept an artifact or authorize downstream stages. Silence or comments without acceptance keep the checkpoint pending.
4. Record the actual decision with document/proposal scope and exact presented state (commit/blob or content identity) in existing preparation, handoff or active campaign evidence. Keep pending, accepted and revise decisions distinguishable from technical readiness. No new journal, registry or mandatory report per design root is required.
5. While acceptance is pending, answer questions or route requested current-stage revisions to the owner within scope. Recheck affected concerns, present the revised reviewable state and stop at the same checkpoint; do not author dependent artifacts or begin/advance implementation before the required acceptance. Acceptance-and-proceed clears the presented scope and its authorized next step; only an explicit applicable future-checkpoint preapproval covers unseen downstream documents. If the human explicitly changes checkpoint scope, retain that decision; generic authorization is not a waiver.

For main preparation, [main preparation](main-preparation.md#document-tasks-through-first-approval) owns the approval/task commit and subsequent issue closure: DOCS tasks track first approval, while later revisions keep those tasks complete.

## QC, operation authority and continuation

Human acceptance, technical readiness and Git integration/publication are separate gates. Human acceptance does not turn Blocked into Ready. Authorized checkpoint commits/pushes use existing repository-operation authority without another permission question. Preparation-only stops before implementation; accepted documents still need their established preparation integration gate before an implementation branch is created.

Routine maintenance, completion/evidence edits and material corrections to existing startup inputs do not automatically activate a full interactive review. Reassess affected technical readiness and route consequential decisions appropriately. A selected active interactive review does remain pending through its requested revisions. After interruption, reuse valid work and actual decisions, resume the next eligible stage, and preserve the unresolved human boundary without inventing acceptance or regenerating documents.

Feature campaigns follow the same entry, presentation and continuation rules for each necessary new delta. Their accepted incorporation, bounded implementation and final verification/publication keep their existing owners and gates. This protocol adds no approval per implementation task or repository operation. Read-only review does not authorize repairs or unrequested downstream stages.
