import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const outputArg = process.argv.find((arg) => arg.startsWith('--output='));
const staging = outputArg
  ? path.resolve(root, outputArg.slice('--output='.length))
  : path.join(root, 'release', 'user-build');
const source = path.join(root, 'desktop-release');
const dist = path.join(root, 'dist');

function copyFile(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

if (!fs.existsSync(dist)) {
  console.error('desktop stage: FAIL — dist/ is missing; run npm run build first');
  process.exit(1);
}

const rootPackage = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const releasePackage = JSON.parse(fs.readFileSync(path.join(source, 'package.template.json'), 'utf8'));
releasePackage.version = rootPackage.version;
releasePackage.build.win.artifactName = `Catalyst-${rootPackage.version}-Windows.exe`;
fs.rmSync(staging, { recursive: true, force: true });
fs.mkdirSync(staging, { recursive: true });
copyFile(path.join(source, 'main.cjs'), path.join(staging, 'main.cjs'));
copyFile(path.join(root, 'app-icon.png'), path.join(staging, 'app-icon.png'));
fs.cpSync(dist, path.join(staging, 'dist'), { recursive: true });
fs.writeFileSync(
  path.join(staging, 'package.json'),
  `${JSON.stringify(releasePackage, null, 2)}\n`,
  'utf8',
);

console.log(`desktop stage: PASS — generated ${path.relative(root, staging)}`);
console.log('desktop stage: run npm install in the staging directory before packaging a clean checkout');
