// Serves the static export in ./out the way Firebase Hosting does with
// cleanUrls: /pricing -> pricing.html, unknown paths -> 404.html.
// Usage: node scripts/serve-out.mjs [port]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = join(process.cwd(), "out");
const port = Number(process.argv[2] ?? 3000);
const types = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".svg": "image/svg+xml",
  ".ico": "image/x-icon", ".txt": "text/plain", ".xml": "application/xml", ".woff2": "font/woff2", ".vtt": "text/vtt", ".mp4": "video/mp4",
};
const isFile = (p) => stat(p).then((s) => s.isFile()).catch(() => false);

createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
  // join + the startsWith(root) check below keep requests inside ./out
  const safe = normalize(url);
  const candidates = [join(root, safe), join(root, `${safe}.html`), join(root, safe, "index.html")];
  for (const c of candidates) {
    if (c.startsWith(root) && (await isFile(c))) {
      res.writeHead(200, { "Content-Type": types[extname(c)] ?? "application/octet-stream" });
      return res.end(await readFile(c));
    }
  }
  res.writeHead(404, { "Content-Type": types[".html"] });
  res.end(await readFile(join(root, "404.html")).catch(() => "Not found"));
}).listen(port, () => console.log(`serving ./out on http://localhost:${port}`));
