# Catalyst Thorium Reader Low-Opportunity-Cost Freeze — 2026-09-14

Status: **frozen implementation backlog**. Research is sufficiently converged for implementation.

**Pre-user gate:** apply `docs/research/PRE_USER_EVALUATION_FRAMEWORK_2026-09-14.md` when deciding whether to execute later backlog items. Catalyst currently has no external users, so this document is a capability inventory and ordered implementation reference, not a mandate to achieve Thorium feature parity. Priority 0 correctness work and core reader completion remain justified; later management features require a demonstrated current workflow gap as well as low implementation cost.

## Purpose

This document freezes the low-opportunity-cost reader work identified by comparing Catalyst's live PDF reader against current Thorium Reader behavior and the capabilities already present in Catalyst's installed PDF.js stack.

The goal is not to recreate Thorium. Thorium remains the mature interaction baseline for reader/navigation/annotation management; Catalyst retains its own source, evidence, provenance, and analytical semantics.

This pass is specifically about exposing mature reader behavior that Catalyst already largely possesses underneath the UI.

## Core conclusion

Catalyst no longer has a meaningful PDF-engine deficit. It has an **exposure and reader-management deficit**.

The current direct PDF.js reader already supports substantially more than the visible toolbar exposes. The safest remaining gains come from completing reader navigation, search, view controls, position restoration, and annotation management without changing the analysis ontology.

## Scope rule

A feature belongs in this pass when it can reuse the existing PDF.js viewer, Catalyst viewer capability facade, current reader state, existing annotation records, current resizable reader rail, or a very small reader-local persistence mechanism.

If it requires a new analytical ontology, a large persistence migration, a second PDF engine, generalized metadata architecture, or substantial manager infrastructure, it is outside this freeze.
## Live architecture verified during research

The current reader is `src/viewer/ThoriumPdfReader.tsx` and directly constructs PDF.js `EventBus`, `PDFLinkService`, `PDFFindController`, and `PDFViewer`.

Catalyst also already has a viewer capability facade through `RegistryLike` in `src/viewer/embedpdf.ts`. The facade currently exposes document management, scrolling, selection, and annotations.

**Architectural rule:** extend this facade for new reader capabilities rather than leaking `PDFViewer`, `PDFLinkService`, or PDF.js event-bus internals into `App.tsx`.

Do not reopen the previous EmbedPDF plugin migration merely because EmbedPDF plugins remain installed transitively. The live reader is direct PDF.js and the low-cost path is to expose the APIs already in use.

Existing durable annotation paths must remain distinct:

- Catalyst `Annotation` records represent source/evidence semantics and exact source identity.
- `ViewerMarkup` records persist ordinary PDF.js-native markup separately.
- Catalyst analytical/source-semantic overlays are projections over source records, not replacements for native PDF annotations.

The existing reader rail is already resizable and has compact behavior. Reuse it instead of adding competing sidebars.

Recommended rail grammar:

`Tools | Marks | Contents | Bookmarks`

Only add the Bookmarks mode when the bookmark domain record is implemented.
## Priority 0 — correctness before feature growth

### 0.1 Restore per-document position within the current session

Catalyst already records current pages in `currentPageByDocumentRef`, but `ThoriumPdfReader.activate()` resets reader state to page 1 when activating a document.

Fix document switching so A → B → A returns to A's remembered page.

This is a correctness repair, not a new feature.

### 0.2 Add intentional-jump reader history semantics

Ordinary scrolling must continue to update current location without creating history entries.

Intentional jumps should create `ReaderHistory` transitions:

- PDF internal links;
- search-result navigation when it changes source location materially;
- annotation/mark jumps;
- Contents/outline jumps;
- bookmark jumps.

The model should remain:

`ordinary scroll → current location only`

`intentional jump → from location + destination → ReaderHistory transition`

This finishes the existing reader-history contract and is a prerequisite for mature Contents, Marks, and Bookmarks behavior.
## Priority 1 — low-cost reader completion

### Search completion

The existing search dispatch already hardcodes options that PDF.js supports dynamically. Expose the mature behavior instead of creating another search engine.

Add:

- current match / total match count from `updatefindmatchescount`;
- not-found / wrapped state from `updatefindcontrolstate`;
- case-sensitive toggle;
- whole-word toggle;
- optional match-diacritics toggle if it remains visually quiet;
- Ctrl/Cmd+F opens and focuses reader search;
- prefill search from the current PDF text selection when available.

