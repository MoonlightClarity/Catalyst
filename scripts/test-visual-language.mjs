import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");

const app = read("src/App.tsx");
const outlineWorkspace = read("src/features/analysis/OutlineWorkspace.tsx");
const outline = read("src/features/analysis/AnalysisOutlineView.tsx");
const techniques = read("src/features/techniques/TechniqueSection.tsx");
const selection = read("src/features/selection/SelectionCard.tsx");
const symbols = read("src/ui/CatalystSymbols.tsx");
const styles = read("src/styles.css");
const outlineStyles = read("src/styles/30-analysis-outline.css");
const xml = read("src/persistence/xml.ts");
const xmlRepository = read("src/persistence/xmlRepository.ts");
const hydrate = read("src/persistence/hydrate.ts");
const recovery = read("src/persistence/recoveryJournal.ts");

assert.doesNotMatch(app, /<CatalystMark\s*\/>/, "the reader header must not restore the removed Catalyst branding mark");
assert.doesNotMatch(app, /WorkspaceConfigMenu/, "retired workspace configuration controls must not return to the analytical shell");
assert.match(app, /className="pdf-pane"[\s\S]{0,180}aria-label="PDF reader"/, "reader pane should remain explicitly identified without a redundant visible Source label");
assert.doesNotMatch(app, /className="reader-mode-label"/, "the retired visible Source mode label must not return to the reader header");
assert.match(app, /<OutlineWorkspace/, "the primary analysis surface should use the Outline workspace");
assert.doesNotMatch(app, /EvidenceList|navigateToContextMode\("evidence"\)|>\s*Evidence\s*</, "the retired Evidence workspace must not return");
assert.equal(fs.existsSync(path.join(root, "src/features/evidence")), false, "the retired Evidence feature directory must remain removed");
assert.doesNotMatch(app, /<AnalysisMapWorkspace/, "the retired Map renderer must not remain mounted");
assert.doesNotMatch(app, /<GraphWorkspace/, "the retired Cartesian graph UI must not remain mounted");

