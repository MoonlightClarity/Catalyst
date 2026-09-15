# Catalyst workspace maintenance

**Status:** Normative maintenance procedure  
**Introduced:** 2026-09-11

Catalyst source, research checkpoints, release overlays, build output, and native tooling all share one working directory during active development. Without regular cleanup, generated artifacts can be mistaken for source and stale handoff files can survive across releases or chat handoffs.

`clean.ps1` is the canonical cleanup entry point. It is deliberately conservative: it removes only known generated/transport artifacts and exact duplicate research handoff files. Unknown project content is preserved.

## Routine cleanup

Preview first when desired:

```powershell
powershell -ExecutionPolicy Bypass -File .\clean.ps1 -DryRun
```

Then perform the normal cleanup:

```powershell
powershell -ExecutionPolicy Bypass -File .\clean.ps1
```

Routine cleanup removes:

- frontend build output such as `dist/`;
- TypeScript incremental caches (`*.tsbuildinfo`);
- common transient log/cache directories;
- exact root-level duplicates of canonical `docs/research/` files;
- root screenshot copies only when byte-identical to `docs/research/screenshots/`;
- applied/generated handoff transport artifacts (`apply_*.ps1`, overlay/source/handoff ZIPs, handoff checksum files);
- standalone checkpoint `CHECKSUMS.txt` files.

Routine cleanup does **not** remove:

- `src/`, `src-tauri/`, `docs/`, `public/`, `scripts/`, or test fixtures;
- `package.json`, lockfiles, Cargo manifests, or native source/configuration;
- integrated research under `docs/research/`;
- current migration/upgrade scripts;
- `node_modules/` or `src-tauri/target/` unless deep cleanup is requested;
- unknown/unmanaged folders such as `specs/`;
- root research/screenshots that differ from the canonical integrated copies.

## Deep cleanup

Use deep cleanup when dependency state or native build output is suspect, before a clean-room validation, or when reclaiming substantial space:

```powershell
powershell -ExecutionPolicy Bypass -File .\clean.ps1 -Deep
```

Deep mode performs routine cleanup and also removes:

- `node_modules/`;
- `src-tauri/target/`.

After deep cleanup, run `install.ps1` before full validation or launching Catalyst.

## Keeping transport artifacts temporarily

If an overlay/handoff is still needed for distribution or verification, keep it during routine cleanup:

```powershell
powershell -ExecutionPolicy Bypass -File .\clean.ps1 -KeepTransportArtifacts
```

Generated handoff archives should normally live in the parent directory or a dedicated release-output location rather than the Catalyst source root.

## Recommended cadence

Run routine cleanup:

1. after a release/research overlay has been successfully applied and validated;
2. before `gather_source.ps1` or release packaging;
3. after moving research checkpoint material into `docs/research/`;
4. whenever stale build/compiler artifacts are suspected;
5. before a chat/session handoff when the working directory has accumulated transport files.

Run deep cleanup only when dependency/native build state needs to be reset or reclaimed.

## Safety rule

`clean.ps1` verifies that the target looks like a complete Catalyst project and refuses to remove paths outside that root. Duplicate research files are only pruned automatically when their SHA-256 matches the canonical integrated copy. Divergent material is preserved and reported for manual reconciliation.

> Cleanup may remove generated copies and caches. It must never decide that unknown content is disposable.