Keep `highlightAll` and phrase search behavior unless testing shows a reason to change them.

### View and zoom controls

Expose PDF.js scale modes already present in the installed build:

- Fit width — already present;
- Fit page — `page-fit`;
- Fit height — `page-height`;
- Actual size — `page-actual`;
- Auto — `auto`.

Do not turn each mode into permanent toolbar clutter. A compact fit/view menu is acceptable.
### Rotation, spread, and page navigation

Add rotate left/right using `PDFViewer.pagesRotation`. PDF.js already validates quarter turns, refreshes pages, preserves current page/scale, and emits rotation state.

Add first-page and last-page commands using the existing page-navigation path.

Add reader shortcuts where they do not conflict with Catalyst's global command grammar:

- Ctrl/Cmd+Home → first page;
- Ctrl/Cmd+End → last page;
- Ctrl/Cmd++ / Ctrl/Cmd+- → zoom;
- Ctrl/Cmd+0 → reset to the chosen default fit mode;
- Ctrl/Cmd+F → reader search when reader context owns the command.

Add spread modes using PDF.js `SpreadMode`:

- Single;
- Odd spread;
- Even spread.

Do not add horizontal or wrapped scrolling just because PDF.js exposes them. Vertical continuous remains the default analytical reading mode.

### Reading progress

Expose `currentPage / totalPages` as both page location and percentage. A restrained scrubber is acceptable if it uses the existing page navigation path.

The progress control must not create a new persistence model or flood reader history while being dragged.
### Persistent resume position

After same-session restoration is correct, persist the last page per document as reader-local view state.

Do **not** dispatch a full workspace mutation on every page change. Workspace persistence also writes recovery state and schedules durable repository sync, so high-frequency scroll state does not belong there.

Preferred behavior:

- keep current page updates in memory immediately;
- debounce a small document-ID → page-index reader preference store;
- restore the saved page after the document layout is ready;
- fall back safely to page 1 if the saved page is missing or invalid.

Bookmarks remain different: they are intentional user artifacts and should be durable workspace data.

### Zen / focus reading mode

Add a temporary reader focus mode that can hide nonessential workspace chrome without changing document or workspace state.

Candidate hidden surfaces:

- annotation/tool rail;
- analysis/context pane;
- nonessential reader header controls.

Escape must provide a predictable exit. Fullscreen may use the browser Fullscreen API but should remain independent from analytical state.
## Priority 2 — small reader components

### Rail modes

Reuse the existing resizable annotation rail instead of creating parallel sidebars.

Recommended first implementation:

- **Tools** — current annotation/source-marking controls;
- **Marks** — document-local annotation/markup management;
- **Contents** — PDF outline/navigation tree.

Add **Bookmarks** only when its small durable record is implemented.

### Marks v1

The first Marks panel should remain management-oriented, not become another editor.

Support:

- list stable cards for the active document;
- include both Catalyst source/evidence annotations and native `ViewerMarkup` records while keeping their identities distinct;
- sort by source progression/page, created time, or modified time;
- filter by mark/annotation type and existing Catalyst semantic classifications where already available;
- jump to source;
- delete through existing deletion paths.

Do not add generalized comments or tags to native viewer markups in this pass.
### Contents / PDF outline

Use `PDFDocumentProxy.getOutline()` for the hierarchy and the already-instantiated `PDFLinkService.goToDestination()` for destination navigation.

Requirements:

- recursive tree rendering;
- keyboard-accessible focus/navigation;
- intentional Contents jumps create reader-history transitions;
- no duplicate PDF destination resolver in Catalyst code;
- no coupling to the analytical outline/mind-map ontology.

### Page labels and current section

Use `getPageLabels()` so front matter and publisher-defined labels can be represented accurately where available.

Once Contents exists, derive an optional current-section / “where am I?” presentation from the current page and enclosing outline destination.

This is reader orientation only. It must not create notes, map nodes, or analytical structure automatically.

### Document information

Build one quiet information surface rather than toolbar buttons for every PDF API.

Candidate data already exposed by the installed PDF.js document proxy:

- metadata/title/author/subject/creator/producer;
- creation/modification dates and PDF version when present;
- page count and page labels;
- permissions;
- structural/marked-PDF information from `getMarkInfo()`.
### Bookmarks

Bookmarks are no longer classified as a major feature, but they are not Tier-1 view state because they are intentional saved artifacts.

