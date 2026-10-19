# Tetris component decomposition

Status: proposed for first human approval.

## Scope and structural model

This model refines the accepted [ARCHITECTURE](ARCHITECTURE.md) for the complete scope in [PROJECT](PROJECT.md). It defines logical responsibilities and collaboration, without prescribing source files or implementation order. Components may share a module when cohesive; the physical allocation belongs to layout.

The game engine owns authoritative gameplay state. The browser application supplies commands, elapsed time and randomness; presentation consumes read-only snapshots. Dependencies point from the browser application toward the engine and presentation adapters, with no engine dependency on browser resources.

## Game-engine components

| Component | Responsibility and provided boundary | Required collaborators and state ownership |
| --- | --- | --- |
| Piece geometry | Define tetromino identities, orientation geometry and rotation-transition metadata. Provide occupied-cell coordinates for a candidate piece. | Pure data/calculation; no live game state or browser dependencies. |
| Placement rules | Evaluate legal placement, translated/rotated candidates and ordered kick candidates; calculate landing positions using the same collision rule. | Piece geometry and supplied board/piece data. Own rule calculations, not mutable session state. |
| Board operations | Apply a legal locked piece, identify/remove complete rows and return the resulting board and line-clear information. | Supplied board and placement data; no random draws, scoring, spawning or rendering. |
| Piece sequence | Produce the next piece and preview information from shuffled seven-piece bags. Support queue consumption independently of rendering. | Injected random source. Bag and queue data belong to the session-owned sequence state; preview reads do not consume it. |
| Scoring and progression | Calculate score, cleared-line totals, level changes and associated gravity parameters from defined gameplay events. | Supplied scoring/progression data and rule parameters. No clock access or board mutation. Numeric rules belong to SPEC. |
| Session engine | Coordinate commands, elapsed time, spawning, movement, rotation, hold, drop, locking, line clearing and game-over transitions. Expose the application-facing session boundary. | Geometry, placement, board, sequence and scoring components. Sole owner of canonical session state, including board, active piece, hold/queue data, lifecycle, score and timing accumulators. |
| Snapshot projection | Construct presentation data and derived ghost/preview information without advancing gameplay. | Read-only session data, piece geometry and the authoritative landing calculation. No separate live state or random draws. |

Board, piece and sequence helpers operate on explicit values or session-owned substate supplied by the session engine. They must not retain an independently mutable copy of the current game. The session engine coordinates their results before exposing a coherent snapshot.

Timing accumulators belong to the session engine because gravity and locking are gameplay rules. The browser supplies elapsed duration; the engine decides which transitions are due. General locking, hard-drop locking, catch-up behavior and simultaneous-event precedence must be specified together in SPEC rather than implied by callback order.

## Browser-application components

| Component | Responsibility and provided boundary | Required collaborators and resource ownership |
| --- | --- | --- |
| Input adapter | Translate relevant keyboard events into semantic command requests and expose session-control activation. Apply the accepted focus/default-action rules. | Browser event targets and a controller callback. Own listener registration and transient pressed-key data; no board or lifecycle copy. Key mappings and repeat policy belong to SPEC. |
| Frame/time adapter | Supply monotonic timestamps and request/cancel animation callbacks. Permit controlled clock/scheduler substitutes in tests. | Browser scheduling/time APIs. Own resource handles, not gameplay timers or lock decisions. |
| Application controller and composition | Construct the engine, randomness source and views; serialize input/time processing; obtain snapshots; coordinate rendering and resource lifecycle. | Engine session boundary, input/time adapters and presentation interfaces. Own browser application resources and wiring, not game rules. |

The controller is the application's composition point. It supplies callbacks to input and views, so those adapters do not import or construct the controller. This prevents a callback relationship from becoming a cyclic module dependency.

The controller must ensure only one active update loop and one effective listener set exist for an application instance. Pause/resume, restart and disposal reconcile browser resources with the engine's authoritative lifecycle. Held-input cleanup, focus loss and visibility changes require explicit SPEC behavior; no silent background-time policy is selected here.

