import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const staging = path.join(root, "release", "firefox-source");

const rootFiles = [
  "package.json",
  "package-lock.json",
  "index.html",
  "vite.config.ts",
  "tsconfig.json",
  "tsconfig.app.json",
  "tsconfig.node.json",
  "LICENSE.txt",
  "LICENSES.md",
  "README.md",
];

const sourceDirs = [
  "src",
  "public",
  path.join("targets", "firefox"),
];

const scriptFiles = [
  path.join("scripts", "stage-firefox-release.mjs"),
  path.join("scripts", "stage-firefox-source.mjs"),
  path.join("scripts", "package-firefox-source.ps1"),
  path.join("scripts", "verify-firefox-release.mjs"),
  path.join("scripts", "submit-firefox-amo.ps1"),
];

function requirePath(relative) {
  const full = path.join(root, relative);
  if (!fs.existsSync(full)) {
    throw new Error(`Required source path is missing: ${relative}`);
  }
  return full;
}

fs.rmSync(staging, { recursive: true, force: true });
fs.mkdirSync(staging, { recursive: true });

for (const relative of rootFiles) {
  const source = requirePath(relative);
  const target = path.join(staging, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

for (const relative of sourceDirs) {
  const source = requirePath(relative);
  const target = path.join(staging, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(source, target, { recursive: true });
}

for (const relative of scriptFiles) {
  const source = requirePath(relative);
  const target = path.join(staging, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

fs.copyFileSync(
  requirePath(path.join("targets", "firefox", "REVIEWER_BUILD.md")),
  path.join(staging, "MOZILLA_REVIEWER_BUILD.md"),
);

const forbidden = ["node_modules", "dist", ".git", ".catalyst-backups", ".chatgpt-backups"];
for (const name of forbidden) {
  if (fs.existsSync(path.join(staging, name))) {
    throw new Error(`Forbidden source-package directory was staged: ${name}`);
  }
}

console.log("firefox source stage: PASS — release/firefox-source is ready to archive");
