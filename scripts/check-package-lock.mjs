import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const packagePath = path.join(root, "package.json");
const lockPath = path.join(root, "package-lock.json");

function readJson(filePath, label) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`${label} could not be parsed: ${error.message}`);
  }
}

function normalizedDependencies(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)));
}

function assertEqual(label, actual, expected) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${label} does not match package.json. Run install.ps1 -UpdateLockfile intentionally to regenerate package-lock.json.`);
  }
}
const pkg = readJson(packagePath, "package.json");
const lock = readJson(lockPath, "package-lock.json");
const rootPackage = lock.packages?.[""];

if (!rootPackage) {
  throw new Error("package-lock.json is missing its root package entry. Run install.ps1 -UpdateLockfile intentionally to regenerate it.");
}
if (lock.name !== pkg.name || rootPackage.name !== pkg.name) {
  throw new Error("package-lock.json package name does not match package.json.");
}
if (lock.version !== pkg.version || rootPackage.version !== pkg.version) {
  throw new Error("package-lock.json package version does not match package.json.");
}

for (const field of ["dependencies", "devDependencies", "optionalDependencies"]) {
  assertEqual(
    `package-lock.json root ${field}`,
    normalizedDependencies(rootPackage[field]),
    normalizedDependencies(pkg[field]),
  );
}

console.log("Catalyst package/lockfile consistency check passed.");
