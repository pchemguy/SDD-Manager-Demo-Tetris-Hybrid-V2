# SPEC review report

## Current gate

State: **Ready for dependent PLAN authoring**, subject to publication/tracking prerequisites, with no unresolved technical QC finding. Human first approval is recorded in DOCS_TASKS for proposal commit `11089cfc408648a3256df9b51713d5080fa6b9b6`. This conclusion concerns the accepted specification, not an implemented game.

Reviewed scope: [SPEC](SPEC.md), [game rules](spec/game-rules.md) and [browser session](spec/browser-session.md). The final reviewed SHA-256 identities appear in Revision 1. The report itself is not included in those hashes.

Governing inputs and acceptance evidence:

| Input | Accepted proposal commit | Exact Git blob |
| --- | --- | --- |
| PROJECT | `1cdfb44c0eff8a6183a818ec1484da7310ad69cd` | `55aa3d452b2efeedf8f77239a4f73f0109984885` |
| ARCHITECTURE | `49b0de9628493776ac68beba8a7498114807df25` | `6a1722636541517c9ba9454dae1acbb80114173d` |
| DECOMPOSITION | `3948e92ee152d1941aacf2d644927d28e779fc03` | `5d7b6f56fab0ea2560a3ab75316421aead22db81` |

First approvals and publication/issue evidence are retained in [DOCS_TASKS](DOCS_TASKS.md). The accepted locking decision is the user's selection of one full gravity interval for normal landings and hard drops. Other exact rules are proposed at this SPEC checkpoint rather than represented as prior human decisions.

## Initial review

Date: 2026-10-19. Owner/reviewer: sdd-specify, with sdd-report formatting. This was a single-agent document/design review, not independent code review or gameplay execution.

Initial reviewed content identities:

| Source | SHA-256 |
| --- | --- |
| SPEC.md | `036e4013dc86d4b44ee3df49f854f2d5744d95c514b7766d170f8aafa5cff60d` |
| spec/game-rules.md | `942fe378b4fd488b4bca9e5f54255b78712c761d5a799c7a36e682dcf63bf041` |
| spec/browser-session.md | `519ec8ebccba648d7f985e4ce39f1472bae149feb9ad27562467f4b3188dc87e` |

The initial review assessed scope, canonical contract ownership, design responsibility/dependency consistency, interfaces, errors, resources, lifecycle, boundaries, objective acceptance, parent/child routing and end-state wording. Significant public behavior is explicit, including the project-specific kick scheme and selected full-interval lock policy; official SRS/Guideline conformance is not claimed.

| Coverage group | Canonical contracts | Design/acceptance assessment |
| --- | --- | --- |
| Complete scope and delivery boundaries | S-SCOPE, S-QUALITY, S-ACCEPT | All classic/modern features and accepted exclusions covered; no backend, persistence or additional runtime subsystem introduced. |
| Geometry, legal placement and rotation | G-BOARD, G-ROTATE, G-ACCEPT | Pure geometry/placement owners; explicit spawn/rotation/kick tables, blocked actions and boundary examples. |
| Bags, preview and hold | G-SEQUENCE | Session-owned sequence/hold; six shuffle draws per bag, non-consuming projection, once-per-piece restrictions and spawn-failure behavior. |
| Movement, ghost, drop and locking | G-MOVE, G-TIME | Shared landing calculation, explicit elapsed time and chronological deadlines; selected delay covers positive-distance hard drop and repeated zero-distance requests. |
| Clearing, progression and terminal outcomes | G-PROGRESS, G-BOARD | Board/scoring/session ownership preserved; formulas, level transition, compaction and blocked spawn are checkable. |
| Snapshot isolation and repeatability | S-DATA, S-DETERMINISM | Snapshot projection receives no browser resources; no mutable aliases, draw consumption or hidden time reads. |
| Engine API and failures | S-API, B-FAIL | Controlled action/time/random inputs, public errors and browser stop/cleanup paths. Initial issues below required clarification. |
| Input, time and lifecycle resources | B-CONTROLS, B-TIME | Controller/adapters own focus, deterministic repeat delivery, interruption, restart, callback/listener cleanup and stall handling. |
| Rendering, interaction and integrated acceptance | B-VIEW, B-ACCEPT, S-ACCEPT | Canvas/HTML share snapshots; focus/status/capability failures and whole-session checks complement engine-only acceptance. |

