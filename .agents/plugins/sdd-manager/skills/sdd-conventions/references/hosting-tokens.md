# Repository hosting tokens

Apply these invariants when storing, locating, or consuming a hosting token for an authorized operation. **sdd-manage** owns credential acceptance, discovery, shell authentication recovery, and protected supply; **sdd-forge**'s active backend owns provider-specific access rules. This convention executes neither authentication nor Git/hosted mutations.

## Files and identity

- **Location:** Keep the conventional token beside the eligible repository's root `.gitignore`; use `gh.tkn` for GitHub or an unambiguous equivalent for another backend.
- **Discovery:** Prefer the active backend's conventional file, then suitable `*.tkn` candidates within that repository. Exclude unrelated repositories and nested Git worktrees. Resolve ambiguous provider/account/repository associations before consumption; file presence proves neither identity nor permission.
- **Exclusion:** Ensure `*.tkn` is in the root `.gitignore`, preserving existing rules. Verify effective exclusion and untracked status before writing or reusing a token; a negating rule can defeat a pattern, and ignore rules do not untrack files. An already tracked token requires explicit remediation, not automatic history rewriting.
- **Persistence:** Save an accepted token only after those checks. Restrict file access with supported permissions or ACLs; report unavailable protection accurately. Preserve unrelated files and staged/unstaged changes. Replace the selected credential only when a suitable replacement is provided for that purpose.
- **Handling:** The ignored token file is the intentional project-local secret exception. Keep values out of tracked files, normal handoffs, reports, fixtures, command arguments, remote URLs, logs, history, and diagnostic output. Read locally and transfer through a supported protected credential channel or process input.

## Authentication and scope

Assume existing shell authentication is usable and attempt the authorized push before looking for a token or requesting one. **sdd-manage** applies its credential recovery protocol after an authentication/access failure; do not make discovery a mandatory pre-push ceremony. Repository token files provide continuity when a shell credential session is lost.

Prefer fine-grained repository-scoped tokens when supported. The active backend defines the permission profile and supported authentication mechanism. Git transport and API clients have separate authentication; success in one does not prove access in the other. Token scope does not authorize unrequested operations, a different destination, or bypassing repository protections.

Provider classification determines whether a 403 concerns credentials, policy, or rate limits. Reauthentication is bounded and cannot fix every failure; retain valid local commits and report unresolved publication or hosted effects. Use synthetic credentials for tests and separate controlled fixtures from observed live-provider outcomes.
