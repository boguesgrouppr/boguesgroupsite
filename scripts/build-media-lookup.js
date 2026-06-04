#!/usr/bin/env node
/**
 * Builds a minimal id -> [url, alt] map from media.json for the Worker bundle.
 * Run: node scripts/build-media-lookup.js (also runs in prebuild).
 */

const fs = require("fs");
const path = require("path");

const MEDIA_JSON = path.join(__dirname, "..", "src", "data", "media.json");
const OUTPUT = path.join(__dirname, "..", "src", "data", "media-lookup.json");

function rewriteMediaUrl(url) {
  return url.replace(
    /https?:\/\/(?:www\.)?boguesgroup\.com\/wp-content\/uploads\//g,
    "/media/"
  );
}

function main() {
  const media = JSON.parse(fs.readFileSync(MEDIA_JSON, "utf8"));
  const lookup = {};

  for (const item of media) {
    if (!item?.id || !item?.source_url) continue;
    lookup[item.id] = [rewriteMediaUrl(item.source_url), item.alt_text || ""];
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(lookup));
  const kb = Math.round(fs.statSync(OUTPUT).size / 1024);
  console.log(`[media-lookup] Wrote ${Object.keys(lookup).length} entries (${kb} KB)`);
}

main();
