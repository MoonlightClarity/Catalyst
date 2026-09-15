# Engineering findings that must survive chat handoff

## Current runtime / release

Latest prototype tested visually: **Catalyst 0.6.3-alpha.3**.

The alpha.3 overlay applied sufficiently to launch. The final updater then failed in the dependency-license step.

## License-validation failure

Observed Windows output:

```text
License check failed with exit code 2.
Catalyst dependency license validation failed with exit code 1.
Catalyst 0.6.3-alpha.3 apply/validation failed with exit code 1.
```

Interpretation established in the conversation:

- `licenses.ps1` exit **1** means an actual blocked/problematic license was detected.
- exit **2** means the audit itself could not execute successfully.
- alpha.3 did not materially change the dependency set relative to the preceding UI alpha; the updater nevertheless made the full dependency audit fatal.

Recommended release-script correction:

- npm dependencies changed → require npm license audit;
- Cargo.toml/Cargo.lock changed → require Rust license audit;
- ecosystem dependencies unchanged → reuse the established dependency-license baseline for that ecosystem rather than making an unavailable audit fatal;
- retain an explicit standalone “full license audit” mode when the environment supports it.

Do not misreport exit 2 as “bad dependency license found.”

### Resolution — 2026-09-13

This release-tooling defect is resolved in the current tree. The license checker now reuses validated npm/Cargo fingerprints when dependencies and policy are unchanged, while `--full` forces both ecosystem audits. Cached validation and the explicit full audit have both passed on the current dependency set. Preserve the failure history above because it explains the validator design, but do not treat license validation as a current blocker unless manifests, lockfiles, or audit policy change.

## Tauri configuration drift

User provided current files:

### `src-tauri/tauri.conf.json`

- productName: Catalyst
- **version: 0.5.1**
- identifier: `com.catalystresearch.app`
- no explicit `bundle.icon` list
- normal main window settings
- SQL preload `sqlite:catalyst.db`

### `src-tauri/Cargo.toml`

- package `catalyst`
- **version: 0.5.1**
- Tauri 2
- dialog/fs/persisted-scope/sql plugins
- serde / serde_json

This is stale against frontend/release version `0.6.3-alpha.3` and is now technical debt.

### Runtime-boundary update — 2026-09-13

The runtime decision is now settled: Catalyst uses the Vite/web runtime with canonical XML workspace persistence (`XmlWorkspaceRepository`). The former Tauri/SQLite shell has been moved from `src-tauri` to `legacy/tauri-shell` and is historical reference only, not an active launch or persistence path. Any future desktop shell should wrap the XML-backed application rather than silently restoring SQLite as the persistence authority.

## Native/runtime application icon

Replacing icon files in `src-tauri/icons/` did **not** remove the boxed `E` in the Windows development window/taskbar.

Implications:

- bundle assets alone are insufficient for the current development/runtime path;
- alpha.4 should explicitly synchronize native version/config and icon references;
- define the bundle icon list explicitly;
- investigate/set the development window icon explicitly using the supported Tauri runtime/native path rather than assuming bundled-app behavior applies to `tauri dev`;
- boxed placeholder icon should become an acceptance failure.

## Version synchronization rule

Future releases should synchronize at least:

- `package.json`;
- release manifest;
- `src-tauri/tauri.conf.json`;
- `src-tauri/Cargo.toml`.

Do not continue excluding `src-tauri` from release reasoning simply because chat-friendly source packages historically omitted it for size.

## Visual runtime finding from alpha.3

Screenshot `Capture(10).PNG` established:

- symbol family too abstract;
- central “Untitled note” mark not self-explanatory;
- top-right controls visually weak;
- inspector still dominates simple selection;
- microcopy adds noise;
- no strong visual landmarks;
- runtime app icon still placeholder.

Treat these as failures of portrayal architecture, not bugs to patch individually.
