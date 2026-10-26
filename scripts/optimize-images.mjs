// Runs after `next build` (npm "postbuild"). For every PNG/JPEG that next/image
// references in the static export, writes two WebP sizes next to it:
// name.w640.webp and name.w1280.webp (never larger than the original).
// src/lib/image-loader.ts points the srcset at these files.
import { readdir } from "node:fs/promises";
import { join } from "node:path";

const dir = join(process.cwd(), "out", "_next", "static", "media");
let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.error("optimize-images: sharp is not installed; run `npm install` before building.");
  process.exit(1);
}

const files = (await readdir(dir).catch(() => [])).filter((f) => /\.(png|jpe?g)$/i.test(f));
let count = 0;
for (const f of files) {
  for (const w of [640, 1280]) {
    const outFile = join(dir, f.replace(/\.(png|jpe?g)$/i, `.w${w}.webp`));
    await sharp(join(dir, f)).resize({ width: w, withoutEnlargement: true }).webp({ quality: 82, alphaQuality: 90 }).toFile(outFile);
    count++;
  }
}
console.log(`optimize-images: wrote ${count} WebP files for ${files.length} images`);
