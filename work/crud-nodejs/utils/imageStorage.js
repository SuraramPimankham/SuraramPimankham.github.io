const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const UPLOAD_DIR = path.join(__dirname, "..", "..", "..", "uploads");

function ensureDir() {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

function parseDataUrl(dataUrl) {
  const match = /^data:(image\/(\w+));base64,(.+)$/i.exec(String(dataUrl).trim());
  if (!match) return null;

  let ext = match[2].toLowerCase();
  if (ext === "jpeg") ext = "jpg";
  if (!["jpg", "png", "gif", "webp"].includes(ext)) return null;

  const buffer = Buffer.from(match[3], "base64");
  if (buffer.length > 2 * 1024 * 1024) return null;

  return { ext, buffer };
}

function saveDataUrl(dataUrl, itemId) {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return null;

  ensureDir();
  const name = `item-${itemId}-${crypto.randomBytes(4).toString("hex")}.${parsed.ext}`;
  fs.writeFileSync(path.join(UPLOAD_DIR, name), parsed.buffer);
  return `/uploads/${name}`;
}

function deleteIfExists(imagePath) {
  if (!imagePath || !String(imagePath).startsWith("/uploads/")) return;
  const full = path.join(UPLOAD_DIR, path.basename(imagePath));
  if (fs.existsSync(full)) fs.unlinkSync(full);
}

function resolveFilePath(urlPath) {
  if (!urlPath || !String(urlPath).startsWith("/uploads/")) return null;
  const full = path.join(UPLOAD_DIR, path.basename(urlPath));
  return fs.existsSync(full) ? full : null;
}

module.exports = {
  UPLOAD_DIR,
  saveDataUrl,
  deleteIfExists,
  resolveFilePath,
};
