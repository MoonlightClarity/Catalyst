import assert from "node:assert/strict";
import { requiresBlockedFamily } from "./license-policy.mjs";

const allowed = [
  "MIT",
  "Apache-2.0",
  "MIT OR LGPL-2.1-or-later",
  "MIT OR Apache-2.0 OR LGPL-2.1-or-later",
  "(MIT OR GPL-3.0-only) AND Apache-2.0",
  "BSD-3-Clause AND MIT",
];

const blocked = [
  "GPL-3.0-only",
  "LGPL-2.1-or-later",
  "AGPL-3.0-only",
  "MIT AND GPL-3.0-only",
  "GPL-2.0-only OR LGPL-2.1-only",
  "(GPL-2.0-only OR AGPL-3.0-only) AND MIT",
  "GPL-2.0-only WITH Classpath-exception-2.0",
];

for (const expression of allowed) {
  assert.equal(requiresBlockedFamily(expression), false, `expected allowed: ${expression}`);
}

for (const expression of blocked) {
  assert.equal(requiresBlockedFamily(expression), true, `expected blocked: ${expression}`);
}

console.log("License policy expression tests passed.");
