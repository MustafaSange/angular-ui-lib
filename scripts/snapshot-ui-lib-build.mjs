import { cp, readFile, rm, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePackagePath = path.join(workspaceRoot, 'projects/ms-ui/package.json');
const latestBuildDirectory = path.join(workspaceRoot, 'dist/ms-ui');
const sourcePackage = JSON.parse(await readFile(sourcePackagePath, 'utf8'));

if (!/^\d+\.\d+\.\d+$/.test(sourcePackage.version)) {
  throw new Error(`Expected a semantic version in ${sourcePackagePath}.`);
}

const latestBuildStat = await stat(latestBuildDirectory);

if (!latestBuildStat.isDirectory()) {
  throw new Error(`Expected the completed library build at ${latestBuildDirectory}.`);
}

const builtPackagePath = path.join(latestBuildDirectory, 'package.json');
const builtPackage = JSON.parse(await readFile(builtPackagePath, 'utf8'));

if (builtPackage.name !== sourcePackage.name || builtPackage.version !== sourcePackage.version) {
  throw new Error('The completed library build does not match the source package name and version.');
}

const versionedBuildDirectory = path.join(
  workspaceRoot,
  'dist',
  `ms-ui-${sourcePackage.version}`,
);

await rm(versionedBuildDirectory, { recursive: true, force: true });
await cp(latestBuildDirectory, versionedBuildDirectory, { recursive: true });

console.log(`Created versioned library build at ${versionedBuildDirectory}.`);
