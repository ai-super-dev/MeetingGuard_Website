// Runs after `next build` (npm "postbuild"). On Windows, Next's static export
// writes the per-segment prefetch files into nested folders
// (privacy-policy/__next.!KGVuKQ/privacy-policy/__PAGE__.txt) because it only
// turns "/" into "." and Windows paths use "\". The browser asks for the flat
// name (privacy-policy/__next.!KGVuKQ.privacy-policy.__PAGE__.txt), so every
// link prefetch 404s. This moves each nested file to its flat name; on Linux
// builds there is nothing to move.
import { readdir, rename, rm } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const out = join(process.cwd(), "out");

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)])))).flat();
}

let moved = 0;
for (const entry of await readdir(out, { withFileTypes: true, recursive: true })) {
  // a nested segment folder: a directory named "__next.<something>"
  if (!entry.isDirectory() || !entry.name.startsWith("__next.")) continue;
  const segDir = join(entry.parentPath, entry.name);
  for (const file of await walk(segDir)) {
    const flat = `${entry.name}.${relative(segDir, file).split(sep).join(".")}`;
    await rename(file, join(entry.parentPath, flat));
    moved++;
  }
  await rm(segDir, { recursive: true, force: true });
}
console.log(`fix-segment-files: moved ${moved} prefetch files to their flat names`);
