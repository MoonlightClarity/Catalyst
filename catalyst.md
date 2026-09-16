# Catalyst Working Skill

Scope: use this protocol whenever inspecting, testing, editing, documenting, packaging, or reasoning about the Catalyst repository at `C:\Users\iris\Downloads\Catalyst`.

## Purpose
Catalyst is a local-first analytical workspace for source reading, hierarchical outlining, and optional structured analytic methods. Work should preserve the deliberately reduced product boundary and favor coherence, legibility, reliability, and low cognitive load over feature growth.

When the task is to **operate Catalyst as an LLM user**, treat llms-navigation.md as the operational skill. This repository skill governs development and inspection of Catalyst itself; it should not replace use of the live application when the user asks to analyze something in Catalyst. If application behavior is unclear, inspect the implementation only long enough to establish the interaction contract, then return to the live app.

## Authority and orientation
1. Before substantive work, inspect the current repository rather than relying on chat memory alone.
2. Read `docs/CURRENT_ARCHITECTURE.md` first for architectural authority, then consult `CURRENT_STATE.md`, `DECISION_LOG.md`, and relevant current ADRs/source files.
3. Treat older alpha, Working Picture, Evidence, Assessment, graph-first, Tauri/SQLite, and archived material as historical unless current authority explicitly reaffirms it.
4. When documentation and implementation disagree, investigate the live implementation before changing behavior merely to satisfy stale prose or tests.

## Product invariants
- Outline is the primary analytical authoring and structural surface.
- Methods are an independent, ordered workspace; they are optional and do not own Outline structure.
- Source PDFs remain separate from Catalyst workspace/session state.
- Catalyst session persistence uses Catalyst XML; Save/Load are persistence operations, not derived-output export.
- The active runtime is React + TypeScript + Vite with PDF.js (`pdfjs-dist`).
- Tauri/SQLite is legacy architecture and must not be reintroduced without an explicit new decision.
- Formal Assessment, standalone Evidence, global undo/redo, thought linking, and graph-first/free-spatial structural editing are retired product concepts.
- Do not recreate removed concepts under new names merely to preserve old code.

## Implementation discipline
1. Prefer deletion and simplification over compatibility shims when the only justification is hypothetical existing users; Catalyst currently has no user migration burden.
2. Preserve useful current behavior, data integrity, accessibility, and technical invariants even when removing legacy code.
3. Make the smallest coherent change that solves the actual problem. Avoid broad architecture edits for isolated UI defects.
4. Search call sites, types, persistence, tests, and CSS before deleting a concept so removal is complete rather than cosmetic.
5. Do not stack CSS overrides indefinitely. Remove obsolete selectors/rules when their owning UI is gone, and prefer the current shared visual language.
6. Keep the interface compact, high-contrast, and consistent. Avoid redundant toolbars, labels, nested scrollbars, unexplained whitespace, and controls without meaningful current behavior.
7. Keyboard behavior should be consistent across structurally similar surfaces and should not silently conflict with browser behavior when Catalyst intentionally owns the shortcut.
8. Never claim a build, test gate, persistence path, or UI behavior works without checking it in the current tree/runtime.

## Change workflow
1. Inspect relevant source and current state before editing.
2. For risky or cross-cutting changes, create a targeted rollback copy under the existing backup convention.
3. Apply focused edits; avoid unrelated cleanup in the same pass unless it directly removes newly dead code.
4. Run the narrowest relevant validation first, then the aggregate repository gate when the change can affect compilation or shared behavior.
5. For UI changes, launch/refresh the actual Catalyst runtime and inspect the affected surface visually. Compilation alone is not UI validation.
6. For persistence changes, explicitly test save/reload/load behavior and distinguish browser-local automatic persistence from portable `.catalyst.xml` Save/Load.
7. If a failure appears unrelated, diagnose it before modifying unrelated architecture to make a test pass.
8. Leave the repository in a more coherent state each run; do not stop at review when a safe concrete fix is in scope.

