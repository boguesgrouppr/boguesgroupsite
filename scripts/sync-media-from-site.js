#!/usr/bin/env node


const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const LOOKUP = path.join(__dirname, "..", "src", "data", "media-lookup.json");
const PUBLIC_MEDIA = path.join(__dirname, "..", "public", "media");
const ORIGIN =
  process.env.MEDIA_SYNC_ORIGIN || "https://bogues-group.pages.dev";
const CONCURRENCY = 8;

function collectPaths() {
  const lookup = JSON.parse(fs.readFileSync(LOOKUP, "utf8"));
  const paths = new Set();
  for (const entry of Object.values(lookup)) {
    if (Array.isArray(entry) && entry[0]?.startsWith("/media/")) {
      paths.add(entry[0]);
    }
  }
  return [...paths].sort();
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    lib
      .get(url, { headers: { "User-Agent": "bogues-group-site-sync/1.0" } }, (res) => {
        if (
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          res.resume();
          fetchUrl(res.headers.location).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        const type = res.headers["content-type"] || "";
        if (type.includes("text/html")) {
          res.resume();
          reject(new Error("HTML response (not an image)"));
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });
}

function scaledVariant(mediaPath) {
  return mediaPath.replace(/(\.[^./]+)$/i, "-scaled$1");
}

async function downloadPath(mediaPath) {
  const dest = path.join(PUBLIC_MEDIA, mediaPath.replace(/^\/media\//, ""));
  if (fs.existsSync(dest)) {
    return "skip";
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });

  const uploadsPath = mediaPath.replace(/^\/media\//, "/wp-content/uploads/");
  const urls = [
    `${ORIGIN}${mediaPath}`,
    `${ORIGIN}${uploadsPath}`,
    `${ORIGIN}${scaledVariant(mediaPath)}`,
    `${ORIGIN}${scaledVariant(uploadsPath)}`,
  ];

  for (const url of urls) {
    try {
      const body = await fetchUrl(url);
      fs.writeFileSync(dest, body);
      return "ok";
    } catch {
      // try next URL
    }
  }
  return "fail";
}

async function runPool(items, worker) {
  let index = 0;
  const results = { ok: 0, skip: 0, fail: 0 };

  async function workerLoop() {
    while (index < items.length) {
      const i = index++;
      const status = await worker(items[i]);
      results[status]++;
      if ((results.ok + results.skip + results.fail) % 100 === 0) {
        const done = results.ok + results.skip + results.fail;
        console.log(`[sync-media] ${done}/${items.length}...`);
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, () => workerLoop())
  );
  return results;
}

async function main() {
  if (!fs.existsSync(LOOKUP)) {
    console.error("[sync-media] Run: node scripts/build-media-lookup.js first");
    process.exit(1);
  }

  const paths = collectPaths();
  console.log(`[sync-media] ${paths.length} paths from media-lookup.json`);

  const results = await runPool(paths, downloadPath);
  console.log(
    `[sync-media] Done: ${results.ok} downloaded, ${results.skip} already present, ${results.fail} failed`
  );

  if (results.fail > 0) {
    console.log("[sync-media] Tip: re-run after deploy or check filenames on production.");
  }
}

main().catch((err) => {
  console.error("[sync-media] Fatal:", err.message);
  process.exit(1);
});
