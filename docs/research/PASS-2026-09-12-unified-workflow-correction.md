# Unified workflow correction — 2026-09-12

Status: design correction discovered during instrumented interaction pass.

## Product invariant
Catalyst is intended to own the analytical process end-to-end on one continuous page. It is not a document reader plus a separate canvas, graph, notes app, or evidence manager.

The core loop is:
source intake → reading → exact-region marking → evidence/extraction → provisional thinking → placement/organization → semantic assertion/comparison → synthesis → exact return to source.

All of those states should remain manifestations of one analytical workspace and one current analytical context.

## What the code audit showed
The current app already contains most required mechanics, but composes them as adjacent subsystems: PDF reader, context pane, Analysis/Evidence tabs, note inspector, selection card, document library, and separate reader/context histories.

That preserves persistence and cross-linking but still asks the analyst to switch attentional modes and remember which subsystem currently owns the task.

## Revised interaction target
Use one page with transient focus states rather than separate application modes. A source, excerpt, thought, question, assertion, or subpicture can become locally dominant without becoming a different workspace.

Opening must preserve enough surrounding context to maintain orientation and must include deterministic return. Derived analytical objects should visibly emerge from their source context rather than appearing in a remote panel.
## Consequences for the prototype
The standalone instrumented Desk remains useful as a semantics test bed, but it is no longer the primary interaction prototype. Do not keep elaborating it as though the end product begins from a blank spatial canvas.

The next prototype substrate should be the real application shell, because it already contains the document viewer, exact-selection capture, source jumping, notes, evidence, Working Picture, and persistence mechanisms that must be unified.

The prototype question is now: can those existing mechanisms be recomposed into one cognitively continuous analytical page without increasing overload?

## Immediate design tests
1. Source focus must not erase the Working Picture; surrounding analytical context should remain perceptible.
2. Selecting source material should offer derivation actions at or near the selection, not in a distant subsystem.
3. Creating evidence/thoughts from a selection should visibly preserve origin and return path.
4. Opening a derived object should permit source return without changing analytical place.
5. Analysis, evidence, methods, provenance, and document access should use progressive disclosure rather than top-level mode tabs wherever possible.
6. Navigation should ultimately feel unified even if reader/context histories remain separate internally during prototyping.
7. Dense expert capability is acceptable; hidden state with poor information scent is not.

Production behavior remains unchanged until this recomposition is tested behind a research route or feature gate.
