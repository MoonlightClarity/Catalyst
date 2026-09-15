# Catalyst Pre-User Evaluation Framework — 2026-09-14

Status: **active decision framework**

## Context

Catalyst currently has **no external users**. It is still moving from late alpha toward beta and is not intended for release until it is out of beta.

This changes how remaining work should be evaluated. Catalyst should not be judged as though it already has a user base, installed-base compatibility obligations, support commitments, or validated demand for every feature.

The immediate objective is to produce a coherent, stable, legible analytical system whose architecture can survive later user feedback without requiring another foundational rewrite.

## Primary consequence

Before users exist, the highest-value evidence is not feature demand. It is **internal coherence**.

A change is valuable now when it makes Catalyst easier to understand, test, maintain, and reason about while preserving the product's intended analytical model.
## What to optimize for now

Prioritize, in order:

1. **Architectural convergence** — one clear model for notes, map/outline, evidence, assessment, reader state, and analytical methods.
2. **Correctness and recoverability** — saved state, import/export, source return, persistence, undo/redo, and failure visibility must be trustworthy.
3. **Internal usability** — the interface should be readable and explain itself well enough that the product can be exercised end-to-end without workarounds.
4. **Subtractive clarity** — remove duplicate controls, aliases, dead code, legacy terminology, and features that compete with the frozen ontology.
5. **Reversibility** — prefer changes that can be removed or revised cheaply after real users provide evidence.
6. **Testability** — important behavior should have a narrow validation path even when multi-machine testing is unavailable.
7. **Documentation** — important architectural and product decisions should be explicit so parallel work does not reopen settled questions.

A feature that does not advance one of these goals needs a strong reason to exist before beta.
## What not to optimize for yet

Do not let the absence of users become a reason to simulate user demand.

The following are weak justifications at this stage unless they also solve a demonstrated internal problem:

- feature breadth for marketing comparison;
- onboarding systems for hypothetical users;
- compatibility layers for workflows nobody is using;
- collaboration, synchronization, or account infrastructure;
- generalized extensibility without a current architectural need;
- telemetry, retention, engagement, or growth mechanics;
- large accessibility or localization programs beyond fixing concrete usability barriers;
- exhaustive platform support before the core Windows workflow is stable;
- preserving weak legacy behavior merely because changing it later could inconvenience hypothetical users.

There is currently no installed base to protect. This is the cheapest point in Catalyst's lifecycle to simplify or replace a flawed design.
## How to judge beta readiness without users

Beta readiness should be based on product and engineering evidence rather than adoption evidence.

Catalyst is ready to leave alpha when its major workflows are coherent enough to test as a system: open source material, mark/capture evidence, organize notes through the outline/map model, apply methods where useful, form an assessment, preserve provenance, save/reopen state, and export useful work.

The relevant questions are:

- Does each major surface have a clear purpose and ontology?
- Can a user move through the core workflow without contradictory controls or dead ends?
- Does saved work reopen correctly?
- Can important actions be reversed or recovered where appropriate?
- Are source references durable and trustworthy?
- Do the outline and generated map agree about structure?
- Are optional analytical features genuinely optional rather than structural dependencies?
- Does CSS present one coherent application rather than a collection of separately evolved panels?
- Can failures be observed instead of collapsing into a blank or ambiguous state?
- Can the system be validated repeatedly on the current development machine?
## Implications for current feature work

Low-opportunity-cost work should be evaluated more strictly in a pre-user product. A feature being inexpensive is not sufficient; it should also improve the completeness or testability of an existing workflow.

For the Thorium/PDF-reader pass, this means reader correctness and mature navigation behavior remain justified: position restoration, search completion, fit/rotation/navigation, progress, and source-return history improve an existing core workflow.

By contrast, later reader additions such as bookmarks, embedded attachments, elaborate document-information surfaces, or increasingly broad annotation management should not be treated as mandatory merely because PDF.js can expose them. They should be added only when they close a concrete workflow gap at low architectural cost.

The same rule applies elsewhere: do not pursue feature parity with Freeplane, Thorium, intelligence-analysis suites, or note applications as an end in itself. Reference products are evidence for solved interaction patterns, not a checklist Catalyst must reproduce.

## Testing consequence

The absence of external users increases the importance of deterministic internal validation. It does **not** require simulating a production support organization.

Prefer focused contract tests, representative documents/workspaces, build validation, recovery testing, and repeated end-to-end manual passes on the available machine. A second-machine test is useful when practical, but inability to perform one should not indefinitely block beta if the core architecture and persistence boundaries are otherwise well validated.
## Decision rule

For each proposed change before beta, ask:

**What demonstrated problem does this solve in the current product, and does solving it reduce or increase the amount of architecture Catalyst must carry?**

Prefer the change when it resolves a real defect, contradiction, missing core interaction, or validation gap with little new conceptual surface.

Defer it when its main rationale is hypothetical future demand, parity, novelty, or completeness for its own sake.

## Reassessment trigger

This framework should change once Catalyst has real external users or structured external testing. At that point, observed behavior, repeated requests, failure patterns, accessibility needs, installation friction, and workflow variation become first-class product evidence.

Until then, user-demand assumptions should remain explicitly provisional.

## Current strategic interpretation

Catalyst's present risk is more likely to come from **failure to converge** than from missing feature breadth. The late-alpha-to-beta path should therefore remain subtractive: finish core contracts, stabilize CSS and interaction geometry, validate the frozen ontologies end-to-end, remove obsolete paths, and resist reopening settled architecture without a demonstrated blocker.

This framework supersedes any roadmap assumption that treats speculative user demand as evidence during the current pre-user phase.
