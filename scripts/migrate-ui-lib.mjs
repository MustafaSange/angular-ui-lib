import { cp, mkdir, rm, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceLibrary = path.join(workspaceRoot, 'src/app/shared/ui-lib');
const sourceStyles = path.join(workspaceRoot, 'src/styles');
const targetRoot = path.join(workspaceRoot, 'projects/ms-ui/src');
const targetLibrary = path.join(targetRoot, 'lib');
const targetStyles = path.join(targetRoot, 'styles');

async function assertDirectory(directory) {
  const directoryStat = await stat(directory);

  if (!directoryStat.isDirectory()) {
    throw new Error(`Expected a directory at ${directory}`);
  }
}

async function replaceDirectory(source, target) {
  await rm(target, { recursive: true, force: true });
  await mkdir(path.dirname(target), { recursive: true });
  await cp(source, target, { recursive: true });
}

await Promise.all([assertDirectory(sourceLibrary), assertDirectory(sourceStyles)]);
await replaceDirectory(sourceLibrary, targetLibrary);
await replaceDirectory(sourceStyles, targetStyles);

console.log('Migrated UI library source and styles into projects/ms-ui/src.');
