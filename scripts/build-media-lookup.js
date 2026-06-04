#!/usr/bin/env node
/**
 * Builds a minimal id -> [url, alt] map from media.json for the Worker bundle.
 * Run: node scripts/build-media-lookup.js (also runs in prebuild).
 */

const fs = require("fs");
const path = require("path");

const MEDIA_JSON = path.join(__dirname, "..", "src", "data", "media.json");
const OUTPUT = path.join(__dirname, "..", "src", "data", "media-lookup.json");

function stripWpSizeSuffix(url) {
  return url.replace(/-\d+x\d+(\.[^./?]+)(?:\?.*)?$/i, "$1");
}

function stripScaledSuffix(url) {
  return url.replace(/-scaled(\.[^./?]+)$/i, "$1");
}

function toLocalMediaPath(url) {
  let path = url.replace(
    /https?:\/\/(?:www\.)?boguesgroup\.com\/wp-content\/uploads\//gi,
    "/media/"
  );
  path = path.replace(
    /https?:\/\/(?:www\.)?boguesgroup\.com\/media\//gi,
    "/media/"
  );
  path = stripWpSizeSuffix(path);
  path = stripScaledSuffix(path);
  return path;
}

function main() {
  const media = JSON.parse(fs.readFileSync(MEDIA_JSON, "utf8"));
  const lookup = {};

  for (const item of media) {
    if (!item?.id || !item?.source_url) continue;
    lookup[item.id] = [toLocalMediaPath(item.source_url), item.alt_text || ""];
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(lookup));
  const kb = Math.round(fs.statSync(OUTPUT).size / 1024);
  console.log(`[media-lookup] Wrote ${Object.keys(lookup).length} entries (${kb} KB)`);
}

main();
