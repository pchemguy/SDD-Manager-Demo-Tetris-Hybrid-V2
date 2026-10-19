/**
 * Protected root-relative token input shared by SDD Manager utilities.
 *
 * Node >=22; native Git plus Windows System32 identity/ACL tools or POSIX
 * ownership/mode checks. This module never stores credentials, repairs file
 * permissions/configuration, performs network requests or runs on import.
 * Callers establish the trusted repository and bound their Git runner; this
 * validates containment, exclusion, file identity, protection and token bytes.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const MAX_TOKEN = 16384;
/** A public error code/stage, deliberately excluding raw subprocess output. */
export class ProtectedInputError extends Error {
  constructor(code, stage = 'preflight') { super(code); this.code = code; this.stage = stage; }
}
const fail = (code, stage) => { throw new ProtectedInputError(code, stage); };

/**
 * Compare actual directory identity across native case/short-path spellings.
 * @param {string} a Existing directory path.
 * @param {string} b Existing directory path.
 * @returns {boolean} Whether both identify the same directory.
 * @throws {Error} Native metadata cannot be read.
 */
export function sameDirectory(a, b) {
  const left = fs.statSync(a), right = fs.statSync(b);
  return left.isDirectory() && right.isDirectory() && left.dev === right.dev && left.ino === right.ino;
}

/**
 * Accept one normal line ending; never trim malformed credential values.
 * @param {string} raw Bounded file contents; never pass via argv/logging.
 * @returns {string} Secret, for private authenticated-client use only.
 * @throws {ProtectedInputError} Empty, oversized or non-single-line ASCII token.
 */
export function validateToken(raw) {
  const token = raw.replace(/\r?\n$/, '');
  if (!token || Buffer.byteLength(raw) > MAX_TOKEN || /[^\x21-\x7e]/.test(token)) fail('invalid_token');
  return token;
}

/**
 * Conservative Windows DACL policy, not a complete effective-access audit.
 * @param {string} sddl DACL from native icacls metadata export.
 * @param {string} userSid Current user's SID from whoami.
 * @param {boolean} localAccount Whether native identity matches this computer.
 * @returns {void}
 * @throws {ProtectedInputError} Unsupported ACL or grant to another principal.
 */
export function checkWindowsDacl(sddl, userSid, localAccount = false) {
  if (!/^S-1-\d+(?:-\d+)+$/.test(userSid) || !sddl.startsWith('D:')) fail('acl_unverified');
  const aces = sddl.match(/\([^()]*\)/g) || [];
  const remainder = sddl.replace(/\([^()]*\)/g, '');
  if (!aces.length || !/^D:[PAIR]*$/.test(remainder)) fail('acl_unverified');
  const current = new Set([userSid]);
  if (localAccount && userSid.endsWith('-500')) current.add('LA');
  if (localAccount && userSid.endsWith('-501')) current.add('LG');
  const allowed = new Set([...current, 'SY', 'BA', 'S-1-5-18', 'S-1-5-32-544']);
  let ownGrant = false;
  for (const ace of aces) {
    const parts = ace.slice(1, -1).split(';');
    if (parts.length !== 6 || !['A', 'D'].includes(parts[0]) || parts[3] || parts[4]) fail('acl_unverified');
    if (parts[0] === 'A' && !allowed.has(parts[5])) fail('token_permissions');
    if (parts[0] === 'A' && current.has(parts[5]) && !parts[1].includes('IO')) ownGrant = true;
  }
  if (!ownGrant) fail('acl_unverified');
}

/**
 * Read the native current-user CSV identity without treating domain RID 500/501
 * as this computer's built-in account. Ambiguous identity is not an ACL bypass.
 * @param {string} stdout whoami /user /fo csv /nh output, never credential data.
 * @param {string} computerName Native computer name, normally os.hostname().
 * @returns {{sid: string, localAccount: boolean}} Validated current-user context.
 * @throws {ProtectedInputError} Unsupported identity output.
 */
export function windowsUserContext(stdout, computerName) {
  const record = stdout.trim().match(/^"([^"\r\n]+)","(S-1-\d+(?:-\d+)+)"$/);
  if (!record) fail('acl_unverified');
  const parts = record[1].split('\\');
  return { sid: record[2], localAccount: parts.length === 2 && parts[0].toLowerCase() === computerName.toLowerCase() };
}

/**
 * Preserve the process context while excluding credential/trace channels.
 * @param {object} [base] Process environment; values are never logged.
 * @returns {object} Noninteractive environment without injected trace/auth flags.
 * @throws {ProtectedInputError} Git relocation/config environment is present.
 */
