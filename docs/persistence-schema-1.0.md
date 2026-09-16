# Catalyst 1.0 persistence schema

Status: **current format reference — 2026-09-16**

Catalyst persists workspace state in a deliberately simple XML envelope. This document records the current format boundary so future changes can distinguish schema evolution from ordinary implementation refactoring.

## Canonical XML envelope

- Format constant: `CATALYST_XML_FORMAT_VERSION = 1` in `src/persistence/xml.ts`.
- Root element: `<catalyst-workspace version="1">`.
- The root contains one `<state>` value encoded by Catalyst's typed XML value grammar.
- Supported value elements are `null`, `boolean`, `number`, `string`, `array`, and `object`; object properties are serialized as sorted `<entry key="...">` elements.
- DTD and ENTITY declarations are rejected. Unknown value elements, duplicate object keys, malformed nesting, and unsupported format versions are rejected.

## Persisted workspace fields

The version-1 state corresponds to `WorkspaceState` and currently includes:

`analysisRoot`, `outline`, `outlineSession`, `documents`, `annotations`, `viewerMarkups`, `notes`, `links`, `noteLinks`, `techniqueRuns`, `activeDocumentId`, `activeNoteId`, `graphView`, `capabilities`, `noteSemantics`, `relationships`, and `annotationRoles`.

`pendingSelection` is part of in-memory `WorkspaceState` but is explicitly cleared by `durableWorkspaceState()` before serialization and recovery-journal writes. It is therefore not durable user work.

## Hydration and compatibility

Deserialization first validates the XML envelope and a minimal recognizable workspace shape, then `hydrateWorkspaceState()` supplies current defaults/normalization. This means format version 1 can tolerate some older state shapes that hydration knows how to normalize, but the XML version check itself is strict: a version other than `1` is not silently migrated.
## Browser storage and rollback

The canonical browser storage key is `catalyst.xml.workspace.v1`. A legacy JSON key, `catalyst.browser.workspace.v1`, is still readable as a rollback/migration source. When no canonical XML exists but valid legacy JSON does, Catalyst writes canonical XML and preserves the old JSON key as a rollback copy.

If canonical XML is unreadable, the repository attempts the preserved legacy JSON state before falling back to a clean initial workspace. Repository load failures are contained rather than propagated into an unusable startup.

The recovery journal is a separate safety mechanism. It stores a versioned JSON envelope containing the same durable workspace projection and is hydrated on read; it is not the `.catalyst.xml` interchange format.

## Source-file boundary

Workspace persistence does not embed source PDF bytes. Document records retain source identity/metadata, while reconnection of content-addressed document IDs is constrained to matching SHA-256 identity. A saved Catalyst workspace and its source PDFs therefore remain separate artifacts.

## Versioning rule for future changes

Increment `CATALYST_XML_FORMAT_VERSION` when a persisted representation change cannot be safely read and hydrated under version 1 semantics. A version bump should ship with an explicit migration or a clearly documented incompatibility; do not merely loosen the version check.

Changes that only add defaults handled by hydration may remain version 1 if old and new files round-trip without silent loss. Any such change should extend the XML persistence/repository tests and update this document.

## Current validation surface

The persistence contract is exercised by `scripts/test-xml-persistence.mjs`, `scripts/test-xml-repository.mjs`, `scripts/test-xml-runtime-cutover.mjs`, `scripts/test-recovery-journal.mjs`, and workspace-file tests. The combined repository test intentionally exercises malformed canonical XML and verifies rollback behavior.

This reference describes the 1.0 implementation; it is not a promise that every internal legacy field will remain a permanent product concept.