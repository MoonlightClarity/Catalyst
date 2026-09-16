# Catalyst troubleshooting

This guide covers the supported Catalyst 1.0 workflow: local PDF reading, Outline authoring, optional Methods, and `.catalyst.xml` session persistence. It is intentionally limited to problems a user can diagnose without editing application code.

## Catalyst will not open

For the Windows portable build, make sure another Catalyst window is not already running. Catalyst is single-instance: launching it again focuses the existing window rather than opening a second workspace.

If the portable build exits immediately, close any stale Catalyst process and try again. The desktop shell serves the packaged app only on `127.0.0.1` using its fixed local port; another process already using that port can prevent startup.

For a source checkout, run the application from the repository root with:

```powershell
powershell -ExecutionPolicy Bypass -File .\run.ps1
```

The source build normally appears at `http://127.0.0.1:5173`.

## A saved session opens but the PDF is missing

Catalyst session files do not embed the source PDF. A `.catalyst.xml` file stores workspace state and source identity while the PDF remains a separate file.

Reconnect the original PDF when prompted. If Catalyst refuses a similarly named file, use the actual source document rather than forcing a mismatch; source identity checks exist to avoid attaching analysis to the wrong document.

Keep the PDF and its Catalyst session together when moving work between machines.
## Changes seem to be missing after reopening

For important work, use an explicit named Save rather than relying only on automatic local continuity. The portable boundary is the `.catalyst.xml` session file.

If a session fails to load, preserve the existing file before experimenting with recovery. Do not overwrite the only copy with a new blank session. If the problem follows a recent edit, keep the source PDF unchanged and work from a duplicate of the session file.

## Outline keyboard behavior is surprising

Outline shortcuts apply to the focused Outline row. `Enter` adds a sibling, `Tab` indents, `Shift+Tab` outdents, and `Alt+ArrowUp` / `Alt+ArrowDown` reorder among siblings.

`Backspace` removes the focused Outline item when you are not actively editing text. If you intended to delete text inside a field, make sure the text editor itself has focus first.

Catalyst does not provide a global workspace undo stack. Standard text-editing undo remains available inside editable fields.

## A Method does not affect the Outline

This is expected. Methods are an independent ordered workspace for structured analytic techniques. Reordering or editing a Method changes the Method run only; it does not restructure the Outline.

Use the Outline for analytical structure and Methods for optional technique execution. A custom blank Method is available when the catalog does not match the task.

## Reader controls appear unavailable

Reader actions depend on an open PDF. Open a source document before expecting document-specific controls such as Find or fullscreen behavior to apply to the reader.

Catalyst does not modify the original PDF. Reader-local work and the Catalyst session remain separate from the source file itself.
## Source checkout fails validation

Run the standard repository gate:

```powershell
npm run check
```

This checks package/lockfile consistency, the automated test chain, the production build, and dependency licensing. A large JavaScript chunk warning is currently non-fatal; treat an actual nonzero exit code as the failure signal.

The XML repository tests deliberately exercise malformed XML rollback behavior and may print a parse diagnostic while still passing. Check the final test result before treating that diagnostic as corruption.

## Portable release packaging fails with a Windows rename error

Use the repository packaging helper rather than invoking Electron Builder directly inside the project release directory:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\package-portable-release.ps1
```

The helper verifies release staging, packages through a unique temporary directory, produces the portable executable plus a SHA-256 sidecar, and cleans its temporary build directory by default. It avoids a Windows `EPERM` directory-rename failure observed when packaging directly into the in-tree output path.

## When to stop troubleshooting

Preserve the source PDF and the affected `.catalyst.xml` file before attempting more invasive recovery. A reproducible session-load, source-reconnect, or startup failure is more useful than repeatedly changing files in place.

For implementation details, see `docs/CURRENT_ARCHITECTURE.md`. For the normal workflow, see `docs/USER_GUIDE.md`.