# Transient Git authentication recovery

Use this utility through [credential recovery](../references/credentials.md) after the coordinator classifies an observed authentication failure or credential-helper blockage and establishes operation authority. [git-auth-recover.mjs](git-auth-recover.mjs) implements credential transport and exact ref readback; it does not decide approvals, retry policy, document readiness or release acceptance.

The publication owner applies [bounded Git-operation monitoring](../references/git-workflows.md#monitor-pending-git-operations) to the original call before selecting recovery. This utility bounds its own invocations; it cannot monitor or cancel an earlier separately launched task. Reconcile that task's disposition and select readback first when its push outcome is uncertain, before another push.

## Runtime and invocation

Require Node.js 22+ and Git on PATH. Native Windows additionally requires whoami.exe and icacls.exe under SystemRoot/System32; absolute native paths prevent Git's shell PATH from selecting a GNU substitute. No PowerShell, libsecret, keyring, npm package or persistent credential manager is required. This runtime is optional for other SDD workflows. If unavailable, report the missing facility and select another supported protected mechanism; do not install software automatically.

Keep the bundled [protected-token.mjs](protected-token.mjs) beside this module. It owns shared root/file/protection validation and is also used by the forge completion utility; copying only this entry script is insufficient. Git recovery retains its push/readback CLI and result contract.

Illustrative invocation, with every placeholder replaced from the already established operation:

```text
node "PLUGIN_ROOT/skills/sdd-manage/scripts/git-auth-recover.mjs" push --repo "REPOSITORY_ROOT" --remote "REMOTE_NAME" --url "https://host.example/owner/project.git" --ref "refs/heads/BRANCH_NAME" --expect "FULL_OBJECT_ID"
```

The same argument form works from Windows CMD or a Linux shell. Node launches Git directly. Git uses its own documented shell-helper interface to launch Node again with quoted executable/script paths; Git for Windows must include its normal helper-launching facilities. No generated .sh/.cmd helper file or token-bearing environment value is needed.

| Argument | Contract |
| --- | --- |
| `push` or `readback` | One non-forced explicit ref push followed by readback, or readback alone; no arbitrary Git command tail |
| `--repo` | Existing non-bare worktree root; no implicit repository discovery or initialization |
| `--remote` | Established named remote with exactly one effective push URL |
| `--url` | Exact canonical HTTPS push URL, including actual push-URL divergence; no userinfo, query, fragment, controls or automatic SSH conversion |
| `--ref` | One full `refs/heads/...` or `refs/tags/...` ref |
| `--expect` | Full lowercase 40/64-character object ID. Push requires the local ref to equal it; readback requires the object locally but can reconcile an older object after local advancement. Annotated tags compare the tag object's ID, not its peeled commit. |
| `--token-file` | Optional root-relative protected ignored file, default `gh.tkn`; no external/nested-repository/symlink path |
| `--timeout-ms` | Per-child limit, 100–120000 ms, default 30000; captured output bounded at 1 MiB. This is not a total multi-step deadline or a guarantee about hostile descendant processes. |

No force/deletion/multi-ref push, follow-tags expansion or submodule pushes are performed. Existing hooks still apply. A readback uses the actual push URL rather than assuming the fetch URL matches. Ambiguous URLs, unexpected rewrites, configured foreign-VCS remote helpers or changed local source block the operation. Percent-encoded repository paths must decode as valid UTF-8 without control characters. Credential matching follows Git's literal leading-slash removal, single decoding and trailing-slash trimming; internal or encoded leading slashes remain significant. This does not change the pinned network destination.

## Token protection and effects

The caller establishes the token's provider/account suitability and protected ownership under the hosting-token convention. The script checks effective exclusion, untracked status, file containment/type and content before reading. Accept one terminal LF/CRLF; reject embedded controls, whitespace, empty or oversized tokens. POSIX additionally requires current ownership and no group/other permissions.

Windows exports only DACL metadata to a temporary directory and removes it in finally. Conservative SDDL checks allow grants only to the current user, SYSTEM and Administrators, and require an explicit applicable current-user grant. Built-in account aliases LA/LG count as the current user only when native identity matches this computer and the corresponding account SID; a domain account sharing its numeric RID does not qualify. Unknown/complex ACL forms block; do not treat Windows stat mode as a Unix protection check. This is a DACL policy check, not a full Windows ownership/integrity audit: the coordinator must establish trusted ownership/path context. The utility never changes ownership, ignore rules, ACLs or Git config to make a token eligible.

Authentication is scoped with command-local Git configuration. Existing persistent helper configuration is untouched. The internal helper supplies x-access-token/token only to the matching HTTPS host and repository path, ignores store/erase, and rereads the validated file. Redirects and conflicting credential/trace channels are disabled for this invocation; normal proxy/TLS configuration is retained. Tokens never enter the utility's argv, child environment or public JSON. Do not invoke internal `--credential-helper` mode in a terminal: its stdout is a secret-bearing protocol channel consumed by Git.

The token file remains the intentional durable input. No extra credential database or vault entry is created. The transient path is not an automatic fallback to plaintext `credential-store`; persistent helper setup remains a separately selected alternative in credentials.md.

## Results, exits and recovery

Normal CLI calls emit one JSON object with `schema_version: 1`. `--help` prints usage. Public failures contain sanitized code/stage and no raw Git/helper output; helper mode emits only its private credential protocol.

| Exit / result | Meaning |
| --- | --- |
| `0`, `remote_verified` | The selected destination/ref currently equals the expected object. No claim that an entire workflow/release is complete. |
| `0`, `verified_after_push_error` | Push reported an error/timeout/signal but exact readback found the expected ref. Remote state is verified; do not claim which attempt wrote it or that a credential has broader permissions. |
| `2`, `remote_absent` or `remote_mismatch` | Readback completed and the target is absent/different. Preserve the actual local/remote state; do not force or silently change the expected ref. |
| `2`, readback failure with `remote_state: unknown` | The effect remains unverified. Inspect/reconcile before another push; no automatic retry loop. |
| `1`, preflight/local error | Scope/input/tooling/protection check failed. Inspect `code`/`stage`; correct only within existing authority. No helper configuration is persisted. |

Successful results additionally identify expected/observed ref object and whether a push was attempted. Common preflight codes include invalid arguments/URL/ref, source mismatch, destination mismatch, token permissions/ignore/tracking issues, and missing/process timeout/signal failures. Unexpected local I/O returns a generic sanitized local_io_failed result. JSON must never be presented as proof of API-client authentication or an explicit human grant.

The publication owner may use this exact readback as remote verification for the selected ref, then verify any additional workflow contract. Tag-to-release-source peeling, multiple publication targets and further API/issue operations remain separate. A matching public ref does not by itself prove token permissions; an already matching ref may exist independently of this attempted push.

## Verification and maintenance

Run source-only tests from the SDD Manager Git root:

```text
node --test tests/git-auth-recover.test.mjs
```

Tests use isolated repositories and synthetic tokens; package consumers do not need the source test tree. The repository CI matrix selects native Windows CMD/Linux and Node 22/24. Pure quoting/SDDL tests, controlled transport results and native Git helper protocol each establish different coverage; none proves live-provider authentication. Consult current campaign/CI evidence before claiming native Windows support was observed.

Imports are effect-free. Exported helpers have JSDoc contracts; `recover` returns structured outcomes and throws sanitized RecoveryError on preflight errors. File I/O errors can also throw internally; the CLI sanitizes them. Preserve the helper's no-store/context checks and one-push bound when extending the script. Keep unrelated scripting candidates outside this utility's responsibility.
