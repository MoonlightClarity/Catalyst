# ADR 0003: Tauri desktop shell and SQLite persistence

Status: **Superseded for the active runtime by ADR 0027 and `../CURRENT_ARCHITECTURE.md`; retained as the historical Tauri/SQLite decision.**

## Context

The browser research-loop prototype validated the PDF interaction model, note lifecycle, and evidence linking. Keeping all state in React memory now creates more product risk than value: research data must survive restart, documents need durable identities, and local file access should use a desktop-native permission model.

At the same time, Catalyst should not make advanced capability visually dominant. A document library and command surface are useful, but they do not need permanent sidebars/toolbars.

## Decision

Use Tauri v2 as the desktop shell and the official Tauri SQL plugin with SQLite for persistent workspace data.

Use the official Dialog + File System + Persisted Scope plugins for local PDFs. Files chosen through the system dialog are added to Tauri's filesystem scope; persisted-scope restores those grants across app restarts.

Use SHA-256 of PDF bytes as the durable `Document.id`. Keep the most recently used filesystem path as a location, not identity.

Keep persistence behind a `WorkspaceRepository` interface. React/domain code does not issue SQL directly.

Keep EmbedPDF behind the existing viewer adapter. Database rows store Catalyst domain objects rather than EmbedPDF objects.

Expose lower-frequency functions through a Library drawer and command palette (`Ctrl+K`) rather than a permanently expanded application shell.

## Consequences

- Persistence now has explicit schema migrations.
- Notes/evidence can survive application restarts.
- Moving toward workspace-wide search and metadata no longer requires redesigning storage.
- The desktop application requires a Rust toolchain for development.
- Browser mode remains useful for UI iteration but is intentionally non-persistent.
- File hash computation reads the complete PDF already needed by the viewer. Large-file optimization can be revisited if measurements show it is necessary.
