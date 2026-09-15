# ADR 0004: Deep capability, quiet interface

Status: accepted.

## Context

Catalyst began with "minimalist" and "lightweight" as overlapping goals. Those goals are not equivalent. Minimizing dependencies, features, and application size can force important research capabilities into custom implementations or prevent useful features from existing at all. At the same time, permanently exposing every capability creates a noisy workspace and raises cognitive load while reading.

## Decision

Treat **low cognitive load** as the product constraint, not low feature count or minimum binary size.

Catalyst may gain advanced capabilities when they improve research work, provided they remain behind stable feature/domain boundaries and are progressively disclosed in the interface.

The default reading surface remains restrained. Lower-frequency capabilities should generally appear through context views, drawers, focused dialogs, keyboard shortcuts, and the command palette rather than permanent chrome.

Do not use this principle as permission for architectural sprawl. A feature still needs a clear research use case and an ownership boundary. Avoid speculative plugin systems, custom infrastructure, or generalized frameworks before multiple concrete features require them.

## Consequences

- Application size is not a primary optimization target.
- Mature dependencies are preferred over custom reimplementation when licensing and maintainability are acceptable.
- Library, Trash, Evidence, and commands can exist without being permanently visible.
- Future features such as tags, backlinks, citation tools, area capture, document tabs, and advanced search can be added without redesigning the visual shell first.
- Technical complexity should remain localized even as product capability grows.
