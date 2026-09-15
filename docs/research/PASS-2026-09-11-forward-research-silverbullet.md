# Forward comparator pass — SilverBullet — 2026-09-11

Status: source/documentation research only; no Catalyst GUI manipulation or product code.

## Why SilverBullet is a distinct comparator

SilverBullet combines plain Markdown storage with a programmable semantic index, queries, lenses, templates, and widgets. Its strongest relevance to Catalyst is not note-taking; it is the separation between canonical authored material and rebuildable derived structure.

Current stable release found during this pass: SilverBullet 2.10.0, released 2026-07-28.

Sources:
- https://github.com/silverbulletmd/silverbullet/releases
- https://github.com/silverbulletmd/silverbullet
- https://v2.silverbullet.md/Object
- https://v2.silverbullet.md/X-Ray

## Mechanism 1 — Markdown remains authoritative while objects are indexed projections

SilverBullet automatically extracts Objects from Markdown pages into an Object Index that powers page picking, linked mentions, queries, and other derived behaviors.

Earlier architecture documentation states the key invariant plainly: the truth remains in Markdown, while the object index can be flushed and rebuilt from source Markdown.

Catalyst implication: query indexes, search indexes, inferred clusters, lens caches, and other accelerators should be disposable/rebuildable wherever possible. They should not quietly become the only surviving copy of analytical truth.

## Mechanism 2 — X-Ray is an inspectable interpretation lens

SilverBullet's X-Ray editor lens marks text ranges that were extracted as Objects and lets the user inspect the attributes the indexer assigned to them.

This is unusually relevant to Catalyst's analytical-lens model. The base material does not need to be permanently decorated with every computed or structured property; an optional lens can reveal what the system believes is present, then disappear without mutating the underlying material.

Catalyst should carry forward two rules:
- computed interpretation should be inspectable where it applies;
- turning a lens on or off must not itself create or delete analytical assertions.

Source:
- https://v2.silverbullet.md/X-Ray

## Mechanism 3 — queries create live projections, not copied reports

SilverBullet's Object Index can be queried to generate linked mentions, lists, task views, and other dynamic content. Its runtime/index APIs also support ad hoc indexing and programmable derived views.

The useful Catalyst precedent is that a projection can be generated from underlying identities rather than copied into a second manually synchronized dataset.

If a Catalyst projection is editable, however, it must retain a durable reference to the underlying analytical identity so an edit has an unambiguous target.

## Mechanism 4 — position-derived references expose an anchor problem

SilverBullet Objects have historically been addressable by page plus source position. That is workable for rebuildable note indexes, but it is weaker than Catalyst needs for evidence provenance because ordinary edits can move textual positions.

SilverBullet 2.7 introduced experimental space-global `$name` anchors for almost any Object. The appearance of a more stable naming mechanism reinforces the underlying requirement: important cross-context identities eventually need anchors that survive surrounding edits.

Catalyst should therefore avoid relying on raw offsets as the durable identity of a source/evidence region. Exact anchors may use format-specific coordinates, fingerprints, stable IDs, version hashes, or combinations, but must be able to detect invalidation and relocation explicitly.

Sources:
- https://github.com/silverbulletmd/silverbullet/releases
- https://v2.silverbullet.md/Object

## Mechanism 5 — programmability is powerful but must remain optional

SilverBullet's Space Lua, query APIs, templates, commands, and widgets let advanced users build new projections and workflows without modifying the core application.

That is attractive for Catalyst's long-term non-proprietary methodology goal: specialized analytical methods could eventually be packaged as documented extensions/lenses rather than permanently expanding the default UI.

But ordinary analytical work must not require scripting. Programmability should extend the commitment ladder, not become another admission requirement before a user can place, compare, or reason over material.

## What Catalyst should inherit

1. A clear boundary between canonical authored state and rebuildable indexes/projections.
2. Optional X-Ray-style lenses that expose machine interpretation in context.
3. Query-generated views that preserve references to underlying identities rather than creating copies.
4. Stable anchors for anything whose identity must survive edits and projection changes.
5. An extension path for advanced methods that does not enlarge the ordinary default UI.

## What Catalyst should not inherit

1. Markdown as the only authoritative representation for every analytical species.
2. Page-plus-position references as sufficient provenance for evidence-grade anchors.
3. A programmable environment whose basic use depends on queries or scripting.
4. Treating automatically extracted Objects as equivalent to analyst-authored analytical assertions.
5. Allowing derived index state to become irreplaceable without declaring that change in authority.

## Net architectural effect

SilverBullet provides the clearest current precedent in this sweep for a **canonical record / derived lens** boundary.

Catalyst should identify each stored structure as one of at least three classes: authoritative analyst/source state, reproducible derived state, or ephemeral presentation state. That classification matters for backup, audit, export, invalidation, collaboration, and user trust.

A useful future Catalyst diagnostic mode could work like X-Ray: reveal provenance anchors, inferred entities, relationship classifications, hidden occurrence identity, or validation state directly where they apply, while leaving the calm base Working Picture untouched when the lens is off.

This first forward-research sweep now covers sufficiently distinct mechanisms to synthesize before adding more products.
