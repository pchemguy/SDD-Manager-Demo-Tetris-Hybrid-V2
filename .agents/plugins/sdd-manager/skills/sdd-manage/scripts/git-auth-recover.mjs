/**
 * Request-scoped HTTPS Git recovery. Node >=22; no third-party packages.
 *
 * Main entry: push|readback --repo PATH --remote NAME --url HTTPS_URL
 *   --ref refs/heads/NAME|refs/tags/NAME --expect FULL_OBJECT_ID
 *   [--token-file gh.tkn] [--timeout-ms 30000]
 *
 * Policy/authorization belongs to sdd-manage/references/credentials.md. This
 * utility validates one destination/ref, supplies credentials through Git's
 * helper protocol and returns JSON. It never installs helpers, edits Git config,
 * persists credentials, force-pushes, deletes refs, or retries a push in a loop.
 * Imports have no effects. See git-auth-recover.md for the complete CLI contract.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { ProtectedInputError as RecoveryError, sameDirectory, childEnv, readToken } from './protected-token.mjs';
export { ProtectedInputError as RecoveryError, validateToken, checkWindowsDacl,
  windowsUserContext, parseWindowsAclExport, readToken } from './protected-token.mjs';

const SCRIPT = fileURLToPath(import.meta.url);
const OID = /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/;
const USAGE = 'push|readback --repo PATH --remote NAME --url HTTPS_URL --ref FULL_REF --expect FULL_OBJECT_ID [--token-file gh.tkn] [--timeout-ms 30000]';

const fail = (code, stage) => { throw new RecoveryError(code, stage); };

/**
 * Parse and validate the narrow CLI without I/O.
 * @param {string[]} args Operation and explicit options, excluding node/script.
 * @returns {object} Validated scope, defaults and bounded timeout.
 * @throws {RecoveryError} Invalid or incomplete scope; never embeds input values.
 */
export function parseCli(args) {
  if (!['push', 'readback'].includes(args[0])) fail('invalid_operation');
  const options = { operation: args[0], tokenFile: 'gh.tkn', timeoutMs: 30000 };
  const names = { '--repo': 'repo', '--remote': 'remote', '--url': 'url', '--ref': 'ref',
    '--expect': 'expect', '--token-file': 'tokenFile', '--timeout-ms': 'timeoutMs' };
  const seen = new Set();
  for (let i = 1; i < args.length; i += 2) {
    const key = names[args[i]], value = args[i + 1];
    if (!key || seen.has(key) || !value || value.startsWith('--')) fail('invalid_arguments');
    seen.add(key); options[key] = value;
  }
  if (!['repo', 'remote', 'url', 'ref', 'expect'].every(key => seen.has(key))) fail('missing_scope');
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/.test(options.remote) || !OID.test(options.expect)) fail('invalid_scope');
  if (!/^refs\/(heads|tags)\/.+/.test(options.ref) || /[\x00-\x20\x7f]/.test(options.ref)) fail('invalid_ref');
  options.timeoutMs = Number(options.timeoutMs);
  if (!Number.isInteger(options.timeoutMs) || options.timeoutMs < 100 || options.timeoutMs > 120000) fail('invalid_timeout');
  validateTargetUrl(options.url);
  return options;
}

/**
 * @param {string} value Exact canonical HTTPS destination from the coordinator.
 * @returns {URL} Parsed credential-free URL; no network or rewrite is performed.
 * @throws {RecoveryError} Unsafe, noncanonical or unsupported URL.
 */
