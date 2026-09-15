# ADR 0028 - Remove derived-output export features

Status: Accepted - 2026-09-15

## Context

Catalyst accumulated several output paths during alpha: annotated-PDF export from the Reader, Outline document/serialization exports, and Methods PDF/RTF exports. These outputs added UI, serializers, tests, iconography, and maintenance surface without materially strengthening Catalyst's core analytical workflow.

Catalyst already has a separate durability boundary: canonical Catalyst XML workspace persistence plus explicit `.catalyst.xml` Save/Load. Source PDFs remain separate files.

## Decision

Catalyst will not expose derived-output export features in the current product surface.

Remove annotated-PDF export, Outline/Map document or image export, and Methods/Techniques document export, together with export-only helpers, tests, styles, and symbols that no longer serve another active purpose.

Explicit `.catalyst.xml` Save/Load remains supported. These are persistence and recovery operations, not report, publication, PDF, RTF, PNG, Markdown, or interchange-export features.

Reports, briefings, publication formatting, and other downstream presentation work remain outside Catalyst.

## Consequences

The Reader, Outline, and Methods surfaces stay focused on analysis rather than output formatting. The code and validation surface becomes smaller, and Catalyst avoids maintaining multiple lossy projections of richer workspace state.

Historical research may continue to discuss export/interchange as explored architecture; it does not restore a current export feature. Any future derived-output feature requires an explicit new product decision rather than revival through stale helpers or tests.
