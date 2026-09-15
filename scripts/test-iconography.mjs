import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const srcRoot = path.join(root, "src");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(tsx|ts)$/.test(entry.name) ? [full] : [];
  });
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function expectText(relativePath, text) {
  if (!read(relativePath).includes(text)) {
    throw new Error(`${relativePath} must contain ${JSON.stringify(text)}`);
  }
}

function rejectText(relativePath, text) {
  if (read(relativePath).includes(text)) {
    throw new Error(`${relativePath} must not contain ${JSON.stringify(text)}`);
  }
}

const symbols = read("src/ui/CatalystSymbols.tsx");
const instrumentUnion = symbols.match(/export type InstrumentGlyphName\s*=([\s\S]*?);/)?.[1] ?? "";
const instrumentNames = [...instrumentUnion.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
const duplicateNames = instrumentNames.filter((name, index) => instrumentNames.indexOf(name) !== index);
if (duplicateNames.length > 0) {
  throw new Error(`Duplicate InstrumentGlyph names: ${[...new Set(duplicateNames)].join(", ")}`);
}

const retiredNames = [
  "branch", "layers", "timeline", "matrix", "inspect", "annotation",
  "analytic-key", "analytic-contradiction", "analytic-uncertain",
  "analytic-follow-up", "next-mark", "first",
  "clear-meaning", "evidence-save", "outline-send", "legacy-review",
  "confirm-mark", "export-bundle", "export-register", "export-review",
  "new", "link-out", "link-in", "unlink", "home", "library", "attach",
  "source-link", "stamp-tool", "analytic-frame", "text-select",
];
for (const name of retiredNames) {
  if (instrumentNames.includes(name)) throw new Error(`Retired InstrumentGlyph returned: ${name}`);
}

expectText("src/styles/index.css", '@import "./70-iconography.css";');
expectText("src/styles/00-tokens.css", "--icon-md: 18px;");
rejectText("src/styles/70-iconography.css", ".picture-outline-meta-chip");
rejectText("src/styles/50-reader.css", ".annotation-semantic-preset");
for (const retiredReaderClass of [
  ".annotation-analytic-", ".annotation-quick-", ".annotation-toolbar-analytic",
  ".annotation-toolbar-style", ".annotation-toolbar-send", ".annotation-toolbar-export",
  ".annotation-toolbar-label", ".annotation-style-", ".annotation-color-control",
]) {
  rejectText("src/styles/50-reader.css", retiredReaderClass);
}

const semanticRules = {
  close: /close|dismiss/i,
  delete: /delete|trash/i,
  "open-source": /source/i,
  center: /center|recenter/i,
  highlight: /highlight|emphasis/i,
};

for (const file of walk(srcRoot)) {
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(/<InstrumentGlyph\s+name="([^"]+)"/g)) {
    const rule = semanticRules[match[1]];
    if (!rule) continue;
    const start = Math.max(0, match.index - 280);
    const end = Math.min(source.length, match.index + match[0].length + 280);
    const context = source.slice(start, end);
    if (!rule.test(context)) {
      const relative = path.relative(root, file).replaceAll("\\", "/");
      throw new Error(`${relative}: ${match[1]} is outside its semantic context`);
    }
  }
}
expectText("src/ui/CatalystSymbols.tsx", '| "open-source"');
expectText("src/ui/CatalystSymbols.tsx", '| "center"');


expectText("src/features/selection/SelectionCard.tsx", 'name="trace"');
expectText("src/features/selection/SelectionCard.tsx", 'name="copy"');
expectText("src/features/selection/SelectionCard.tsx", 'name="close"');
rejectText("src/features/selection/SelectionCard.tsx", 'name="outline-send"');
rejectText("src/features/selection/SelectionCard.tsx", 'name="attach"');


console.log("iconography semantic contract: ok");
