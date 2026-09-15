import fs from "node:fs";
import path from "node:path";

import { requiresBlockedFamily } from "./license-policy.mjs";
const problems = [];
const unknown = [];
const root = path.resolve("node_modules");

if (!fs.existsSync(root)) {
  console.error("node_modules not found. Run `npm install` first.");
  process.exit(2);
}

const packages = new Map();

function licenseText(pkg, dir) {
  if (typeof pkg.license === "string") return pkg.license;
  if (Array.isArray(pkg.licenses)) {
    const declared = pkg.licenses
      .map((item) => (typeof item === "string" ? item : item?.type))
      .filter(Boolean)
      .join(" OR ");
    if (declared) return declared;
  }
  for (const file of ["LICENSE", "LICENSE.md", "LICENSE.txt"]) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) continue;
    const text = fs.readFileSync(filePath, "utf8").slice(0, 4096);
    if (/^MIT License\b/i.test(text.trimStart())) return "MIT (packaged LICENSE)";
    if (/Apache License\s+Version 2\.0/i.test(text)) return "Apache-2.0 (packaged LICENSE)";
  }
  return "UNKNOWN";
}

function inspectPackage(dir) {
  const manifest = path.join(dir, "package.json");
  if (!fs.existsSync(manifest)) return;
  try {
    const pkg = JSON.parse(fs.readFileSync(manifest, "utf8"));
    if (!pkg.name || !pkg.version) return;
    const license = licenseText(pkg, dir);
    const key = `${pkg.name}@${pkg.version}`;
    if (packages.has(key)) return;
    packages.set(key, license);
    if (requiresBlockedFamily(license)) problems.push([key, license]);
    if (license === "UNKNOWN" || license === "SEE LICENSE IN LICENSE") {
      unknown.push([key, license]);
    }
  } catch {
    // npm itself will normally reject malformed installed manifests.
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("@")) {
      walk(full);
      continue;
    }
    inspectPackage(full);
    const nested = path.join(full, "node_modules");
    if (fs.existsSync(nested)) walk(nested);
  }
}

walk(root);
console.log(`Scanned ${packages.size} installed npm package versions.`);

if (problems.length) {
  console.error("\nBlocked GPL-family license identifiers found:");
  for (const [name, license] of problems) {
    console.error(`  [npm] ${name}: ${license}`);
  }
  process.exit(1);
}

if (unknown.length) {
  console.warn("\nDependencies requiring manual license review:");
  for (const [name, license] of unknown) {
    console.warn(`  [npm] ${name}: ${license}`);
  }
}

console.log("No GPL, LGPL, or AGPL requirements were found in npm dependency license evidence.");

