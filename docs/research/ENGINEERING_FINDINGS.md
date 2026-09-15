# Engineering findings that must survive chat handoff

Status: **historical engineering record with resolution notes**. Current runtime/release authority is `../CURRENT_ARCHITECTURE.md`; the active web/XML runtime and 2026-09-15 clean validation supersede the alpha.3/Tauri release state described below.

## Historical alpha.3 runtime / release

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

## Source/research handoff correction

The historical `gather_source.ps1` excluded the entire `src-tauri` directory. That avoided large native build output but also omitted small authoritative native files such as `tauri.conf.json`, `Cargo.toml`, Rust source/capabilities, and icon configuration. This contributed to native-version/icon drift being invisible in chat handoffs.

The new source-handoff standard includes native source/configuration and excludes only generated native output such as `src-tauri/target/`. It also requires `docs/research/` so the project's accumulated research survives independently of chat history.

## Canonical cleaned-archive audit — 2026-09-11

The user supplied a freshly cleaned full source archive (`Catalyst(3).zip`) and it is now the preferred baseline for further work. It confirms that integrated research and native Tauri source/configuration are present together.

The audit also exposed source-hygiene debt that should be repaired before the next application release:

- legacy root-level research files still exist and differ from their newer canonical `docs/research/` copies, so the conservative cleaner correctly preserved them instead of guessing;
- `specs/` duplicates much of `docs/`, with several files byte-identical but some older/different; it must be reconciled and assigned an explicit archival/canonical status rather than silently deleted;
- a research-integration transport ZIP remains in the project root despite the goal of a transport-free clean source tree; future gather/clean validation should detect this deterministically;
- `src-tauri/tauri.conf.json` and `src-tauri/Cargo.toml` still report native version `0.5.1` while the frontend/release is `0.6.3-alpha.3`;
- the native configuration still lacks explicit bundle icon declarations.

Do not let these maintenance findings derail the current portrayal research, but resolve them before the next alpha handoff so the cleaned source archive becomes genuinely canonical rather than merely safer.
