import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const allowedReleaseTypes = new Set(['major', 'minor', 'patch']);
const releaseType = process.argv[2];
const isDryRun = process.argv.includes('--dry-run');

if (!allowedReleaseTypes.has(releaseType)) {
  throw new Error('Release type must be one of: major, minor, patch.');
}

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packagePath = path.join(workspaceRoot, 'projects/ms-ui/package.json');
const packageJson = JSON.parse(await readFile(packagePath, 'utf8'));
const versionMatch = /^(\d+)\.(\d+)\.(\d+)$/.exec(packageJson.version);

if (!versionMatch) {
  throw new Error(`Expected a semantic version in ${packagePath}.`);
}

let [, major, minor, patch] = versionMatch.map(Number);

if (releaseType === 'major') {
  major += 1;
  minor = 0;
  patch = 0;
} else if (releaseType === 'minor') {
  minor += 1;
  patch = 0;
} else {
  patch += 1;
}

const nextVersion = `${major}.${minor}.${patch}`;

if (!isDryRun) {
  packageJson.version = nextVersion;
  await writeFile(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
}

console.log(`${packageJson.name}: ${versionMatch[0]} -> ${nextVersion}${isDryRun ? ' (dry run)' : ''}`);
