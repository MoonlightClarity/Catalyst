# ADR 0010 — Permanent capability profiles for progressive disclosure

## Status

Accepted for 0.6.1 architecture alpha.

## Context

Catalyst is intended to contain intelligence-grade analytical methodology while remaining usable for ordinary research and other non-intelligence analytical work. Exposing every analytical concept simultaneously creates avoidable cognitive load.

Long-lived user configuration should not be implemented as temporary engineering feature flags.

## Decision

Catalyst uses a persistent capability model with named profiles and individual overrides.

Disabled capabilities hide their interaction surfaces but preserve data.

The initial profiles are Simple, Research, Analytical, and Full. Research is the default during this alpha.

Changing profiles clears per-capability overrides so named profiles remain predictable.

## Consequences

Users can increase or decrease rigor without migrating projects. Product complexity can grow internally without requiring equivalent persistent chrome.

Capability state is configuration, not analytical content.

Temporary rollout flags remain a separate future concern.
