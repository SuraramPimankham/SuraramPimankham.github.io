const fs = require("fs");
const path = require("path");
const { saveDataUrl, deleteIfExists } = require("../utils/imageStorage");

const DATA_FILE = path.join(__dirname, "..", "data", "items.json");

function readItems() {
  const raw = fs.readFileSync(DATA_FILE, "utf8");
  return JSON.parse(raw);
}

function writeItems(items) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), "utf8");
}

function nextId(items) {
  if (items.length === 0) return 1;
  return Math.max(...items.map((i) => i.id)) + 1;
}

function applyImage(item, body, id) {
  if (body.clearImage) {
    deleteIfExists(item.image);
    item.image = "";
    return;
  }
  if (body.imageBase64) {
    deleteIfExists(item.image);
    item.image = saveDataUrl(body.imageBase64, id) || item.image || "";
  }
}

async function findAll() {
  return readItems();
}

async function findById(id) {
  return readItems().find((i) => i.id === id) ?? null;
}

async function create(body) {
  const items = readItems();
  const id = nextId(items);
  const item = {
    id,
    name: body.name.trim(),
    description: typeof body.description === "string" ? body.description.trim() : "",
    image: "",
  };
  applyImage(item, body, id);
  items.push(item);
  writeItems(items);
  return item;
}

async function update(id, body) {
  const items = readItems();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;

  if (body.name !== undefined) items[index].name = body.name.trim();
  if (body.description !== undefined) {
    items[index].description =
      typeof body.description === "string" ? body.description.trim() : "";
  }
  applyImage(items[index], body, id);
  writeItems(items);
  return items[index];
}

async function remove(id) {
  const items = readItems();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;

  const removed = items.splice(index, 1)[0];
  deleteIfExists(removed.image);
  writeItems(items);
  return removed;
}

module.exports = { findAll, findById, create, update, remove };
