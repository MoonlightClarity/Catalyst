# Handoff checkpoint — XML runtime cutover — 2026-09-13

## Outcome

Catalyst's active runtime is now React/Vite + browser APIs + Catalyst XML. Tauri, Rust, and SQLite are no longer required to run the application.

The migration preserved rollback material rather than deleting it. The former Tauri shell source is archived under `legacy/tauri-shell`; its generated Rust `target/` directory was removed.

## Canonical persistence

- `XmlWorkspaceRepository` is selected unconditionally by `createWorkspaceRepository()`.
- Workspace state serializes through `src/persistence/xml.ts` with an explicit versioned XML root.
- Canonical browser persistence uses `catalyst.xml.workspace.v1`.
- Existing `catalyst.browser.workspace.v1` JSON migrates once into XML and remains preserved as rollback data.
- Shared hydration/sanitization is centralized in `src/persistence/hydrate.ts`.
- DTD/ENTITY input and unsupported XML versions are rejected.
- A malformed canonical XML workspace falls back to preserved legacy JSON when available.

## Portable workspace files

`src/platform/workspaceFiles.ts` provides `.catalyst.xml` export/import. The commands are exposed through the command palette as **Export Catalyst workspace** and **Import Catalyst workspace**.

Import deliberately flushes pending edits before validation/storage, clears stale crash recovery only after successful import, then reloads the app so the imported workspace becomes the sole in-memory baseline. A malformed import cannot overwrite the current canonical workspace.