SPEC is not a delivery task list; phase/milestone/task count assessments do not apply. No focused child is a trivial fragment: game rules own a substantial cohesive ruleset, browser session owns the substantial input/time/resource/UI contract, and the root owns cross-component guarantees.

| Finding | Original location and consequence | Correction owner / recheck | Current disposition |
| --- | --- | --- | --- |
| SPEC-QC-001 | S-API omitted method return values; S-DATA described coordinate pairs without their exact array shape. Consumers could implement incompatible interfaces. | sdd-specify: specify factory/session operations, success returns and `[x,y]` arrays; inspect all consumers' required data. | Resolved in Revision 1. |
| SPEC-QC-002 | S-API's random-failure atomicity did not distinguish one transition from a multi-event `advance`. Implementers could disagree about rollback of earlier completed events. | sdd-specify: define the atomic transition boundary and failure stopping behavior; recheck against chronological advancement and browser failure handling. | Resolved in Revision 1. |
| SPEC-QC-003 | G-SEQUENCE stated hold availability without explicitly defining preservation on an unavailable hold request. A rejected request could incorrectly consume randomness or reset timing. | sdd-specify: make rejection a no-op across all affected state and draws; recheck hold/timing interactions. | Resolved in Revision 1. |

Initial gate: Blocked by the three contract clarifications above, independent of the pending human checkpoint.

## Revision 1

sdd-specify corrected S-API to define factory/session return behavior and the failing transition boundary, S-DATA to define coordinate-array shape, and G-SEQUENCE to define unavailable hold as a no-op. Browser-session content remained unchanged and was rechecked against the clarified engine boundary.

Final reviewed content identities:

| Source | SHA-256 |
| --- | --- |
| SPEC.md | `a1633406ee07e30a473b68a3e9f1c31d2dda33373ee804e1e8c00d412a118611` |
| spec/game-rules.md | `873fd13eda9b698a830a1e383937e7002b8c0cbe56deeec7ee32c311562271e5` |
| spec/browser-session.md | `519ec8ebccba648d7f985e4ce39f1472bae149feb9ad27562467f4b3188dc87e` |

Rechecks performed:

- Read the corrected boundaries against hold, queue, deadline, snapshot, chronological-advance and browser-error contracts. The three original ambiguities are resolved without changing architectural ownership.
- Compared all three accepted source files byte for byte with their reviewed proposal commits; they are unchanged. Later locking clarification is recorded separately in DOCS_TASKS and specified canonically in G-TIME.
- Checked local links, heading separation and placeholder absence. Final whole-package whitespace/link checks include this report before commit.
- Ran inline document sanity checks for seven spawn geometries, four quarter-turn transformations returning to the original cells, and gravity arithmetic at levels 1, 2, 12, 13 and 14. These validate specification data/formulas; they are not product implementation tests.
- Reviewed the acceptance routes for every coverage group. No confirmed technical blocker remains; no technical exception is being used.

Final technical gate: Ready for the proposed scope. Human first approval remains pending and is required before PLAN. The controls, bounded non-SRS kicks, exact timer-reset rules, scoring, browser interruption/repeat behavior and API contracts must be visible in that review. No playable implementation, browser execution, performance measurement or production build is claimed.

## Human acceptance update

The user accepted the complete SPEC package with “k” at its review checkpoint on 2026-10-19. DOCS_TASKS owns the decision and checked task. SPEC and both child content hashes remain unchanged, so this acceptance metadata update does not invalidate Revision 1's technical assessment. Its original pending-review observations remain historical. Publication and issue closure must be verified before dependent PLAN authoring.
