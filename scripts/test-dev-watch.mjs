import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const config = fs.readFileSync(path.join(process.cwd(), "vite.config.ts"), "utf8");

for (const ignored of [
  "**/src-tauri/**",
  "**/tmp/**",
  "**/.catalyst-backups/**",
  "**/.tmp*/**",
  "**/.tmp_*",
]) {
  assert.ok(config.includes(ignored), `Vite dev watch must ignore ${ignored}`);
}

console.log("Catalyst dev-watch isolation tests passed.");
