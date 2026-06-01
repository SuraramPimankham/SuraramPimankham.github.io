const itemModel = require("../models/itemModel");
const { sendJson, parseBody } = require("../utils/httpHelpers");

async function getAll(req, res) {
  sendJson(res, 200, await itemModel.findAll());
}

async function getById(req, res, id) {
  const item = await itemModel.findById(id);
  if (!item) {
    sendJson(res, 404, { error: "Item not found" });
    return;
  }
  sendJson(res, 200, item);
}

async function create(req, res) {
  const body = await parseBody(req);
  if (!body.name || typeof body.name !== "string") {
    sendJson(res, 400, { error: "Field 'name' is required (string)" });
    return;
  }
  const item = await itemModel.create(body);
  sendJson(res, 201, item);
}

async function update(req, res, id) {
  const body = await parseBody(req);
  const existing = await itemModel.findById(id);
  if (!existing) {
    sendJson(res, 404, { error: "Item not found" });
    return;
  }
  if (body.name !== undefined) {
    if (typeof body.name !== "string" || !body.name.trim()) {
      sendJson(res, 400, { error: "Field 'name' must be a non-empty string" });
      return;
    }
  }
  const item = await itemModel.update(id, body);
  sendJson(res, 200, item);
}

async function remove(req, res, id) {
  const item = await itemModel.remove(id);
  if (!item) {
    sendJson(res, 404, { error: "Item not found" });
    return;
  }
  sendJson(res, 200, item);
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