## Presentation components

| Component | Responsibility and provided boundary | Required collaborators and state ownership |
| --- | --- | --- |
| Canvas renderer | Draw the locked board, active piece, ghost and piece previews from snapshot geometry. Own drawing dimensions, palette and graphics resources. | Canvas contexts and presentation data. No collision, kick, landing, scoring or queue-generation logic. |
| HTML view | Present score, level, game status, instructions and semantic session-control buttons; provide visible focus and labels. | DOM elements, snapshot/status data and supplied action callbacks. DOM state reflects engine output and is not an alternative game-state authority. |

Both views display the same engine snapshot for a refresh. Drawing colors, pixel coordinates, text and element references stay in the browser layer. Engine coordinates remain logical board coordinates.

## Provisional interfaces and data boundaries

The session boundary supports creation/reset with an explicit randomness source, semantic command application, elapsed-time advancement and read-only snapshot retrieval. These are design-level operations, not finalized API signatures. SPEC will define legal input values, lifecycle restrictions and invalid-input outcomes before implementation contracts are fixed.

A snapshot provides the board, active-piece geometry, projected ghost, held/next pieces, score/progression and lifecycle data needed by the views. Mutable engine collections must not escape through it: implementation must use detached data or an equivalently enforced immutable representation. TypeScript read-only annotations alone do not prevent mutation through shared runtime references.

Commands describe player intent rather than browser events. The input adapter owns key-code interpretation; the engine owns whether the resulting command is legal and its effect. The controller delivers input and elapsed-time operations in an explicit order governed by SPEC.

Random-source access is restricted to sequence operations that require a shuffle/refill. Rendering, snapshot reads and collision checks do not consume randomness. Tests can supply a known stream and verify both outcomes and draw consumption. Reset/random-source lifecycle semantics belong to SPEC.

## Principal collaborations

For a move or rotation, the controller forwards a semantic command. The session engine requests candidate geometry and legal placement, applies the accepted result and exposes a new snapshot. Presentation draws that result without reevaluating legality.

For ghost projection and hard drop, snapshot projection and the session engine use the same landing operation. Ghost projection does not mutate the session; hard drop applies the landing result and follows the locking/scoring contracts defined by SPEC.

For locking and line clearing, the session engine coordinates board operations, scoring/progression and subsequent piece selection/spawn. Hold uses that same sequence and spawn path where appropriate. Hold eligibility, spawn failure and event ordering must be defined in SPEC so these transitions cannot diverge between input paths.

## Lifecycle, failure and verification boundaries

Initialization owns browser capability and element/context acquisition failures. Such failures must be communicated through available HTML rather than treated as a functioning game. Exact user-visible behavior belongs to SPEC. Resource cleanup must remain possible after partial initialization.

The session boundary owns validation of externally supplied commands/time and preservation of gameplay invariants. Internal invariant failures must remain observable to development checks; the design does not authorize silently repairing corrupted state. Error categories and reporting contracts belong to SPEC.

- Geometry/placement tests use supplied boards and pieces to verify boundaries, rotations, kicks and shared landing behavior.
- Board and progression tests verify supplied-input transformations and event calculations.
- Sequence tests control randomness and check bag/preview consumption behavior.
- Session tests exercise complete transitions, hold/drop interactions, timing and lifecycle with explicit inputs.
- Snapshot tests check projection correctness, read isolation and absence of random/state changes on reads.
- Adapter/controller tests use controlled time, input and presentation collaborators to check ordering and resource ownership.
- Browser tests verify the integrated keyboard/HTML/Canvas experience. Canvas behavior and focus handling need browser evidence beyond pure engine tests.

This proposal introduces no additional runtime subsystem. The next owner is SPEC, which must turn the deferred behavioral decisions into precise contracts and acceptance conditions after DECOMPOSITION approval.
