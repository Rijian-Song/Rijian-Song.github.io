const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const mime = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};
for (const [port, root] of [
  [4100, process.env.BASELINE_DIR || "../baseline-site"],
  [4101, "_site"],
]) {
  const base = path.resolve(root);
  http
    .createServer((req, res) => {
      let file = path.resolve(base, "." + decodeURIComponent(new URL(req.url, "http://localhost").pathname));
      if (!file.startsWith(base + path.sep) && file !== base) {
        res.writeHead(403).end();
        return;
      }
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
      if (!fs.existsSync(file)) {
        res.writeHead(404).end();
        return;
      }
      res.setHeader("Content-Type", mime[path.extname(file)] || "application/octet-stream");
      fs.createReadStream(file).pipe(res);
    })
    .listen(port, "127.0.0.1");
}
