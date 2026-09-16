# Catalyst security model

Status: baseline security/threat-model record for the 1.0 local desktop architecture.

## Scope and trust boundary

Catalyst is a local-first analytical workspace. Its primary trust boundary is the user's machine: source PDFs, notes, Outline state, Methods work, and `.catalyst.xml` session files are local application data rather than a hosted account or server-side workspace.

The Windows desktop build uses an Electron shell around the production web bundle. The shell serves packaged assets on loopback (`127.0.0.1`) and does not intentionally expose the application server on a LAN interface.

## Existing safeguards

The tracked desktop shell and release verifier currently enforce or check these controls:

- Electron `contextIsolation` is enabled;
- renderer Node integration is disabled;
- the renderer sandbox is enabled;
- the packaged HTTP server binds to loopback only;
- new Electron windows are denied;
- external HTTP(S) navigation is handed to the system browser;
- Electron Builder packages only the explicit shell, app icon, package manifest, and production `dist/` payload;
- release verification rejects test/source-map/TypeScript material inside staged `dist/`.
## Threats that remain in scope

Catalyst should treat local files as untrusted input even when they were intentionally opened. Important classes include malformed PDFs, malformed or unexpectedly large session XML, path/reference confusion when reconnecting source files, renderer/library vulnerabilities, denial-of-service from very large workspaces, and accidental disclosure through exported/copied project material.

The local-first model reduces remote service exposure but does not make local content inherently safe. A malicious document can still target parser/viewer dependencies, and a compromised local account can read Catalyst data with that account's filesystem permissions.

## Data and recovery expectations

Catalyst should never require mutation of an original source PDF for normal annotation or workspace persistence. Explicit session Save/Load and automatic workspace persistence should remain separate from source files. Recovery logic should fail closed enough to avoid silently replacing valid persisted work with malformed input.

Users remain responsible for operating-system access control, backups of important session files, and deciding whether source material is appropriate to store on the device. Catalyst should not imply encryption-at-rest unless it is actually implemented and validated.

## Release-security maintenance

For each desktop release:

1. build the production web bundle from the intended source revision;
2. generate or verify desktop staging from tracked release inputs;
3. run the release verifier before packaging;
4. record the artifact digest and source revision;
5. review dependency/security advisories and license changes;
6. avoid claiming code signing, sandbox guarantees, encryption, or reproducible binaries beyond what was actually validated.
## Explicit non-claims

This baseline does not establish that Catalyst has undergone a professional penetration test, that every PDF parser path is memory-safe, that local session data is encrypted, or that the published Windows executable is code-signed. It also does not establish byte-for-byte build reproducibility.

## Follow-up hardening

Useful future work includes dependency-advisory automation, bounded-size and fuzz-style tests for session parsing, explicit large-file/workspace limits where failure is currently unbounded, a documented vulnerability-reporting channel, and periodic review of Electron navigation/CSP behavior if the desktop shell changes.

Security changes should be tested at the narrowest responsible layer and should not broaden Catalyst's product scope merely to add security theater.