import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "app");
const mimeTypes = {
  ".css": "text/css",
  ".html": "text/html",
  ".ico": "image/x-icon",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
  ".webmanifest": "application/manifest+json",
  ".xml": "application/xml",
};

// Finds the file for a URL inside app/; settings.js falls back to the example file the deploy replaces.
function resolveFile(pathname) {
  const clean = path.normalize(decodeURIComponent(pathname));
  const file = path.join(appDir, clean.endsWith(path.sep) ? clean + "index.html" : clean);
  if (!file.startsWith(appDir)) return null;
  if (fs.existsSync(file) && fs.statSync(file).isFile()) return file;
  return pathname === "/settings.js" ? path.join(appDir, "settings.example.js") : null;
}

// Serves app/ files exactly as they are, so the browser import map in index.html resolves "@base/*" itself.
function serveApp(req, res, next) {
  const file = resolveFile(req.url.split("?")[0]);
  if (!file) return next();
  res.setHeader("Content-Type", `${mimeTypes[path.extname(file)] || "application/octet-stream"}; charset=utf-8`);
  res.setHeader("Cache-Control", "no-store");
  fs.createReadStream(file).pipe(res);
}

// Registers the raw app/ file server ahead of Vite's own transforms.
const appPlugin = {
  name: "app-static",
  configureServer(server) {
    server.middlewares.use(serveApp);
  },
};

// Test server: the app/ folder served at the root path, /janus forwarded like app-server.py does.
export default {
  root: appDir,
  publicDir: false,
  plugins: [appPlugin],
  optimizeDeps: { noDiscovery: true, include: [] },
  server: {
    host: process.env.HOST || "0.0.0.0",
    port: Number(process.env.PORT || 8075),
    open: "/",
    preTransformRequests: false,
    proxy: { "/janus": { target: `http://${process.env.JANUS_UPSTREAM || "127.0.0.1:8080"}`, ws: true } },
  },
};