Use a small separate reader-domain record rather than merging bookmarks into Catalyst `Annotation` semantics merely to resemble Thorium.

A sufficient initial shape is conceptually:

```ts
ReaderBookmark {
  id
  documentId
  pageIndex
  label | null
  createdAt
}
```

Add the usual initial-state, hydration fallback, save/delete actions, document-ID remapping, selector, and Bookmarks rail projection.

Bookmark jumps must participate in reader history.

### Embedded attachments

Use `PDFDocumentProxy.getAttachments()` to list embedded files when present.

Keep attachments in Document Info or a subordinate reader surface. Do not make them permanent toolbar chrome.
## Existing behavior to validate before implementing anything

### PDF forms

The installed PDF.js page view defaults to form-enabled annotation rendering. Catalyst is not explicitly disabling ordinary form rendering.

Therefore test representative AcroForm PDFs before creating a “forms support” project. If fields already work, document the baseline and limit changes to defects or styling.

Do not enable PDF JavaScript scripting as part of this pass. Catalyst does not currently instantiate the scripting manager, and scripting adds complexity and security surface.

### Analytic-mark visibility

The existing `Marks On / Marks Off` control hides Catalyst's `.catalyst-pdf-highlight-layer`. It does not represent a universal hide/show switch for every native PDF annotation.

Preserve that distinction in the Marks panel. Catalyst source/analytic overlays and native PDF markup can be presented together for management without pretending they share one ontology or rendering lifecycle.

### Annotated PDF export

`ThoriumPdfReader` already uses `PDFDocumentProxy.saveDocument()` for annotated-PDF export. Do not build a second export mechanism for the reader-completion pass.

### Selection and source capture

Catalyst already captures selected text, page geometry, source anchors, and copy-with-source behavior. Search-from-selection should reuse the existing reader selection snapshot rather than introduce another selection subsystem.
## Explicit deferrals

The following are intentionally outside this low-opportunity-cost freeze:

- native PDF comment-manager integration;
- signature workflows;
- PDF JavaScript scripting;
- a full PDF printing subsystem;
- OCR;
- text-to-speech/read-aloud;
- generalized tagging/comments for `ViewerMarkup`;
- Readium annotation interoperability as a new project;
- thumbnail virtualization/sidebar architecture;
- new annotation families merely to increase feature count;
- horizontal/wrapped scroll modes without a demonstrated use case;
- reopening EmbedPDF plugin architecture.

Optional Content Group / PDF layer controls are a **later opportunistic feature**. PDF.js exposes the configuration, but the feature is document-specific and should only be added after the frozen baseline is complete.

If any deferred item becomes necessary, move it to a separately scoped research/design pass rather than expanding this backlog in place.

## Implementation phases

### Phase 1 — reader-core completion

Keep this phase mostly inside `ThoriumPdfReader.tsx`, the viewer facade/helpers, and reader CSS. Complete Priority 0 and Priority 1 before adding new panel architecture.
### Phase 2 — reader management surfaces

After Phase 1 is stable, add the small panel components for Marks and Contents. Add Bookmarks only after its small durable record is accepted and implemented.

Suggested component boundaries:

- `ReaderMarksPanel`;
- `PdfContentsPanel`;
- `ReaderBookmarksPanel`;
- one quiet Document Info surface.

Do not make `App.tsx` the owner of PDF.js-specific implementation details. Use the viewer capability facade for reader operations and data retrieval.

## Validation contract

After each coherent change, validate the narrowest relevant behavior before continuing.

At minimum, freeze should eventually cover:

- page navigation and first/last commands;
- zoom/fit mode changes;
- rotation;
- spread modes;
- search event wiring and match state;
- A → B → A same-session position restoration;
- application-restart resume position;
- intentional jump history vs ordinary scrolling;
- annotation persistence across rotation/zoom/spread/view changes;
- Contents destination navigation;
- mark-list jump/delete behavior.

Do not build a large new test framework solely for this pass. Add focused regression/contract coverage where behavior could silently regress.
## Frozen execution order