export function childEnv(base = process.env) {
  const env = {};
  for (const [key, value] of Object.entries(base)) {
    if (/^(GIT_DIR|GIT_WORK_TREE|GIT_COMMON_DIR|GIT_INDEX_FILE|GIT_CONFIG_COUNT|GIT_CONFIG_KEY_\d+|GIT_CONFIG_VALUE_\d+)$/i.test(key)) fail('relocated_git_environment');
    if (/^(GIT_ASKPASS|SSH_ASKPASS|GIT_TRACE.*|GIT_CURL_VERBOSE|GIT_TRACE_CURL.*|GIT_TERMINAL_PROMPT|GCM_INTERACTIVE)$/i.test(key)) continue;
    env[key] = value;
  }
  return { ...env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'never' };
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

/**
 * Decode icacls /save metadata, including native BOM-less UTF-16LE exports.
 * @param {Buffer} bytes ACL metadata only, bounded to 1 MiB; never token data.
 * @returns {string} One exported DACL, for conservative policy validation.
 * @throws {ProtectedInputError} Ambiguous encoding, malformed or unexpected records.
 */
export function parseWindowsAclExport(bytes) {
  if (!Buffer.isBuffer(bytes) || !bytes.length || bytes.length > 1024 * 1024) fail('acl_unverified');
  const utf16 = (bytes[0] === 0xff && bytes[1] === 0xfe) || bytes.includes(0);
  let content;
  try { content = new TextDecoder(utf16 ? 'utf-16le' : 'utf-8', { fatal: true }).decode(bytes); }
  catch { fail('acl_unverified'); }
  const records = content.split(/\r?\n/).filter(Boolean);
  if (content.includes('\0') || records.length !== 2 || !records[1].startsWith('D:')) fail('acl_unverified');
  return records[1];
}

/** Inspect Windows ACLs without PowerShell or exporting credential material. */
function windowsPermissions(filename, remainingMs) {
  const env = childEnv();
  // Git's shell can prepend GNU tools to PATH; require native Windows utilities.
  const systemRoot = process.env.SystemRoot;
  if (!systemRoot || !path.isAbsolute(systemRoot)) fail('windows_tools_unavailable', 'acl');
  const nativeTool = name => path.join(systemRoot, 'System32', name);
  const bounded = (name, args) => {
    const remaining = remainingMs();
    if (remaining <= 0) fail('process_timeout', 'acl');
    return checked(processResult(nativeTool(name), args, { env, timeoutMs: Math.max(1, Math.floor(Math.min(30000, remaining))) }), 'acl');
  };
  const identity = bounded('whoami.exe', ['/user', '/fo', 'csv', '/nh']);
  const { sid, localAccount } = windowsUserContext(identity, os.hostname());
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'sdd-auth-acl-'));
  try {
    const saved = path.join(directory, 'acl.txt');
    bounded('icacls.exe', [filename, '/save', saved, '/q']);
    checkWindowsDacl(parseWindowsAclExport(fs.readFileSync(saved)), sid, localAccount);
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
}

/**
 * Validate a selected root-relative token before bounded reading. The trusted
 * repository/user owns the path; this is not a hostile same-user race sandbox.
 * POSIX owner-only mode and Windows conservative DACL checks do not modify ACLs.
 * @param {string} repo Resolved eligible worktree root.
 * @param {string} tokenFile Root-relative selected token-file path.
 * @param {Function} git Bounded Git runner returning spawnSync-style results.
 * @param {string} platform Native platform; tests may assess pure ACL separately.
 * @param {{remainingMs?: Function}} controls Optional caller's remaining process budget.
 * @returns {string} Secret for private credential use, never diagnostic output.
 * @throws {ProtectedInputError|Error} Invalid protection/context, format or local I/O.
 */
export function readToken(repo, tokenFile, git, platform = process.platform, { remainingMs = () => 30000 } = {}) {
  if (path.isAbsolute(tokenFile)) fail('token_outside_repository');
  const filename = path.resolve(repo, tokenFile), relative = path.relative(repo, filename);
  if (!relative || relative.startsWith('..' + path.sep) || relative === '..') fail('token_outside_repository');
  let current = repo;
  for (const part of relative.split(path.sep)) {
    current = path.join(current, part);
    if (fs.lstatSync(current).isSymbolicLink()) fail('token_symlink');
  }
  const info = fs.lstatSync(filename);
  if (!info.isFile() || info.nlink !== 1 || info.size > MAX_TOKEN) fail('invalid_token_file');
  const parentRoot = checked(git(['-C', path.dirname(filename), 'rev-parse', '--show-toplevel']), 'token');
  if (!sameDirectory(parentRoot.trim(), repo)) fail('token_outside_repository');
  if (git(['check-ignore', '--no-index', '--', relative]).status !== 0) fail('token_not_ignored');
  const tracked = git(['ls-files', '--error-unmatch', '--', `:(literal)${relative}`]);
  if (tracked.status !== 1 || tracked.error || tracked.signal) fail('token_tracked_or_unknown');
  if (platform === 'win32') windowsPermissions(filename, remainingMs);
  else if (info.uid !== process.getuid() || (info.mode & 0o077)) fail('token_permissions');
  const descriptor = fs.openSync(filename, fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW || 0));
  try {
    const actual = fs.fstatSync(descriptor);
    if (actual.dev !== info.dev || actual.ino !== info.ino) fail('token_changed');
    const data = Buffer.alloc(MAX_TOKEN + 1);
    const length = fs.readSync(descriptor, data, 0, data.length, 0);
    if (length > MAX_TOKEN) fail('invalid_token');
    return validateToken(data.subarray(0, length).toString('utf8'));
  } finally { fs.closeSync(descriptor); }
}
