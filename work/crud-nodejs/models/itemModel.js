const jsonStore = require("./itemModelJson");
const dbStore = require("./itemModelDb");

let store = jsonStore;
let mode = "json";

async function initStore() {
  try {
    await dbStore.ensureReady();
    store = dbStore;
    mode = "supabase";
    console.log("Storage: Supabase PostgreSQL");
  } catch (err) {
    store = jsonStore;
    mode = "json";
    console.warn("Supabase unavailable — using data/items.json");
    console.warn(err.message);
  }
}

function getMode() {
  return mode;
}

async function findAll() {
  return store.findAll();
}

async function findById(id) {
  return store.findById(id);
}

async function create(body) {
  return store.create(body);
}

async function update(id, body) {
  return store.update(id, body);
}

async function remove(id) {
  return store.remove(id);
}

module.exports = {
  initStore,
  getMode,
  findAll,
  findById,
  create,
  update,
  remove,
};
