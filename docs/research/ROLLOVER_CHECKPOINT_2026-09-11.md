# Catalyst rollover checkpoint — 2026-09-11

This is the handoff from the current long-running Catalyst chat into a fresh conversation. Continue from this state rather than restarting the project.

## Immediate design pivot

The main blocker is now the actual Catalyst UI/cognitive architecture, not Portrayal Lab protocol polish.

Live review of the empty workspace showed that Catalyst exposes too many conceptual choices before the analyst has done any work: separate Reader/context histories, Library/Open/file-open, configuration, command palette, Analysis/Evidence tabs, Working Picture navigation, Find, New Thought, Start, and pane resizing. The screen is visually sparse but cognitively dense.

The deeper regression is that document placement has effectively disappeared from the real Working Picture. Catalyst was supposed to make analytical structure legible before it is readable. Spatial arrangement, source placement, source crops, observations, questions, propositions, and stable landmarks should support cognition directly.
## Cognitive direction

Do not simplify Catalyst into a conventional document app with fewer buttons. The next design pass should restore a spatial analytical desk where documents and document regions remain placed landmarks and analytical constructs can form around them.

Proximity and placement may precede explicit semantic relationships. The analyst must be able to create provisional spatial structure without prematurely typing every relationship.

Historical lineage already identified: physical index cards/corkboards/ring binders; Bush memex; Engelbart NLS/AUGMENT; Xerox NoteCards; VIKI/VKB spatial hypertext; Storyspace/Tinderbox; Scapple; Scrivener Binder/Corkboard/Outliner/Document. Research should continue forward as well as backward.

Initial contemporary comparators: LiquidText, Obsidian Canvas, and Heptabase. Continue scanning modern systems for spatial document work, mixed representations, progressive disclosure, bounded canvases/subpictures, and cognitive-load reduction.
## Validated technical state

Portrayal Lab remains on catalog `0.1.0-lab.3`, protocol `blind-v1`, result schema 3. P7 single-scale blind measurement was implemented and validated: `npm test` passed, `npm run build` passed, blind P7 showed one assigned scale, and review P7 retained the four-scale matrix with measurements disabled.

A proposed `blind-v2` patch helper exists but was never executed. Do not treat it as applied. UI/cognitive architecture took priority.

Catalyst Chat Bridge 0.2.0 is the continuity mechanism. It waits up to 45 seconds for the ChatGPT composer, retains failed commands for retry, and prevents duplicate execution. The recovery playbook explicitly permits asking the user for additional access whenever it would materially improve continuity or development work, subject to user approval.

Treat the warning `This conversation has reached the maximum allotted length` as a reliability boundary, not necessarily a literal hard stop: affected chats may still send messages at severely degraded performance before crashing.

## Immediate next action

Continue research before another Working Picture rewrite. Preserve this principle: analytical material dominates; application chrome retreats; document/source placement remains part of the thinking surface. Do not start coding the next UI yet.
## Agent Workbench profile safety

Catalyst now has a dedicated browser-visible GUI workbench profile. A future Catalyst chat must read `C:\Users\iris\AgentWorkbench\catalyst\profile.json` and `C:\Users\iris\AgentWorkbench\catalyst\state\current.json` before using any Agent Workbench controls.

The Catalyst profile is the validated `:99 / 5902 / 6080` instance. A separate general-purpose profile exists at `C:\Users\iris\AgentWorkbench\general` on `:98 / 5912 / 6081` for non-Catalyst chats. Do not use or stop the general profile for Catalyst work unless the user explicitly requests it, and do not hand non-Catalyst work the Catalyst profile.

The separation exists so multiple chats can use GUI tooling without interfering with each other's state. Do not choose a workbench based only on whichever noVNC tab is already open; local profile/state files are authoritative.