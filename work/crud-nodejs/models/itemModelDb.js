const { saveDataUrl, deleteIfExists } = require("../utils/imageStorage");
const { pool, ensureSchema } = require("../utils/db");

function rowToItem(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description || "",
    image: row.image || "",
  };
}

async function applyImage(item, body, id, client) {
  const query = client ? client.query.bind(client) : pool.query.bind(pool);

  if (body.clearImage) {
    deleteIfExists(item.image);
    await query("UPDATE items SET image = '' WHERE id = $1", [id]);
    item.image = "";
    return;
  }
  if (body.imageBase64) {
    deleteIfExists(item.image);
    const imagePath = saveDataUrl(body.imageBase64, id);
    if (imagePath) {
      await query("UPDATE items SET image = $1 WHERE id = $2", [imagePath, id]);
      item.image = imagePath;
    }
  }
}

async function ensureReady() {
  await ensureSchema();
  await pool.query("SELECT 1");
}

async function findAll() {
  const { rows } = await pool.query(
    "SELECT id, name, description, image FROM items ORDER BY id"
  );
  return rows.map(rowToItem);
}

async function findById(id) {
  const { rows } = await pool.query(
    "SELECT id, name, description, image FROM items WHERE id = $1",
    [id]
  );
  return rows.length ? rowToItem(rows[0]) : null;
}

async function create(body) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `INSERT INTO items (name, description, image)
       VALUES ($1, $2, '')
       RETURNING id, name, description, image`,
      [body.name.trim(), typeof body.description === "string" ? body.description.trim() : ""]
    );
    const item = rowToItem(rows[0]);
    await applyImage(item, body, item.id, client);
    await client.query("COMMIT");
    return item;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function update(id, body) {
  const existing = await findById(id);
  if (!existing) return null;

  const name = body.name !== undefined ? body.name.trim() : existing.name;
  const description =
    body.description !== undefined
      ? typeof body.description === "string"
        ? body.description.trim()
        : ""
      : existing.description;

  let image = existing.image;
  if (body.clearImage) {
    deleteIfExists(image);
    image = "";
  } else if (body.imageBase64) {
    deleteIfExists(image);
    image = saveDataUrl(body.imageBase64, id) || image;
  }

  const { rows } = await pool.query(
    `UPDATE items SET name = $1, description = $2, image = $3
     WHERE id = $4
     RETURNING id, name, description, image`,
    [name, description, image, id]
  );
  return rows.length ? rowToItem(rows[0]) : null;
}

async function remove(id) {
  const existing = await findById(id);
  if (!existing) return null;

  deleteIfExists(existing.image);
  const { rows } = await pool.query(
    "DELETE FROM items WHERE id = $1 RETURNING id, name, description, image",
    [id]
  );
  return rows.length ? rowToItem(rows[0]) : null;
}

module.exports = {
  ensureReady,
  findAll,
  findById,
  create,
  update,
  remove,
};