| Order | Work | Classification |
|---:|---|---|
| 0 | Same-session per-document position restore | correctness repair |
| 0 | Intentional-jump → `ReaderHistory` transition | navigation contract |
| 1 | Search completion | expose existing PDF.js capability |
| 1 | Fit modes | expose existing PDF.js capability |
| 1 | Rotate left/right | expose existing PDF.js capability |
| 1 | First/last + reader shortcuts | reuse current navigation |
| 1 | Persistent last-reading position | small reader-local state |
| 1 | Reading progress/scrubber | current page state only |
| 1 | Single/odd/even spread | expose existing PDF.js capability |
| 1 | Zen/focus + fullscreen | temporary view state |
| 2 | Tools / Marks / Contents rail modes | reuse current rail |
| 2 | Marks list: sort/filter/jump/delete | projection over existing records |
| 2 | PDF Contents/outline | existing PDF outline/link APIs |
| 2 | Page labels | existing PDF API |
| 2 | Document Info | existing PDF metadata APIs |
| 2 | Bookmarks | small durable reader-domain addition |
| 2 | Embedded attachments | existing PDF API |
| 2 | Current section / “where am I?” | derived orientation aid |
| later | Optional PDF layers | document-specific opportunistic feature |

Do not reorder this list merely because a later feature is visually attractive. Priority reflects architectural safety and dependency order.
## Research basis

Local source inspected during this pass included:

- `src/viewer/ThoriumPdfReader.tsx`;
- `src/viewer/embedpdf.ts`;
- `src/viewer/annotationTools.ts`;
- `src/viewer/thoriumAnnotations.ts`;
- `src/features/annotations/AnnotationToolbar.tsx`;
- `src/domain/types.ts`;
- `src/domain/selectors.ts`;
- `src/domain/workspace.ts`;
- `src/persistence/hydrate.ts`;
- `src/app/useWorkspaceController.ts`;
- `src/styles/50-reader.css` and `src/styles/51-annotation-rail.css`;
- installed `pdfjs-dist` viewer and type declarations.

Upstream comparison focused on current Thorium reader/annotation behavior, especially the Thorium 3.5 PDF/search changes and the 2026 annotation-system source audit:

- `https://github.com/edrlab/thorium-reader/blob/develop/changelogs/CHANGELOG-v3.5.0.md`
- `https://github.com/edrlab/thorium-reader/issues/3726`
- `https://github.com/edrlab/thorium-reader`

Related Catalyst architectural baseline:

- `docs/research/REFERENCE_ARCHITECTURE_FREEPLANE_THORIUM_2026-09-13.md`
- `docs/research/LOW_OPPORTUNITY_COST_HANDOFF_2026-09-14.md`
## Handoff prompt

Use this in an implementation chat:

> Work from `docs/research/THORIUM_READER_LOW_OPPORTUNITY_COST_FREEZE_2026-09-14.md`. Treat it as the frozen low-opportunity-cost reader backlog. Re-read the live reader files before editing because parallel Catalyst work may have changed them. Complete Priority 0 before feature work, then Phase 1 in order. Preserve the `RegistryLike` viewer-capability boundary and do not reopen EmbedPDF migration, reader ontology, or analytical semantics. Reuse the existing reader rail for management surfaces. Stop and re-scope rather than pulling any explicit deferral into this pass.

## Freeze rule

This research is closed unless implementation reveals one of the following:

- an identified PDF.js API is unavailable or materially different in the live installed version;
- a proposed feature requires a domain/persistence change substantially larger than documented here;
- a reader control demonstrably conflicts with Catalyst's frozen shortcut or interaction contracts;
- validation finds that a proposed reader transformation breaks source selection, annotation persistence, or exact return-to-source.

Normal implementation details, CSS choices, icon choices, and component decomposition do **not** justify reopening comparative research.

No source code was modified during the research that produced this freeze document.
## Implementation decision — reader visual controls

The initial reader contrast ladder (`normal / soft / high`) was removed during implementation.
It overlapped too heavily with the existing light/dark PDF mode and added another mode vocabulary without a demonstrated pre-user need.

Replacement: a single user-selectable **page tint** color control.
- White is the neutral/default tint and disables the tint overlay entirely.
- A compact reset appears only when a non-neutral tint is active.
- Tint is reader-local preference state and persists locally.
- Dark mode remains the luminance/inversion control.
- Light pages use restrained multiply tinting; dark pages use restrained screen tinting so color does not simply crush contrast.
- The tint is a visual overlay only; it does not change PDF data, annotation semantics, or workspace state.

Do not restore low/medium/high or soft/normal/high reader contrast presets unless testing demonstrates a distinct problem that dark mode + tint cannot solve.
