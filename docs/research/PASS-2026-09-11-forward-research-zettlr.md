# Forward comparator pass — Zettlr — 2026-09-11

Status: source/documentation research only; no Catalyst GUI manipulation or product code.

## Why Zettlr is a distinct comparator

Zettlr is deliberately document/file centric. That makes it useful as a counterexample to graph/canvas maximalism: it shows how serious research/writing workflows can preserve plain files, external citation managers, and explicit project boundaries without turning every artifact into an internal database object.

Current official version found during this pass: Zettlr 4.7.0. Official documentation was refreshed in August 2026.

Sources:
- https://zettlr.com/download/deb64
- https://www.zettlr.com/changelog
- https://docs.zettlr.com/
- https://github.com/Zettlr/Zettlr

## Mechanism 1 — workspaces are ordinary folders, not opaque containers

Zettlr defines a workspace as a regular folder on the computer that the application indexes for links, tags, metadata, and completion features. Closing a workspace removes it from the app without deleting or relocating the underlying folder.

The documentation explicitly frames this as an anti-lock-in choice: the user's Markdown files remain normal files that can be moved and accessed outside Zettlr.

Catalyst implication: wherever feasible, external source artifacts should remain independently usable files. Catalyst's analytical record can be richer than Markdown, but it should not require importing every source into an opaque proprietary container merely to participate in analysis.

## Mechanism 2 — projects are scoped behavior layered onto folders

Zettlr projects are not a separate object universe. A project is essentially a folder with project features enabled, allowing multiple Markdown documents to be treated as one publication unit.

This is a useful scoping pattern for Catalyst: an analytical place can gain capabilities because of its role without forcing the user to migrate material into a special storage silo.

Catalyst's Working Pictures/subpictures should likewise be scope/portrayal constructs over durable analytical identities, not storage partitions that duplicate or imprison those identities.

Source:
- https://docs.zettlr.com/en/file-manager/projects.html

## Mechanism 3 — citation identity remains external and standardized

Zettlr does not recreate a reference manager. It consumes external bibliography files such as CSL JSON, BibTeX, or BibLaTeX and supports Zotero/JabRef workflows by watching those exported files for updates.

Citations use Pandoc citation syntax and citekeys rather than opaque editor-only objects. Citation styling can be configured globally, per project, or per file using CSL and YAML frontmatter.

This is important for Catalyst because provenance/reference integration should reuse established identifiers and exchange formats where possible instead of inventing a parallel citation system.

## Mechanism 4 — citation text and source access stay coupled

Zettlr can open the PDF associated with a citation directly from the citation context menu. With CSL JSON from Zotero, Zettlr may query a running Zotero instance to resolve the PDF path.

This is a modest but useful source-return mechanism: a citation in authored prose remains navigable back to the cited artifact rather than becoming dead text.

Catalyst should extend this principle much further. A source citation can identify the work, but evidence/provenance needs an exact source anchor when possible (page, region, timestamp, cell, frame, etc.). Bibliographic identity and evidence location should therefore be separate but linked fields.

## Mechanism 5 — writing view and publication output are deliberately different

Zettlr uses Pandoc/CSL to transform lightweight source text into publication outputs. The editor preview is intentionally not the final publication rendering; export configuration can apply a different citation style and project-level output settings.

This reinforces Catalyst's distinction between Working Picture and communicable product. The analytical workspace should optimize thought and auditability, while briefing/report output should be a derived portrayal rather than forcing the working surface to remain presentation-ready.

## What Catalyst should inherit

1. External source files remain independently usable wherever practical.
2. Workspaces/scopes can be application behavior layered onto ordinary storage rather than opaque silos.
3. Established citation formats and identifiers should be reused instead of reimplemented.
4. Citation/source identity should provide direct source return.
5. Working representation and publication representation should remain separate concerns.
6. Indexes and metadata can enrich open files without becoming the only surviving source of truth.

## What Catalyst should not inherit

1. Folder hierarchy as the primary analytical structure.
2. Document-centric UI as the only place where source material can participate in reasoning.
3. Bibliographic citation as a substitute for exact evidence provenance.
4. A workflow where spatial/relational analytical state exists only implicitly in prose and file placement.
5. Forcing every analytical object to be representable as standalone Markdown text.

## Net architectural effect

Zettlr adds an important constraint to Catalyst's richer architecture: the analytical system should gain power without needlessly capturing ownership of the user's source corpus.

Catalyst can maintain a structured analytical database/record while referring to ordinary external files by stable source identity, hashing/version metadata, and anchors. Where a source must be copied for preservation, that should be explicit provenance behavior rather than an invisible import side effect.

Zettlr also reinforces that bibliographic identity, exact evidence anchor, analytical use, and final citation rendering are separate layers. They should not be collapsed into one `citation` field.

## Next bounded comparator

Next candidate: AppFlowy or another current FOSS system only if it adds a distinct cognitive/data mechanism; avoid repeating generic block/database features already covered by AFFiNE and Logseq.
