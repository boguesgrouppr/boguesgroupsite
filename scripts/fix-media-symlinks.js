#!/usr/bin/env node
/**
 * Creates non-scaled copies of WordPress "-scaled" images.
 * WordPress downloads full-res images with "-scaled" suffix, but content HTML
 * references the original filename without "-scaled". This script ensures both exist.
 *
 * Run: node scripts/fix-media-symlinks.js
 * Also runs automatically as part of prebuild.
 */

const fs = require("fs");
const path = require("path");

const MEDIA_DIR = path.join(__dirname, "..", "public", "media");

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, callback);
    } else {
      callback(fullPath, entry.name);
    }
  }
}

let copied = 0;

walkDir(MEDIA_DIR, (fullPath, filename) => {
  if (filename.includes("-scaled.")) {
    const nonScaled = filename.replace("-scaled.", ".");
    const nonScaledPath = path.join(path.dirname(fullPath), nonScaled);
    if (!fs.existsSync(nonScaledPath)) {
      fs.copyFileSync(fullPath, nonScaledPath);
      copied++;
    }
  }
});

if (copied > 0) {
  console.log(`[fix-media] Created ${copied} non-scaled copies from -scaled files`);
} else {
  console.log("[fix-media] All media files OK, no copies needed");
}
