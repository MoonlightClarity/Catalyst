# Catalyst capability model

## Purpose

Catalyst uses capabilities for persistent progressive disclosure: advanced analytical controls can be hidden without changing the underlying workspace data.

Capabilities are user-facing configuration, not temporary engineering feature flags.

## Current capability set

- `analyticalRoles` — analytical role metadata on thoughts/notes.
- `typedRelationships` — typed analytical relationship metadata. This remains a model capability but is not currently exposed as a standalone settings toggle.
- `confidence` — confidence metadata where the current alpha model still supports it.
- `methods` — availability of the structured Methods / Techniques workspace.

Blank/custom technique insertion is part of the current Techniques workflow itself; it is not a separate capability toggle. The retired standalone Evidence workspace and its source-tag clustering system are not capabilities and must not be reintroduced through this model.

## Profiles

### Simple

Hides analytical roles, typed relationships, confidence, and Methods / Techniques.

### Research

The default alpha profile. Keeps Methods / Techniques available while leaving analytical roles, typed relationships, and confidence hidden by default.

### Analytical

Enables analytical roles, typed relationships, confidence, and Methods / Techniques.

### Full

Enables all currently implemented capabilities. Blank/custom technique insertion remains available as part of the Techniques workflow rather than through a separate capability flag.

## Individual overrides

The workspace configuration menu exposes the capabilities that remain useful as direct presentation controls. Changing profiles clears overrides and restores the selected profile defaults.

## Data preservation invariant

Turning a current capability off does not delete the data associated with that capability. For example, hiding analytical roles preserves role metadata, hiding confidence preserves stored confidence, and hiding methods preserves technique runs.

This invariant applies to current capabilities. It does not require Catalyst to preserve schemas belonging solely to product features that were removed before beta.

## Implementation boundary

Capability state controls presentation/workflow availability. It is not analytical truth and should remain separable from the portable analytical record as Catalyst approaches beta.

Temporary rollout flags, if introduced later, must use a separate mechanism with an owner and removal condition.