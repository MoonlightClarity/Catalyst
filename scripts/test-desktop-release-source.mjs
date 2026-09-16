import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'catalyst-desktop-stage-test-'));
const output = path.join(temp, 'stage');
const expected = ['main.cjs', 'app-icon.png', 'package.json', path.join('dist', 'index.html')];

try {
  const run = spawnSync(process.execPath, ['scripts/stage-desktop-release.mjs', `--output=${output}`], {
    cwd: root,
    encoding: 'utf8',
  });
  if (run.status !== 0) throw new Error(run.stderr || run.stdout || 'staging generator failed');
  for (const relative of expected) {
    if (!fs.existsSync(path.join(output, relative))) throw new Error(`missing staged file: ${relative}`);
  }
  const rootPackage = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const stagedPackage = JSON.parse(fs.readFileSync(path.join(output, 'package.json'), 'utf8'));
  if (stagedPackage.version !== rootPackage.version) throw new Error('staged version does not match root package');
  const artifact = `Catalyst-${rootPackage.version}-Windows.exe`;
  if (stagedPackage.build?.win?.artifactName !== artifact) throw new Error('staged artifact name is not version synchronized');
  console.log('desktop release source test: PASS');
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
