import { execFileSync } from "node:child_process";

import { requiresBlockedFamily } from "./license-policy.mjs";
const problems = [];
const unknown = [];

let raw;
try {
  raw = execFileSync(
    "cargo",
    [
      "metadata",
      "--locked",
      "--format-version",
      "1",
      "--manifest-path",
      "src-tauri/Cargo.toml",
    ],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "inherit"] },
  );
} catch (error) {
  console.error(
    "Could not run Cargo license audit. Ensure Rust/Cargo is available and Cargo.lock matches the manifest.",
  );
  if (error instanceof Error && error.message) console.error(error.message);
  process.exit(2);
}

const metadata = JSON.parse(raw);
const packages = metadata.packages.filter((pkg) => pkg.name !== "catalyst");

for (const pkg of packages) {
  const license = String(pkg.license ?? "UNKNOWN");
  const key = `${pkg.name}@${pkg.version}`;
  if (requiresBlockedFamily(license)) problems.push([key, license]);
  if (license === "UNKNOWN") unknown.push([key, license]);
}

console.log(`Scanned ${packages.length} Rust crate versions from Cargo metadata.`);

if (problems.length) {
  console.error("\nBlocked GPL-family license identifiers found:");
  for (const [name, license] of problems) {
    console.error(`  [cargo] ${name}: ${license}`);
  }
  process.exit(1);
}

if (unknown.length) {
  console.warn("\nDependencies requiring manual license review:");
  for (const [name, license] of unknown) {
    console.warn(`  [cargo] ${name}: ${license}`);
  }
}

console.log("No unavoidable GPL, LGPL, or AGPL requirements were found in Cargo dependency license metadata.");

