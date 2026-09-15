# Catalyst self-facilitating chat coordination — 2026-09-11

Purpose: keep research moving across ChatGPT execution-window limits without allowing parallel chats to collide on the live Catalyst GUI.

## Source-of-truth order
1. `C:\Users\iris\AgentWorkbench\ENVIRONMENT_ROLLOVER_2026-09-11.md` plus live profile/state/job status.
2. Current Catalyst research passes under `docs\research`.
3. This coordination file for chat roles and handoffs.
Older rollover notes lose when they conflict with the current environment rollover plus live state.

## Hard boundary
- Catalyst GUI remains `:99 / 5902 / 6080` and has live Freeplane, Zotero, Trilium and Firefox processes.
- Facilitator chats must NOT start, stop, restart, migrate, click, type into, or otherwise manipulate the Catalyst GUI unless their role explicitly says they may.
- General v1 remains `:98 / 5912 / 6081`; General v2 remains `:97 / 5922 / 6082`.
- Do not implement the next Working Picture until the research pass is deliberately closed by the coordinator/user.

## Self-facilitation rule
Each facilitator should continue independently through useful work chunks, write durable results/checkpoints before its execution window becomes fragile, and seed a successor chat for the same role when needed. A successor must read this file and the role's latest checkpoint before acting.

## Coordinator recovery rule
If the active Catalyst coordinator appears to stop mid-sequence because its execution window expired, the continuity facilitator should use the validated Opera Catalyst Chat Bridge to send exactly `continue` to the coordinator conversation. If Opera works but bridge drafting/sending stops, reload the unpacked extension and draft-test first. If the coordinator URL cannot be resolved safely, write `COORDINATOR_CONTINUE_REQUESTED` plus timestamp and context into this file and continue maintaining durable state; do not guess a target conversation.

## Roles
- ARCHITECTURE: synthesize Freeplane + Zotero + Trilium and prior backward/forward research into defensible Working Picture cognitive-architecture implications; research/docs only, no GUI manipulation or product code.
- FORWARD_RESEARCH: continue web/source research on FOSS comparators and implementation references; prioritize distinct cognitive mechanisms, not feature catalogs; no Catalyst GUI manipulation or product code.
- CONTINUITY: audit supervisor/checkpoints/workbench state, keep rollover state coherent, and recover stalled coordinator with `continue`; no research-GUI manipulation unless explicitly authorized.

## Active facilitator conversations
- Coordinator: `Catalyst Rollover Research` — `https://chatgpt.com/c/6aa43ff5-7900-83ea-86ff-fd03580fab20`
- ARCHITECTURE: `Architecture synthesis plan` — `https://chatgpt.com/c/6aa4a7ff-10bc-83ea-b534-08428c773e8f`
- FORWARD_RESEARCH: `Catalyst Research Pass` — `https://chatgpt.com/c/6aa4a834-91f8-83e9-b120-332284efb95a`
- CONTINUITY: `Audit live checkpoints` — `https://chatgpt.com/c/6aa4a876-e448-83ea-8e2a-2ba9baf4ac65`

All three facilitators may send exactly `continue` to the Coordinator via the validated Opera Catalyst Chat Bridge if they can safely determine that the coordinator stopped mid-sequence because its execution window expired. The CONTINUITY facilitator is primary watchdog, but the others need not wait for it if the target is the exact Coordinator URL above and bridge access is validated.
## Coordinator target amendment — 2026-09-11
- Exact coordinator conversation: `Catalyst Rollover Research` — https://chatgpt.com/c/6aa43ff5-7900-83ea-86ff-fd03580fab20
- If that coordinator stops mid-sequence because its execution window expires and Opera bridge access is validated, send exactly `continue` to that conversation; do not wait for the watchdog when this exact target is safely resolved.
- After recovery action, each facilitator returns to its own durable checkpoint and role boundary.

## Current continuity checkpoint

Latest watchdog checkpoint: `CONTINUITY_WATCHDOG_CHECKPOINT_2026-09-11.md`. It records the 21:27 EDT live audit, repaired Trilium semantic checkpoint/profile drift, and a successful exact-`continue` bridge recovery of the designated `Catalyst Rollover Research` coordinator. Read it before any new continuity intervention.

Successor seed for CONTINUITY is durable at `CONTINUITY_SUCCESSOR_SEED_2026-09-11.md`. Use it when the current watchdog chat becomes fragile; do not reconstruct the handoff from memory.

