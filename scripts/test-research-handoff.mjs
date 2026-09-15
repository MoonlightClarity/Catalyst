import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'docs/source-archive-standard.md',
  'docs/research/README.md',
  'docs/research/CURRENT_STATE.md',
  'docs/research/RESEARCH_SYNTHESIS.md',
  'docs/research/DECISION_LOG.md',
  'docs/research/PASS_LOG.md',
  'docs/research/SOURCE_INDEX.md',
  'docs/research/ENGINEERING_FINDINGS.md',
  'docs/research/NEXT_STEPS.md',
  'docs/research/PORTRAYAL_EXECUTION.md',
  'docs/research/PASS-2026-09-11-portrayal-architecture.md',
  'gather_research.ps1',
  'gather_source.ps1',
];

for (const relative of required) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) throw new Error(`Required source/research artifact missing: ${relative}`);
  if (fs.statSync(file).size === 0) throw new Error(`Required source/research artifact empty: ${relative}`);
}

const gather = fs.readFileSync(path.join(root, 'gather_source.ps1'), 'utf8');
if (!gather.includes('src\\persistence\\xmlRepository.ts') || !gather.includes('src\\persistence\\xml.ts')) {
  throw new Error('gather_source.ps1 must gate source creation on the active XML persistence sources.');
}
if (!gather.includes('legacy/tauri-shell')) {
  throw new Error('gather_source.ps1 must exclude the archived legacy Tauri shell from active-runtime handoffs.');
}
if (!gather.includes('docs\\research\\RESEARCH_SYNTHESIS.md')) {
  throw new Error('gather_source.ps1 must gate source creation on the integrated research handoff.');
}

const standard = fs.readFileSync(path.join(root, 'docs/source-archive-standard.md'), 'utf8');
for (const phrase of ['Research is part of Catalyst', 'canonical XML workspace persistence', 'docs/research/']) {
  if (!standard.includes(phrase)) throw new Error(`Source archive standard missing required principle: ${phrase}`);
}

console.log('Research/source-handoff contract tests passed.');
