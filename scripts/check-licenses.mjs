import { spawnSync } from "node:child_process";
import path from "node:path";
import {
  getLicenseAuditStatus,
  recordValidated,
} from "./license-audit-state.mjs";

const force = process.argv.includes("--full") || process.argv.includes("--force");
const status = getLicenseAuditStatus();
const scans = [
  {
    ecosystem: "npm",
    validated: status.npmValidated,
    script: "scripts/check-npm-licenses.mjs",
  },
];
if (status.cargoPresent) {
  scans.push({
    ecosystem: "cargo",
    validated: status.cargoValidated,
    script: "scripts/check-cargo-licenses.mjs",
  });
} else {
  console.log("Cargo audit not applicable: the active Catalyst runtime is XML/web and has no src-tauri Cargo manifest.");
}

let scanned = 0;
let reused = 0;

function runScanner(scan) {
  console.log(`\nAuditing ${scan.ecosystem} dependency licenses...`);
  const result = spawnSync(process.execPath, [path.resolve(scan.script)], {
    cwd: process.cwd(),
    stdio: "inherit",
  });
  if (result.error) {
    console.error(result.error.message);
    process.exit(2);
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 2);
  }

  recordValidated([scan.ecosystem], status.fingerprints);
  scanned += 1;
}

for (const scan of scans) {
  if (!force && scan.validated) {
    console.log(
      `Reusing validated ${scan.ecosystem} license fingerprint; dependencies and audit policy are unchanged.`,
    );
    reused += 1;
    continue;
  }
  runScanner(scan);
}

console.log("");
if (force) {
  console.log(`Full license audit passed for ${scanned} dependency ecosystems.`);
} else if (scanned === 0) {
  console.log(`License audit passed using ${reused} unchanged validated fingerprints.`);
} else {
  console.log(
    `License audit passed: ${scanned} ecosystem(s) scanned, ${reused} unchanged fingerprint(s) reused.`,
  );
}
