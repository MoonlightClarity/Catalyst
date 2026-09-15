import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export const statePath = path.resolve("license-audit-baseline.json");
const schemaVersion = 1;

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, canonicalize(value[key])]),
  );
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}
function policyHash() {
  const files = [
    "scripts/check-licenses.mjs",
    "scripts/check-npm-licenses.mjs",
    "scripts/check-cargo-licenses.mjs",
    "scripts/license-policy.mjs",
    "scripts/license-audit-state.mjs",
  ];
  const text = files
    .filter((filePath) => fs.existsSync(filePath))
    .map((filePath) => `${filePath}\n${fs.readFileSync(filePath, "utf8")}`)
    .join("\n---\n");
  return sha256(text);
}

function npmFingerprint() {
  const manifest = readJson("package.json");
  const lock = readJson("package-lock.json");
  const rootDependencies = {
    dependencies: manifest.dependencies ?? {},
    devDependencies: manifest.devDependencies ?? {},
    optionalDependencies: manifest.optionalDependencies ?? {},
    peerDependencies: manifest.peerDependencies ?? {},
    overrides: manifest.overrides ?? {},
  };
  const normalizedLock = structuredClone(lock);
  delete normalizedLock.name;
  delete normalizedLock.version;
  if (normalizedLock.packages?.[""]) {
    delete normalizedLock.packages[""].name;
    delete normalizedLock.packages[""].version;
  }

  return sha256(
    JSON.stringify(
      canonicalize({
        policy: policyHash(),
        rootDependencies,
        lock: normalizedLock,
      }),
    ),
  );
}

function cargoDependencySections(text) {
  const kept = [];
  let keep = false;
  for (const line of text.replace(/\r\n/g, "\n").split("\n")) {
    const header = line.match(/^\s*\[([^\]]+)\]\s*(?:#.*)?$/);
    if (header) {
      const section = header[1].trim();
      keep = /(?:^|\.)(?:dependencies|dev-dependencies|build-dependencies)$/i.test(section);
      if (keep) kept.push(`[${section}]`);
      continue;
    }
    if (keep) {
      const normalized = line.trim();
      if (normalized && !normalized.startsWith("#")) kept.push(normalized);
    }
  }
  return kept.join("\n");
}

function normalizeCargoLock(text) {
  const normalized = text.replace(/\r\n/g, "\n");
  return normalized
    .split(/(?=^\[\[package\]\]\s*$)/m)
    .map((block) => {
      if (!/^name\s*=\s*"catalyst"\s*$/m.test(block)) return block;
      return block.replace(/^version\s*=\s*"[^"]+"\s*$/m, 'version = "<app-version>"');
    })
    .join("");
}
function cargoFingerprint() {
  if (!fs.existsSync("src-tauri/Cargo.toml") || !fs.existsSync("src-tauri/Cargo.lock")) {
    return null;
  }
  const manifest = fs.readFileSync("src-tauri/Cargo.toml", "utf8");
  const lock = fs.readFileSync("src-tauri/Cargo.lock", "utf8");
  return sha256(
    JSON.stringify(
      canonicalize({
        policy: policyHash(),
        manifest: cargoDependencySections(manifest),
        lock: normalizeCargoLock(lock),
      }),
    ),
  );
}

function loadState() {
  if (!fs.existsSync(statePath)) {
    return { schemaVersion, ecosystems: {} };
  }
  try {
    const state = readJson(statePath);
    if (state.schemaVersion !== schemaVersion || !state.ecosystems) {
      return { schemaVersion, ecosystems: {} };
    }
    return state;
  } catch {
    return { schemaVersion, ecosystems: {} };
  }
}
export function getLicenseAuditStatus() {
  const state = loadState();
  const fingerprints = {
    npm: npmFingerprint(),
    cargo: cargoFingerprint(),
  };
  return {
    state,
    fingerprints,
    npmValidated: state.ecosystems.npm?.fingerprint === fingerprints.npm,
    cargoPresent: fingerprints.cargo !== null,
    cargoValidated:
      fingerprints.cargo !== null
      && state.ecosystems.cargo?.fingerprint === fingerprints.cargo,
  };
}

export function recordValidated(ecosystems, fingerprints) {
  const state = loadState();
  for (const ecosystem of ecosystems) {
    state.ecosystems[ecosystem] = {
      fingerprint: fingerprints[ecosystem],
      validatedAt: new Date().toISOString(),
    };
  }
  fs.writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}
