import { file } from "bun";
import { join, normalize, extname } from "path";

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = join(import.meta.dir, "public");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    // API endpoint for server-side fancy roll or stats if wanted
    if (url.pathname === "/api/measure") {
      const level = Math.floor(Math.random() * 101); // 0 to 100
      return Response.json({
        level,
        timestamp: new Date().toISOString(),
      });
    }

    // Static files
    let pathname = url.pathname;
    if (pathname === "/" || pathname === "") {
      pathname = "/index.html";
    }

    const safePath = normalize(join(PUBLIC_DIR, pathname));
    if (!safePath.startsWith(PUBLIC_DIR)) {
      return new Response("Forbidden", { status: 403 });
    }

    const staticFile = file(safePath);
    const exists = await staticFile.exists();

    if (!exists) {
      return new Response("Not Found", { status: 404 });
    }

    const ext = extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    return new Response(staticFile, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-cache",
      },
    });
  },
});

console.log(`🚀 Fanculometro Giornaliero attivo su: http://localhost:${server.port}`);
