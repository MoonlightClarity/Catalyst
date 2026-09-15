import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const expectedModules = [
  "00-tokens.css",
  "10-base.css",
  "15-shell.css",
  "20-notes.css",
  "30-analysis-outline.css",
  "40-techniques.css",
  "50-reader.css",
  "70-iconography.css",
];

const index = read("src/styles/index.css");
const actualModules = [...index.matchAll(/@import "\.\/(.+\.css)";/g)].map((m) => m[1]);
if (JSON.stringify(actualModules) !== JSON.stringify(expectedModules)) {
  throw new Error(`CSS module order changed: ${actualModules.join(", ")}`);
}

for (const file of expectedModules) {
  if (!fs.existsSync(path.join(root, "src", "styles", file))) {
    throw new Error(`Missing CSS owner module: ${file}`);
  }
}
const main = read("src/main.tsx");
const legacyImport = main.indexOf('import "./styles.css";');
const moduleImport = main.indexOf('import "./styles/index.css";');
if (legacyImport < 0 || moduleImport < 0 || legacyImport > moduleImport) {
  throw new Error("Legacy CSS must load before modular CSS");
}

const legacy = read("src/styles.css");
if (!legacy.startsWith("/* FROZEN LEGACY CASCADE")) {
  throw new Error("styles.css must remain explicitly frozen");
}
if (legacy.split("\n").length > 6500) {
  throw new Error("styles.css grew beyond the frozen legacy ceiling");
}

const forbiddenLegacyMarkers = [
  "adaptive Working Picture geometry",
  "structured-technique modernization",
  "frozen map ontology: RootItem",
  "annotation rail palette + ontology projection",
  "Assessment questionnaire shell",
  "reader ergonomics: dedicated left annotation rail",
];
for (const marker of forbiddenLegacyMarkers) {
  if (legacy.includes(marker)) throw new Error(`Migrated CSS returned to legacy: ${marker}`);
}
if (legacy.includes(".technique")) {
  throw new Error("Techniques CSS must be owned exclusively by src/styles/40-techniques.css");
}
for (const retiredPrototypeMarker of [".desk-", "desk-prototype", "architecture-prototype"]) {
  if (legacy.includes(retiredPrototypeMarker) || main.includes(retiredPrototypeMarker)) {
    throw new Error(`Retired prototype surface returned: ${retiredPrototypeMarker}`);
  }
}
if (fs.existsSync(path.join(root, "src", "features", "desk"))) {
  throw new Error("Retired desk prototype source directory returned");
}
const techniquesCss = read("src/styles/40-techniques.css");
const techniquesView = read("src/features/techniques/TechniqueSection.tsx");
for (const retiredMarker of [".technique-list-entry", ".technique-list-summary", "counter-reset: technique-sequence"]) {
  if (techniquesCss.includes(retiredMarker)) throw new Error(`Retired Techniques list CSS returned: ${retiredMarker}`);
}
if (/<details|<summary/.test(techniquesView)) {
  throw new Error("Methods landing must remain a plain Outline-style tree, not a details/summary list");
}
if (techniquesView.includes("onAddShortcut") || techniquesView.includes("onTreeTab")) {
  throw new Error("Methods keyboard commands must stay scoped to focused method rows");
}
if (!techniquesView.includes('data-technique-run-id={run.id}') || !techniquesView.includes('event.key === "Enter"')) {
  throw new Error("Methods rows must own their Outline-style keyboard commands");
}
if (!techniquesView.includes('className="icon-button technique-row-edit"')) {
  throw new Error("Methods rows must expose an explicit edit control");
}
if (techniquesView.includes('className="technique-tree-master"') || techniquesView.includes('className="technique-tree-add"')) {
  throw new Error("Methods must not restore a synthetic root or visible add button");
}
const tokens = read("src/styles/00-tokens.css");
for (const token of ["--type-body: 15px", "--leading-reading: 1.65", "--icon-md: 18px"]) {
  if (!tokens.includes(token)) throw new Error(`Missing readability token: ${token}`);
}

const ownershipChecks = {
  "15-shell.css": [".context-tabs", ".working-picture-workspace.view-map"],
  "20-notes.css": [".selection-capture-dock", ".note-title-input"],
  "30-analysis-outline.css": [".picture-outline-view", ".picture-structural-root"],
  "40-techniques.css": [".technique-ordered-list", ".technique-workspace-surface"],
  "50-reader.css": [".thorium-pdf-reader", ".thorium-pdf-toolbar"],
  "70-iconography.css": [".instrument-glyph"],
};
for (const [file, needles] of Object.entries(ownershipChecks)) {
  const css = read(`src/styles/${file}`);
  for (const needle of needles) {
    if (!css.includes(needle)) throw new Error(`${file} lost ownership marker ${needle}`);
  }
}

console.log("css architecture contract: ok");