## FORWARD_RESEARCH status — 2026-09-11 late
The bounded forward comparator sweep is closed. Read `FORWARD_RESEARCH_CHECKPOINT_2026-09-11.md`, `PASS-2026-09-11-forward-research-synthesis.md`, and `FORWARD_RESEARCH_ARCHITECTURE_HANDOFF_2026-09-11.md`. Do not restart broad comparator research unless architecture/prototyping exposes a concrete unresolved mechanism.

## Overnight cohort — 2026-09-11
Hard stop: 2026-09-12 06:30 America/New_York unless manually disabled earlier. The machine has a temporary system-awake/display-may-sleep lease through the same deadline.

Primary overnight coordinator:
- OVERNIGHT_COORDINATOR — https://chatgpt.com/c/6aa425f5-9dd0-83ea-aa40-ad00de78c940

Existing research roles retained:
- ARCHITECTURE current successor — https://chatgpt.com/c/6aa4ac75-1f44-83e9-b1bf-3f6b74c822ee
- FORWARD_RESEARCH — https://chatgpt.com/c/6aa4a834-91f8-83e9-b120-332284efb95a
- CONTINUITY — https://chatgpt.com/c/6aa4a876-e448-83ea-8e2a-2ba9baf4ac65

Additional overnight research-only roles:
- COGNITIVE_ERGONOMICS — https://chatgpt.com/c/6aa47cb2-3850-83e9-a20c-36e849439f59
- PROVENANCE_PLACEMENT — https://chatgpt.com/c/6aa48fbe-b2c8-83ea-ab30-4f4dce0bed01
- ADVERSARIAL_ARCHITECTURE — https://chatgpt.com/c/6aa30e43-c9f0-83ea-a378-c26ede7dd0be
- IMPLEMENTATION_PRIMITIVES — https://chatgpt.com/c/6aa4408a-febc-83e9-88bd-02e3ae3867b8
- INTERACTION_PATTERNS — https://chatgpt.com/c/6aa3e501-fb50-83ea-a079-99d324509473
- DECISION_AUDIT — https://chatgpt.com/c/6aa2a187-7580-83ea-ab42-9475587306a5

## Overnight coordinator amendment — 2026-09-11 late EDT

- Overnight coordinator conversation: `Conversation test` — https://chatgpt.com/c/6aa425f5-9dd0-83ea-aa40-ad00de78c940
- This conversation is the coordinator source for the overnight run through 2026-09-12 06:30 EDT unless the user/watchdog disables it earlier.
- The earlier `Catalyst Rollover Research` coordinator URL remains historical/daytime context; do not use it as the overnight recovery target while this amendment is active.
- Overnight coordinator boundaries: stay in Chat; do not manipulate Catalyst `:99`; do not implement the Working Picture; integrate durable findings, identify concrete gaps, and dispatch only bounded research/doc tasks.
- Current architecture state is closure-ready. Do not restart generic comparator research. Reopen architecture only for a genuine Trilium counterexample, prototype-discovered mechanism, or deliberate premise change.
- Before successor rollover, record the successor's exact conversation URL in `OVERNIGHT_COORDINATOR_CHECKPOINT_2026-09-11.md` and update this section.

## COGNITIVE_ERGONOMICS checkpoint — 2026-09-11 late

Primary durable output: `OVERNIGHT_COGNITIVE_ERGONOMICS_2026-09-11.md`.
Successor seed: `COGNITIVE_ERGONOMICS_SUCCESSOR_SEED_2026-09-11.md`.

Current result: no contradiction to the bounded analytical desk / focus-in-context architecture. New ergonomic constraints emphasize recoverable complexity, stable authored geography, progressive disclosure with information scent, task-relative density thresholds, selective relation portrayal, expert fast paths, and interruption/resumption fidelity.


## PROVENANCE_PLACEMENT status — 2026-09-11 overnight

The provenance/document-placement stress test is complete enough for coordinator integration:
- report: OVERNIGHT_PROVENANCE_PLACEMENT_2026-09-11.md
- successor seed: PROVENANCE_PLACEMENT_SUCCESSOR_SEED_2026-09-11.md

The pass recommends explicit Source Representation and Source Region species, immutable selector bundles plus separate resolution observations, destination-and-origin return semantics, typed detach/delete/purge commands, and resolver-versioned fixtures. No product code or Catalyst GUI was changed. Continue this role only for a bounded unresolved mechanism.