## Reader and source boundary
- Keep source viewing local and source-centered; do not mutate original PDFs as a side effect of workspace operations.
- Reader navigation/preferences are not analytical truth.
- Do not conflate PDF-local/viewer markup with Catalyst analytical state unless current architecture explicitly does so.

## Outline and Methods
- Outline hierarchy and sibling order are authored structure. Avoid hidden semantics inferred solely from placement.
- Notes belong directly in the Outline rather than in a resurrected Thought workspace.
- Methods should remain ordered, focused, and editable without turning their catalog taxonomy into output chrome.
- Custom/blank methods are legitimate current behavior unless a newer product decision removes them.
- LLM navigation is a current interaction contract: Reader, Outline, and Methods have deterministic surface navigation; documents have session-local `D <number>` addresses in first-open order and page targets use `P <number>`; `Ctrl/Cmd+Shift+X` closes the current document without taking over the browser's `Ctrl/Cmd+W`; Outline and Method rows expose structural addresses; Go To can switch documents, jump to pages, open the full read-only Methods catalog, and target Outline notes, Method forms, and individual Method response steps.
- For LLM automation, treat the Go To field as replace-only input: after `Ctrl/Cmd+G`, select all prefilled text before entering a complete address, submit once, and verify the destination before continuing. Use fully spaced canonical syntax such as `D 1 P 5`, `O 2.3 note`, and `M 4.1 step 2`; compact prefix-number forms such as `D1`, `P5`, `O2.3`, and `M4.1` are tolerated, but fully collapsed compound/suffix forms such as `D1P5`, `O2.3note`, and `M4.1step2` are not. Prefer `All methods` / `Catalog` for catalog discovery instead of guessing a Method address from catalog order.
- Outline/Method addresses such as `O 2.3` and `M 4.1` are transient structural locators derived from hierarchy and sibling order. Document addresses such as `D 2` are session-local locators derived from stable first-open order; page addresses such as `P 37` are locations within the selected document. None are persistence keys or durable object IDs.

## Release and documentation
- Treat beta/release work as convergence and stabilization, not an invitation to restore historical breadth.
- Before release claims, verify the current package version, build/check status, licensing gate, persistence, and packaged artifact rather than trusting dated status files.
- Keep README/current-state documentation aligned with the shipped surface; move obsolete implementation history to archival documentation instead of presenting it as current behavior.
- Do not add process documents merely for convention. Documentation should have a clear maintenance or user/developer purpose.

## AI-assisted implementation and provenance
Catalyst may be developed substantially through AI-assisted implementation. When describing the project externally, distinguish product ownership, analytical design, architecture decisions, testing, and direction from claims of conventional hand-coded software-engineering expertise. Do not understate ownership, but do not imply unsupported coding authorship or proficiency.

## Completion test
A Catalyst work pass is incomplete if it relies on stale memory instead of the mounted tree, restores a retired product concept without an explicit decision, makes only cosmetic review comments when a safe requested fix is available, or declares success without the validation appropriate to the change.

When uncertain, optimize for the smallest coherent product: source material + Outline + optional Methods + reliable local session persistence, with implementation details serving that workflow rather than expanding it.

## Agent-use feedback loop
`llms-navigation.md` is a living operational contract for LLM use of the shipped application. When real agent use reveals a repeatable interaction rule, analytical pattern, failure mode, or handoff requirement, update that document rather than leaving the lesson only in chat history.

Keep development authority and agent-operation authority distinct:
- `catalyst.md` governs repository inspection, modification, validation, packaging, and release work.
- `llms-navigation.md` governs use of Catalyst as an analytical workspace.
- Live application behavior remains the ultimate check on operational instructions; documentation should be corrected when the current product behaves differently.

Agent-use discoveries should not automatically trigger product changes. First decide whether the issue is a documentation gap, an automation/focus problem, an analytical misuse, or an actual product defect. Change the application only when the product behavior itself is the problem.

When implementation inspection is used to help an agent discover method names, catalog structure, accessibility semantics, or interaction details, keep that inspection narrow and return to the live application for the actual analytical work. Do not let repository access become a substitute for exercising the shipped workflow.