assert.doesNotMatch(outlineWorkspace, />\s*Profile\s*</, "profile configuration must not enter Outline controls");
assert.doesNotMatch(outlineWorkspace, />\s*Features\s*</, "feature configuration must not enter Outline controls");
assert.match(outlineWorkspace, /<AnalysisOutlineView/, "Outline workspace must render the canonical Outline editor");
assert.doesNotMatch(outlineWorkspace, /serializeOutline|Export Outline|analysisExport/i, "Outline must not expose export features");
assert.doesNotMatch(techniques, /downloadTechniques|techniquePdfExport|Export PDF|Export RTF/i, "Methods must not expose export features");
assert.doesNotMatch(outlineWorkspace, /Map View|Export Map|WorkingPicture|map\//, "retired Map concepts must not remain in the Outline workspace");
assert.match(outline, /data-outline-placement-id=\{row\.placementId\}[\s\S]{0,120}tabIndex=\{row\.placementId === rovingFocusId \? 0 : -1\}/, "Outline should use row-level roving keyboard focus");
assert.match(outline, /event\.key === "ArrowDown"/, "Outline should support keyboard row navigation");
assert.match(outline, /event\.key === "ArrowLeft"/, "Outline should use conventional tree collapse/parent navigation");
assert.match(outline, /event\.key === "ArrowRight"/, "Outline should use conventional tree expand/child navigation");
assert.match(outline, /event\.key === "Tab"/, "Outline should support keyboard indentation");
assert.match(outline, /event\.key === "Tab"[\s\S]{0,220}event\.shiftKey[\s\S]{0,180}outdentAndRefocus/, "Outline Shift+Tab should outdent the focused row");
assert.match(outline, /event\.key === "F2"/, "Outline should support keyboard rename");
assert.match(outline, /event\.key === "Backspace"/, "Outline should use Backspace to delete the selected note");
assert.doesNotMatch(outline, /event\.key === "Delete"/, "Outline must not bind the Delete key");
assert.doesNotMatch(outline, /picture-outline-add|Add child note|Add top-level note/, "simple Outline authoring should remain keyboard-only without visible add controls");
assert.doesNotMatch(outline, /event\.key === "Insert"/, "simple Outline authoring must not restore the obscure Insert shortcut");
assert.doesNotMatch(outline, /onOpenOnMap|Show on map/, "simple Outline rows must not restore per-row Map navigation");
assert.doesNotMatch(techniques, /onAddShortcut|onTreeTab/, "Methods shortcuts must not be registered globally");
assert.doesNotMatch(techniques, /className="technique-tree-master"/, "Methods must not render a synthetic Methods root above the method tree");
assert.match(techniques, /data-technique-run-id=\{run\.id\}[\s\S]{0,220}onKeyDown=\{\(event\) => \{/, "Methods shortcuts should be owned by the focused method row");
assert.match(techniques, /event\.key === "Enter"[\s\S]{0,120}openSiblingPicker\(run\)/, "Enter on a focused method should open the chooser for a sibling method");
assert.match(techniques, /event\.key === "Tab"[\s\S]{0,320}on(?:Indent|Outdent)Run/, "Tab and Shift+Tab should structurally indent or outdent only the focused method");
assert.match(techniques, /event\.key === "Tab"[\s\S]{0,180}event\.shiftKey[\s\S]{0,180}onOutdentRun\(run\.id\)/, "Methods Shift+Tab should outdent the focused row, matching Outline");
assert.match(techniques, /event\.key === "Backspace"[\s\S]{0,320}onDeleteRun\(run\.id\)/, "Methods Backspace should remove the focused method, matching Outline");
assert.doesNotMatch(techniques, /event\.key === "Delete"/, "Methods must not bind the Delete key");
assert.doesNotMatch(techniques, /className="icon-button danger-hover"/, "Methods should not restore a dedicated trash icon; focused Backspace owns keyboard removal and edit is the only row action icon");
assert.match(techniques, /className="icon-button technique-row-edit"[\s\S]{0,180}setSelectedRunId\(run\.id\)/, "each method row should expose an explicit write/edit control");
assert.doesNotMatch(techniques, /className="technique-list-title"[\s\S]{0,180}onClick=\{\(\) => setSelectedRunId/, "clicking a method title must focus it without opening the editor");
assert.match(techniques, /aria-label="Find catalog method"[\s\S]{0,80}autoFocus/, "the method chooser should focus catalog search so templates remain the default add path");
assert.match(techniques, /aria-label="Filter methods by cluster"/, "method clusters should be exposed as an explicit chooser filter");
assert.match(techniques, /if \(clusterFilter && cluster !== clusterFilter\) return false;/, "the method chooser should filter catalog entries by the selected cluster");
assert.doesNotMatch(techniques, /definition\.name\}\\n\$\{definition\.summary\}\\n\$\{definition\.cluster/, "free-text method search must not match cluster metadata");
assert.doesNotMatch(techniques, /aria-label="Custom method name"[\s\S]{0,140}onKeyDown/, "Enter in the custom-name field must not silently create a blank method");
assert.doesNotMatch(techniques, /technique-tree-add|aria-label="Add method"|technique-tree-shortcut|<kbd>Enter<\/kbd>/, "Methods must not restore visible add controls or shortcut hints");
assert.doesNotMatch(outline, /[\u00C2\u00E2\uFFFD]/, "Outline UI copy must remain free of mojibake markers");


assert.match(selection, /selection-capture-dock/, "Reader capture should use the compact source-fragment dock");
assert.match(selection, /InstrumentGlyph/, "Reader capture actions should be icon-led rather than paragraph-led");
assert.doesNotMatch(selection, /selection-card-copy/, "legacy text-heavy selection card controls must stay retired");
assert.match(outline, /className="picture-outline-note-editor"/, "the selected Outline row should expose inline note editing");
assert.match(outline, /onUpdateNoteBody\(row\.noteId, event\.target\.value\)/, "inline note editing should update the selected note directly");
assert.doesNotMatch(app, /NoteInspector|inspector=\{/, "the retired side inspector must not return");
assert.doesNotMatch(outline, /name="reorder-before"|name="reorder-after"|picture-outline-action-menu/, "simple Outline rows must not restore the retired action-menu controls");
assert.match(symbols, /catalyst-mark-junction/, "brand mark should derive from trace/junction geometry");
assert.match(symbols, /export function AnalyticalGlyph/, "Catalyst must expose a bespoke analytical glyph family");
for (const kind of ["claim", "assumption", "hypothesis", "question", "entity", "event", "source", "evidence"]) {
  assert.match(symbols, new RegExp(`case "${kind}"`), `custom analytical glyph missing: ${kind}`);
}
assert.match(symbols, /\| "reorder-before"[\s\S]*\| "reorder-after"/, "instrument family should distinguish structural reorder from navigation");

assert.match(outlineStyles, /\.picture-outline-note-editor/, "Outline styling should own the inline note editor");

assert.match(xml, /catalyst-workspace/, "XML persistence must expose the Catalyst workspace root");
assert.match(xmlRepository, /hydrateWorkspaceState\(deserializeWorkspaceXml/, "XML repository must hydrate decoded workspace state");
assert.match(xmlRepository, /hydrateWorkspaceState\(JSON\.parse\(raw\)/, "XML persistence must hydrate legacy browser JSON at the migration boundary");
assert.doesNotMatch(hydrate, /mapView|sanitizeMapView/, "shared hydration must not retain retired Map state");
assert.match(recovery, /hydrateWorkspaceState\(envelope\.state\)/, "recovery journal must hydrate and sanitize recovered workspace state through the shared boundary");

for (const relative of ["public/catalyst-app-icon.svg", "public/catalyst-mark.svg"]) {
  const iconPath = path.join(root, relative);
  assert.equal(fs.existsSync(iconPath), true, `Catalyst web icon asset missing: ${relative}`);
  assert.ok(fs.statSync(iconPath).size > 100, `Catalyst web icon asset looks empty: ${relative}`);
}
assert.doesNotMatch(read("app-icon.svg"), />E</, "the vector app icon must not regress to the boxed E placeholder");

console.log("Catalyst Outline visual-language contract tests passed.");
