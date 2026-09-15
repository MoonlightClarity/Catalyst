import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { catalystTestCompilerOptions } from "./test-compiler.mjs";

const nodeRequire = createRequire(import.meta.url);
const ts = nodeRequire("@typescript/typescript6");
const root = process.cwd();
const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "catalyst-xml-runtime-"));

try {
  const options = {
    ...catalystTestCompilerOptions(ts, outDir),
    jsx: ts.JsxEmit.ReactJSX,
  };
  const program = ts.createProgram({
    rootNames: [
      path.join(root, "src/vite-env.d.ts"),
      path.join(root, "src/App.tsx"),
    ],
    options,
  });
  const diagnostics = ts.getPreEmitDiagnostics(program)
    .concat(program.emit().diagnostics)
    .filter((item) => item.category === ts.DiagnosticCategory.Error);
  assert.equal(
    diagnostics.length,
    0,
    diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n")).join("\n"),
  );

  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  const packageNames = [
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
  ];
  assert.equal(packageNames.some((name) => name.startsWith("@tauri-apps/")), false);
  assert.equal(Object.keys(pkg.scripts ?? {}).some((name) => name.startsWith("tauri")), false);
  assert.equal(fs.existsSync(path.join(root, "src-tauri")), false);

  const repositoryFactory = fs.readFileSync(
    path.join(root, "src/persistence/createRepository.ts"),
    "utf8",
  );
  assert.match(repositoryFactory, /XmlWorkspaceRepository/);
  assert.doesNotMatch(repositoryFactory, /isTauri|SqliteWorkspaceRepository/);

  const app = fs.readFileSync(path.join(root, "src/App.tsx"), "utf8");
  assert.match(app, /const saveWorkspace =/);
  assert.match(app, /const importWorkspace =/);
  assert.match(app, /importWorkspaceXmlFile/);
  console.log("Catalyst XML runtime cutover tests passed.");
} finally {
  fs.rmSync(outDir, { recursive: true, force: true });
}