export function validateTargetUrl(value) {
  let url, credentialPath;
  try { url = new URL(value); credentialPath = gitCredentialPath(url); }
  catch { fail('invalid_url'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash ||
      !url.hostname || !credentialPath || /[\s\x00-\x1f\x7f]/.test(value) ||
      /[\x00-\x1f\x7f]/.test(credentialPath) || url.href !== value) fail('invalid_url');
  return url;
}

/** Match Git: strip literal leading slashes, decode once, trim trailing slashes. */
function gitCredentialPath(url) {
  return decodeURIComponent(url.pathname.replace(/^\/+/, '')).replace(/\/+$/, '');
}

/**
 * Build Git's documented shell-helper command; credentials are never arguments.
 * @param {string} node Actual Node executable path.
 * @param {string} script Installed script path.
 * @param {string[]} args Repository, token-file path and selected URL only.
 * @param {string} platform Platform used to normalize native executable paths.
 * @returns {string} Command-local helper setting with shell-quoted arguments.
 */
export function helperCommand(node, script, args, platform = process.platform) {
  const quote = value => "'" + String(value).replaceAll("'", "'\\''") + "'";
  const executable = value => platform === 'win32' ? value.replaceAll('\\', '/') : value;
  return '!' + [executable(node), executable(script), '--credential-helper', ...args].map(quote).join(' ');
}

/** Direct executable launch with bounded captured output; caller never prints it. */
function processResult(executable, args, { cwd, env, timeoutMs = 30000, input } = {}) {
  return spawnSync(executable, args, { cwd, env, input, encoding: 'utf8', shell: false,
    windowsHide: true, timeout: timeoutMs, killSignal: 'SIGKILL', maxBuffer: 1024 * 1024 });
}
function checked(result, stage) {
  if (result.error) fail(result.error.code === 'ETIMEDOUT' ? 'process_timeout' : 'process_unavailable', stage);
  if (result.signal) fail('process_signal', stage);
  if (result.status !== 0) fail('git_failed', stage);
  return result.stdout || '';
}

/** Parse only security-relevant credential fields; do not log protocol input. */
export function credentialRequest(input) {
  if (Buffer.byteLength(input) > 65536) fail('invalid_credential_request', 'helper');
  const result = {};
  for (const line of input.split(/\r?\n/)) {
    if (!line) break;
    const split = line.indexOf('=');
    if (split < 1) fail('invalid_credential_request', 'helper');
    const key = line.slice(0, split);
    if (!['protocol', 'host', 'path', 'username'].includes(key)) continue;
    if (Object.hasOwn(result, key)) fail('invalid_credential_request', 'helper');
    result[key] = line.slice(split + 1);
  }
  return result;
}

/** Exact ref readback. Ref object IDs, including annotated tag objects, are literal. */
export function remoteOid(stdout, ref) {
  const rows = stdout.trim() ? stdout.trim().split(/\r?\n/) : [];
  if (!rows.length) return null;
  if (rows.length !== 1) fail('ambiguous_readback', 'readback');
  const [oid, name, extra] = rows[0].split(/\s+/);
  if (!OID.test(oid) || name !== ref || extra) fail('invalid_readback', 'readback');
  return oid;
}

/**
 * Validate local context and perform at most one explicit non-forced push plus
 * readback, or readback alone. `execute` injection is for controlled tests;
 * production uses native Git. No subprocess text is returned in public results.
 * @param {object} options Explicit operation, repo, remote, URL, ref and expect.
 * @param {Function} execute Bounded process adapter; production default is native.
 * @returns {object} Versioned JSON-safe remote outcome, never credential contents.
 * @throws {RecoveryError|Error} Preflight failure; CLI maps errors to safe JSON.
 */
export function recover(options, execute = processResult) {
  options = parseCli([options.operation, ...['repo', 'remote', 'url', 'ref', 'expect'].flatMap(key => ['--' + key, String(options[key] ?? '')]), '--token-file', options.tokenFile ?? 'gh.tkn', '--timeout-ms', String(options.timeoutMs ?? 30000)]);
  const env = childEnv();
  const repo = fs.realpathSync(options.repo);
  const git = (args, auth = []) => execute('git', ['-C', repo, ...auth, ...args], { cwd: repo, env, timeoutMs: options.timeoutMs });
  const root = checked(git(['rev-parse', '--show-toplevel']), 'repository').trim();
  if (!sameDirectory(root, repo)) fail('repo_must_be_root');
  checked(git(['check-ref-format', options.ref]), 'ref');
  if (options.operation === 'push') {
    const source = checked(git(['show-ref', '--verify', '--hash', options.ref]), 'ref').trim();
    if (source !== options.expect) fail('source_mismatch');
  } else checked(git(['cat-file', '-e', options.expect]), 'ref');
  const target = validateTargetUrl(options.url);
  const destination = () => {
    // A named remote's foreign-VCS override bypasses the URL's HTTPS transport.
    const vcs = git(['config', '--get-all', `remote.${options.remote}.vcs`]);
    if (vcs.error || vcs.signal || vcs.status !== 1) fail('remote_helper_unsupported');
    const urls = checked(git(['remote', 'get-url', '--push', '--all', options.remote]), 'destination').trim().split(/\r?\n/);
    if (urls.length !== 1 || urls[0] !== options.url) fail('destination_mismatch');
    const readUrl = checked(git(['ls-remote', '--get-url', options.url]), 'destination').trim();
    if (readUrl !== options.url) fail('readback_url_rewritten');
  };
  destination();
  readToken(repo, options.tokenFile, git);
  const helper = helperCommand(process.execPath, SCRIPT, [repo, options.tokenFile, options.url]);
  const contextUrl = target.origin + '/' + gitCredentialPath(target).split('/').map(encodeURIComponent).join('/');
  const context = `credential.${contextUrl}`;
  const auth = ['-c', 'credential.helper=', '-c', `${context}.helper=`, '-c', `${context}.helper=${helper}`,
    '-c', 'credential.useHttpPath=true', '-c', `${context}.useHttpPath=true`,
    '-c', `${context}.username=x-access-token`, '-c', 'credential.interactive=false',
    '-c', 'core.askPass=', '-c', 'http.followRedirects=false', '-c', `http.${options.url}.followRedirects=false`, '-c', 'http.extraHeader=',
    '-c', `http.${options.url}.extraHeader=`];
  // Re-resolve after file validation; no persistent remote/helper writes occur.
  destination();
  let pushed;
  if (options.operation === 'push') {
    pushed = git(['push', '--porcelain', '--no-follow-tags', '--recurse-submodules=no',
      options.remote, `${options.expect}:${options.ref}`], [...auth, '-c', `remote.${options.remote}.mirror=false`]);
  }
  let observed;
  try { observed = remoteOid(checked(git(['ls-remote', '--refs', options.url, options.ref], auth), 'readback'), options.ref); }
  catch (error) {
    return { schema_version: 1, ok: false, code: error instanceof RecoveryError ? error.code : 'readback_failed',
      stage: 'readback', remote_state: 'unknown', push_attempted: !!pushed };
  }
  const match = observed === options.expect;
  return { schema_version: 1, ok: match, code: match ? (pushed && (pushed.error || pushed.signal || pushed.status !== 0) ? 'verified_after_push_error' : 'remote_verified') : (observed ? 'remote_mismatch' : 'remote_absent'),
    stage: 'readback', remote_state: match ? 'matching' : observed ? 'different' : 'absent',
    push_attempted: !!pushed, expected: options.expect, observed, ref: options.ref };
}

/** Internal Git protocol entry. Credential stdout is consumed only by Git. */
function helperMain(args) {
  const [repo, tokenFile, url, action, ...extra] = args;
  if (extra.length || !repo || !tokenFile || !url || !['get', 'store', 'erase'].includes(action)) fail('invalid_helper_arguments');
  if (action !== 'get') return;
  const buffer = Buffer.alloc(65537);
  let length = 0;
  while (length < buffer.length) {
    const read = fs.readSync(0, buffer, length, buffer.length - length, null);
    if (!read) break;
    length += read;
    if (buffer.subarray(0, length).includes(Buffer.from('\n\n')) || buffer.subarray(0, length).includes(Buffer.from('\r\n\r\n'))) break;
  }
  if (length > 65536) fail('invalid_credential_request');
  const request = credentialRequest(buffer.subarray(0, length).toString('utf8'));
  const target = validateTargetUrl(url);
  // Git URL-decodes the credential path once; validation excludes protocol controls.
  if (request.protocol !== 'https' || request.host !== target.host || request.path !== gitCredentialPath(target) ||
      (request.username && request.username !== 'x-access-token')) return;
  const git = args => processResult('git', ['-C', repo, ...args], { cwd: repo, env: childEnv() });
  const token = readToken(repo, tokenFile, git);
  process.stdout.write(`username=x-access-token\npassword=${token}\n\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === SCRIPT) {
  if (process.argv[2] === '--credential-helper') {
    try { helperMain(process.argv.slice(3)); } catch { process.exitCode = 1; }
  } else {
    try {
      if (Number(process.versions.node.split('.')[0]) < 22) fail('node_22_required');
      if (process.argv[2] === '--help') process.stdout.write(USAGE + '\n');
      else { const result = recover(parseCli(process.argv.slice(2))); process.stdout.write(JSON.stringify(result) + '\n'); process.exitCode = result.ok ? 0 : 2; }
    } catch (error) {
      process.stdout.write(JSON.stringify({ schema_version: 1, ok: false, code: error instanceof RecoveryError ? error.code : 'local_io_failed', stage: error instanceof RecoveryError ? error.stage : 'preflight' }) + '\n');
      process.exitCode = 1;
    }
  }
}
