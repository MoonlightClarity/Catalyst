# Forward comparator pass — Logseq — 2026-09-11

Status: source/documentation research only; no Catalyst GUI manipulation or product code.

## Why Logseq is a distinct comparator

Logseq stresses identity and reuse rather than spatial portrayal. Its core mechanism is addressable blocks/nodes that can be referenced, embedded, queried, and surfaced in multiple contexts.

As of this pass, the current Logseq repo marks Desktop 2.0.1 as the latest beta DB release (2026-07-13) and continues nightly releases; the older file-based Markdown product line has been split into `Logseq OG`. The DB version remains beta and its newer RTC/mobile pieces are still described as alpha-risk.

Sources:
- https://github.com/logseq/logseq/releases
- https://github.com/logseq/logseq
- https://logseq.io/page/b2ad9ce1-9cb7-4436-8083-54cb4516d324/df4dc09d-0a12-4c87-904e-22a9bf4c350a
- https://github.com/logseq/docs/blob/master/db-version.md
- https://github.com/logseq/docs/blob/master/db-version-changes.md

## Mechanism 1 — references reuse identity; copies do not

Classic Logseq gives every block an address. A block reference displays the referenced block's content elsewhere while preserving the original block identity and increasing a reference counter at the source.

This is a strong precedent for Catalyst's multiple-occurrence requirement: the same underlying analytical material can appear in more than one context without duplicating the underlying identity.

## Mechanism 2 — reference and embed are different cognitive operations

Classic Logseq distinguishes a block reference from a block embed. A reference shows one block as a read-through view; an embed exposes the block plus descendants and is directly editable as a portal into the source branch.

This distinction matters for Catalyst because "show this elsewhere" and "work on the same thing from here" need not be identical interactions.

Catalyst can carry this forward as separate occurrence behaviors:
- a lightweight occurrence/quote/reference that preserves identity and source return;
- an editable occurrence that intentionally opens the same underlying object in another context;
- a transformed derivative that is no longer merely another occurrence and therefore needs provenance.

Sources:
- https://discuss.logseq.com/t/the-basics-of-logseq-block-references/8458
- https://discuss.logseq.com/t/the-difference-between-logseqs-block-embeds-and-block-references/8459
- https://discuss.logseq.com/t/the-difference-between-logseqs-block-embeds-and-page-embeds/8460

## Mechanism 3 — backlinks make reuse inspectable

References are not only forward pointers. The source block exposes how many references target it, and users can traverse those references.

Catalyst implication: multiple occurrences should not become silent duplication. The underlying analytical identity should expose where it is portrayed/used, just as provenance should expose where a derived claim came from.

## Mechanism 4 — Logseq 2.0 collapses pages and blocks into one node model

The DB version explicitly unites blocks and pages as nodes. References use a common `[[]]` form rather than maintaining the older distinction between page links and `((block refs))`.

This is a useful warning as well as a useful precedent. A unified node identity simplifies reuse, querying, properties, and cross-context references, but it can erase distinctions that remain cognitively or provenance-significant.

Catalyst should therefore unify identity only where the things are genuinely the same kind of analytical entity. A source document, exact source region, analyst note, proposition, occurrence, and semantic relation should not all become one undifferentiated `node` merely because a generic graph store can represent them that way.

The better lesson is: stable identity can be shared across projections without forcing every domain species into one ontology.

## Mechanism 5 — the storage migration exposes a portability tradeoff

Logseq's project split is architecturally important. File-based Markdown graphs now live as Logseq OG, while the main Logseq line moves to DB graphs stored in SQLite with assets alongside them.

The DB documentation offers SQLite, SQLite+assets, EDN, and Markdown exports. It explicitly states that standard Markdown does not capture all graph data, while Build EDN is intended to capture structured graph content more completely.

Catalyst implication: human-readable export and full-fidelity export are different requirements. If Catalyst uses a richer internal record, it should specify both:
- a complete durable machine-readable archival/export form;
- useful open human-readable projections that may intentionally omit some state.

Do not claim that a Markdown export is a lossless escape hatch if provenance, occurrence state, structured relations, or portrayal state cannot survive it.

## Mechanism 6 — properties become structured schema rather than text convention

Logseq DB moves properties from Markdown `key:: value` conventions into structured database entities with schema/type/cardinality. Tags can act as classes and pages/blocks can inherit property schemas.

This shows the benefit of separating semantic structure from textual representation once richer computation is required. Catalyst will likely need the same separation for provenance, confidence/uncertainty, relation types, temporal state, and method artifacts.

But the cognitive rule remains: structured fields should become visible when useful, not force every captured item through a schema form at creation time.

Sources:
- https://github.com/logseq/logseq/blob/master/libs/guides/db_properties_references.md
- https://github.com/logseq/logseq/blob/master/libs/guides/db_properties_guide.md

## What Catalyst should inherit

1. Stable object identities that can be reused across contexts without copy proliferation.
2. Inspectable backlinks/usage locations for reused analytical identities.
3. Separate semantics for reference, editable embed, and transformed derivative.
4. Structured machine-readable properties beneath a low-friction editing surface.
5. Explicit full-fidelity archival/export separate from lossy convenience export.

## What Catalyst should not inherit

1. "Everything is a node" as an excuse to erase source/provenance/occurrence distinctions.
2. A globally outline-first interaction grammar as the home cognitive surface.
3. Textual transclusion that visually obscures where an occurrence lives or where its source originated.
4. A datastore transition that makes old/open formats only partially faithful without a clearly documented preservation contract.
5. Treating backlinks themselves as analytical relationships; reuse/reference is not support, causation, identity, or corroboration.

## Net architectural effect

Logseq sharpens Catalyst's multiple-occurrence model. A Working Picture occurrence should be understood as a located use/portrayal of an analytical identity, not as a duplicate object. That occurrence can have its own geometry and local visibility while the underlying object remains shared.

The Logseq reference/embed distinction also suggests that Catalyst should distinguish a read-through occurrence from an editable same-object occurrence and from a derived/transformed artifact. Those are three different provenance states, even if all can look like "the same excerpt" on screen.

The DB transition adds another requirement: Catalyst documentation should state which exports are full-fidelity and which are interoperability projections. Open format should mean documented, inspectable, and recoverable—not necessarily "all state fits losslessly into Markdown."

## Next bounded comparator

Next: Excalidraw. Research scene-element identity, binding/relationships, grouping, frames, embedded elements, library items, file format, and how a drawing tool keeps geometry primary without pretending geometry is semantic truth.
