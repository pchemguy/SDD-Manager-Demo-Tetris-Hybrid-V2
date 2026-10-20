# Browser development policy

Apply this policy before selecting or using browsers, including agent browser tools, project automation and remote/container facilities. Browser-independent work and document-only planning require no browser installation.

Selection and isolation rules are mandatory; framework guidance and capability checks apply only where relevant to the selected work.

## Browser selection

- **Project documents govern browser priorities, requirements and test coverage**, including objectives established with the user during document design. Apply the defaults below only to unspecified choices.
- **When a browser is needed and none is specified, prioritize Chromium.** Include Firefox in the default browser environment. This does not require every individual check to run on both; select checks from the task's acceptance criteria and documented matrix.
- **Other browsers are prohibited by default.** Use them when project documents explicitly define the corresponding priority or requirement. Do not select another browser simply because it is available.
- Use the project's declared automation framework and compatible browser builds. A browser target does not itself select Playwright or add supported platforms.

## Environment isolation

Use a dedicated environment with identifiable browser binaries and isolated profiles, caches and downloads. Its binary location must be assigned to the project, execution job or disposable container, with a known distribution/version compatible with the runner. Reuse an existing contained installation when these conditions are established; downloading again for each task is unnecessary.

Do not search for or use personal/system browser installations, attach to personal sessions, or reuse personal profiles, cookies or extensions. Do not install, replace or reconfigure a global browser. Keep generated binaries/state outside tracked source and production assets; add ignore rules for repository-local generated paths. Clean up only owned sessions and artifacts.

For agent tools and remote facilities, establish the browser identity, dedicated installation and isolated state before use. Tool availability or an isolated profile alone is insufficient. If those conditions cannot be established, treat that facility as unavailable and select a compliant alternative or report the affected browser work blocked.

## Setup

1. Inspect project documents, dependencies, lockfile, runner configuration and declared commands. Establish the required browsers, modes and capabilities for the actual execution host.
2. Provision missing assets from official browser/framework distributions within the authorized environment. Keep browser and runner versions compatible; preserve unrelated toolchains and caches. Host dependencies must remain within the authorized setup scope.
3. Configure binary/state locations consistently for installation and execution, including CI and separate tool processes. Follow the host's shell policies. Put setup sequences in temporary shell files with explicit failure handling; stop after a failed prerequisite before running dependent tests.
4. Exercise the actual project runner/application path. Retain reproducible setup commands, versions, installation location, launch mode and evidence limits in existing project documentation or task evidence.

## When Playwright is selected

Use the project's installed package/CLI with matching managed browser builds. Configure projects and install explicit browser names for the selected set; avoid an unqualified all-browser installation.

Set PLAYWRIGHT_BROWSERS_PATH to the dedicated environment directory for both installation and every automation invocation. The default per-user cache does not by itself establish environment ownership. Playwright's Firefox requires its managed patched build; stock Firefox is not a substitute.

For a documented branded-browser requirement, choose a contained provisioning route. Do not use `playwright install chrome` or another installer that replaces a global browser: PLAYWRIGHT_BROWSERS_PATH does not relocate branded Chrome/Edge installations. Consult [Playwright browsers](https://playwright.dev/docs/browsers) and [CI setup](https://playwright.dev/docs/ci) for version-specific details.

## Verification and recovery

Select evidence required by the task; a successful installation or launch does not establish full application acceptance.

| Capability | Evidence |
| --- | --- |
| Provisioning | Compatible binary, trusted distribution and valid downloaded artifacts; a successful HTTP response alone is insufficient. Exercise fresh owned provisioning when reproducibility is required. |
| Sessions | The repeated context/page lifecycle and teardown used by the actual suite. |
| Visible output | Inspect screenshots or suitable pixel/shape/glyph assertions when rendering matters; DOM text does not prove font or Canvas rasterization. |
| Native events | Exercise actual focus, visibility or input delivery where required. Keep modeled handler checks separate from native evidence. |

On failure, retain the attempted command and observed error. Distinguish provisioning, version, host dependency, launch, session and rendering limitations; investigate supported remedies within the documented browser requirements and isolation rules. Record material substitutions and rerun affected checks after changes. Do not reduce required coverage or retry unchanged failures indefinitely.

Report verified behavior, omissions and environment limits separately. Interactive agent browsing does not prove the project's automated harness. Missing required evidence blocks the affected acceptance claim; unavailable optional checks do not invalidate independently verified behavior.
