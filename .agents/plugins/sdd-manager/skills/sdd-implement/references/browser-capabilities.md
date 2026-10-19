# Browser environment readiness and evidence

Load when selected work needs browser execution, environment planning, provisioning, sessions, rendering or native browser behavior. Establish normal readiness before execution; use recovery only for an observed blocker. Browser requirements come from the selected contracts and testing strategy. Document-only planning and unrelated CLI/pure engine work do not require browser installation, and a browser target does not by itself select Playwright.

## Browser policy and isolation

Use a dedicated Chromium installation within the project or execution environment by default. Firefox may be provisioned similarly when required by the project's test matrix. These are the only permitted browsers for agent use; Chrome, Edge, WebKit and other browsers are prohibited. The allowlist does not require both permitted engines for every task. If an existing contract requires a prohibited browser, retain and report the conflict to the coordinator for an authorized amendment; do not run it or silently replace its acceptance conditions.

Download missing binaries into an explicitly environment-owned location and use isolated browser profiles/user data, caches and downloads. Reuse a compatible copy already provisioned within that environment; a fresh download is not required for each task. Do not search for or use pre-existing user/system browser installations, personal profiles, cookies or extensions, or attach to running personal sessions. Do not install, replace or reconfigure a global browser. Preserve unrelated installations and caches; clean up only owned sessions and artifacts.

The same browser and isolation policy applies to agent browser tools, containers and remote execution facilities. Establish the permitted engine, dedicated installation and isolated state before use; tool availability alone does not establish compliance. An interactive agent session does not establish that the project's reproducible automation environment works.

## Prepare the normal project environment

1. Derive the required engines, operating modes and capabilities from the selected work. Distinguish the product's supported platforms from the actual execution host and evidence available there. A project needing one engine does not acquire a broader matrix by default.
2. Inspect declared dependencies, lockfile, automation configuration and setup/test commands. Use that toolchain and its compatible browser builds; do not introduce another framework or a global/ephemeral CLI merely because it is available. Apply the policy above to existing configuration as well as new setup.
3. Establish the environment-owned binary and state locations. Keep generated browsers, profiles and other transient state outside tracked source and production assets, using appropriate ignore rules where they are inside the repository. Configure installation and execution consistently; an isolated profile does not make a system executable eligible.
4. Install missing required assets from official browser/framework distributions for the actual OS/architecture, together with required host dependencies within the authorized environment. Validate compatible contained assets before reuse. Keep browser and automation versions coherent and upgrades deliberate; do not substitute an arbitrary latest executable.
5. Exercise the actual project runner/application path and select representative capability checks below. Retain necessary setup commands, browser/framework versions, installation location, launch mode and evidence limits in existing project documentation/task or campaign evidence. No separate environment registry is required.

### When Playwright is selected

Use the project's installed Playwright package and CLI with its matching managed browsers. The standard package supports both Chromium and Firefox. Its Firefox build contains required patches; stock Firefox is not a compatible substitute. Set PLAYWRIGHT_BROWSERS_PATH to an environment-contained directory for both browser installation and every test/automation invocation, including CI or a separate tool process. Playwright's default per-user browser cache does not by itself satisfy the dedicated-environment requirement.

Install explicit permitted engine names: Chromium normally, adding Firefox only when required. Configure the corresponding test projects explicitly so scaffolding defaults do not introduce WebKit or branded channels. Do not run bare all-browser installation or `playwright install chrome`; the latter uses Chrome's normal OS installation location and ignores PLAYWRIGHT_BROWSERS_PATH. Do not configure a personal/system executable, branded channel or unmanaged endpoint as a shortcut.

The following setup examples are illustrative. They assume the project's locked Node dependencies are already installed and a test project named `chromium` is configured. Use actual declared project scripts/identifiers, retain the same path for later runs, and ignore the generated directory. They do not prescribe a framework or product test matrix.

Windows CMD:

```cmd
set "PLAYWRIGHT_BROWSERS_PATH=%CD%\.browser-binaries"
npx --no playwright install chromium
npx --no playwright test --project=chromium
```

POSIX shell:

```sh
export PLAYWRIGHT_BROWSERS_PATH="$PWD/.browser-binaries"
npx --no playwright install chromium
npx --no playwright test --project=chromium
```

When Firefox is required, include `firefox` in the explicit installation list and run its configured test project as well. The same environment path contains the managed Firefox copy; no separate Playwright variant is needed. For current version-specific setup and host prerequisites, consult [Playwright browsers](https://playwright.dev/docs/browsers) and [CI setup](https://playwright.dev/docs/ci).

## Verify required capabilities

Select only rows needed by the planned checks. A launch smoke proves only launch; it does not establish the full suite lifecycle, application acceptance or compatibility with every product target.

| Required capability / failure | Representative investigation or evidence |
| --- | --- |
| Download/install browser | Establish the allowed engine, dedicated location and compatible build. For a suspected malformed download, check status plus artifact format/magic/content and expected archive members; HTTP 200 containing HTML is an invalid archive. Verify executable/platform compatibility and source integrity. |
| Repeated contexts/pages | Reproduce the lifecycle used by the planned suite, including successive contexts and teardown; one successful launch is insufficient. Record launch mode/configuration and actual process behavior. |
| Text or font rendering | Check font availability/configuration and rendered glyph pixels or inspected screenshots where acceptance depends on visible text. DOM text presence alone does not establish glyph rasterization. |
| Canvas/visual output | Select pixel/shape assertions and inspected visual artifacts appropriate to the contract, with stable tolerances. DOM assertions cannot establish Canvas rendering. |
| Reproducible provisioning | Exercise a fresh task-owned cache/configuration when reproducibility is an acceptance requirement; preserve unrelated caches and toolchains. Record versions, setup route and configuration needed to reproduce. |
| Native focus/visibility/input | Exercise native delivery where the environment permits it. Modeled event-handler tests verify controlled handler behavior, not native desktop delivery. If headless facilities cannot reproduce the native condition, report that capability unverified and retain useful handler evidence separately. |

A demonstrated route may use pinned packaged browser assets, ownership-safe extraction, multiprocess launch and local font configuration. These are illustrative capabilities, not required package names or additional product scope. Select headed/headless execution according to the required evidence. A broken distribution, incompatible binary or environment limit remains distinguishable from a product defect.

Report actual executable/rendering/native evidence, substitutions and omissions. Do not convert unavailable optional native facilities into failure of independently verified product behavior. Missing required evidence remains blocked; a modeled handler or interactive page visit does not replace its required native/automated check.

## Recover an observed blocker

Use [environment recovery](environment-recovery.md) after a normal setup or required capability check actually fails. Preserve the command and observed failure; distinguish download/source integrity, version/cache configuration, host dependencies, executable launch, session lifecycle and rendering/native limitations. Investigate supported remedies within scope and repeat affected checks after material changes.

Every remedy must preserve the browser allowlist and dedicated binary/state boundary. Supported sources, compatible versions or a controlled container/remote environment may be evaluated under those constraints; a system browser or existing personal session is never an automatic fallback. Record material substitutions and resulting evidence. Resolve consequential contract/platform changes through the coordinator, and report an unresolved required capability as blocked rather than silently reducing coverage or retrying unchanged failures indefinitely.
