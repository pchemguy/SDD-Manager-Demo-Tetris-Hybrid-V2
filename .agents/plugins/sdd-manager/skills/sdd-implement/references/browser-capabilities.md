# Conditional browser capability evidence

Load only when the selected work needs browser provisioning, sessions, rendering or native browser behavior. This applies the manager's recovery policy and verification's evidence rules; it does not prescribe dependencies for every project or a mandatory suite for every browser task.

| Required capability / failure | Representative investigation or evidence |
| --- | --- |
| Download/install browser | Check status plus artifact format/magic/content and expected archive members; HTTP 200 containing HTML is an invalid archive. Verify supported executable/platform compatibility and source integrity. Investigate supported alternatives when the selected route fails. |
| Repeated contexts/pages | Reproduce the lifecycle used by the planned suite, including successive contexts and teardown; one successful launch is insufficient. Record launch mode/configuration and actual process behavior. |
| Text or font rendering | Check font availability/configuration and rendered glyph pixels or inspected screenshots where acceptance depends on visible text. DOM text presence alone does not establish glyph rasterization. |
| Canvas/visual output | Select pixel/shape assertions and inspected visual artifacts appropriate to the contract, with stable tolerances. DOM assertions cannot establish Canvas rendering. |
| Reproducible provisioning | Exercise a fresh task-owned cache/configuration when reproducibility is an acceptance requirement; preserve unrelated caches and toolchains. Record versions, setup route and configuration needed to reproduce. |
| Native focus/visibility/input | Exercise native delivery where the environment permits it. Modeled event-handler tests verify controlled handler behavior, not native desktop delivery. If headless facilities cannot reproduce the native condition, report that capability unverified and retain useful handler evidence separately. |

A demonstrated route may use pinned packaged browser assets, ownership-safe extraction, multiprocess launch and local font configuration. Those are examples to assess against actual project requirements, not prescribed package names or permission bypasses. A broken distribution, incompatible binary or sandbox limit remains distinguishable from a product defect.

Select only rows required by the planned checks. Report actual executable/rendering/native evidence, substitutions and omissions; do not convert unavailable optional native facilities into failure of independently verified product behavior or claim full environment compatibility from a smoke test.
