import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const staging = path.join(root, 'release', 'user-build');
const required = [
  'package.json',
  'main.cjs',
  'app-icon.png',
  path.join('dist', 'index.html'),
];

function fail(message) {
  console.error(`release verify: FAIL — ${message}`);
  process.exitCode = 1;
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

if (!fs.existsSync(staging)) {
  fail('release/user-build does not exist');
  process.exit();
}
for (const relative of required) {
  const full = path.join(staging, relative);
  if (!fs.existsSync(full)) fail(`missing ${relative}`);
}

const rootPackage = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const releasePackage = JSON.parse(fs.readFileSync(path.join(staging, 'package.json'), 'utf8'));
if (rootPackage.version !== releasePackage.version) {
  fail(`version mismatch: root ${rootPackage.version}, release ${releasePackage.version}`);
}

const expectedFiles = ['main.cjs', 'dist/**/*', 'app-icon.png', 'package.json'];
const configuredFiles = releasePackage.build?.files;
if (JSON.stringify(configuredFiles) !== JSON.stringify(expectedFiles)) {
  fail(`unexpected electron-builder files whitelist: ${JSON.stringify(configuredFiles)}`);
}

const distRoot = path.join(staging, 'dist');
if (fs.existsSync(distRoot)) {
  const forbidden = walk(distRoot).filter((file) => {
    const rel = path.relative(distRoot, file).replaceAll('\\', '/');
    return /(^|\/)(test-files?|tests?|specs?)(\/|$)/i.test(rel)
      || /\.(test|spec)\.[^.]+$/i.test(rel)
      || /\.(map|ts|tsx)$/i.test(rel);
  });
  if (forbidden.length) fail(`forbidden release files: ${forbidden.join(', ')}`);
}
if (releasePackage.build?.asar !== true) fail('electron-builder asar must remain enabled');
if (releasePackage.build?.win?.target !== 'portable') fail('Windows target must remain portable');
if (releasePackage.build?.win?.artifactName !== `Catalyst-${rootPackage.version}-Windows.exe`) {
  fail('Windows artifactName is not synchronized with package version');
}

const mainPath = path.join(staging, 'main.cjs');
if (fs.existsSync(mainPath)) {
  const main = fs.readFileSync(mainPath, 'utf8');
  const hardening = [
    ['contextIsolation: true', 'context isolation'],
    ['nodeIntegration: false', 'disabled node integration'],
    ['sandbox: true', 'renderer sandbox'],
    ["nextServer.listen(CATALYST_PORT, '127.0.0.1'", 'loopback-only server'],
  ];
  for (const [needle, label] of hardening) {
    if (!main.includes(needle)) fail(`missing ${label} safeguard in main.cjs`);
  }
}

if (!process.exitCode) {
  console.log(`release verify: PASS — Catalyst ${rootPackage.version} staging is clean and version-aligned`);
}