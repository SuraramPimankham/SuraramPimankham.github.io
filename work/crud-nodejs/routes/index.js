const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const homeController = require("../controllers/homeController");
const itemsController = require("../controllers/itemsController");
const { sendJson, sendJs, sendBinary, sendOptions } = require("../utils/httpHelpers");
const { resolveFilePath } = require("../utils/imageStorage");

const SHARED_JS = path.join(__dirname, "..", "..", "crud-shared", "crud-ui.js");

const MIME = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

async function dispatch(req, res) {
  if (req.method === "OPTIONS") {
    sendOptions(res);
    return;
  }

  const port = process.env.PORT || 3000;
  const url = new URL(req.url, `http://localhost:${port}`);
  const pathname = url.pathname.replace(/\/+$/, "") || "/";

  if (pathname.startsWith("/uploads/")) {
    if (req.method === "GET") {
      const filePath = resolveFilePath(pathname);
      if (!filePath) {
        sendJson(res, 404, { error: "Not found" });
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      sendBinary(res, 200, fs.readFileSync(filePath), MIME[ext] || "application/octet-stream");
      return;
    }
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  if (pathname === "/" || pathname === "/index.html") {
    if (req.method === "GET") {
      homeController.index(req, res);
      return;
    }
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  if (pathname === "/crud-shared/crud-ui.js") {
    if (req.method === "GET") {
      sendJs(res, 200, fs.readFileSync(SHARED_JS, "utf8"));
      return;
    }
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  const match = pathname.match(/^\/items(?:\/(\d+))?$/);
  if (!match) {
    sendJson(res, 404, { error: "Not found" });
    return;
  }

  const idParam = match[1];

  try {
    if (req.method === "GET" && !idParam) {
      await itemsController.getAll(req, res);
      return;
    }

    if (req.method === "GET" && idParam) {
      await itemsController.getById(req, res, Number(idParam));
      return;
    }

    if (req.method === "POST" && !idParam) {
      await itemsController.create(req, res);
      return;
    }

    if (req.method === "PUT" && idParam) {
      await itemsController.update(req, res, Number(idParam));
      return;
    }

    if (req.method === "DELETE" && idParam) {
      await itemsController.remove(req, res, Number(idParam));
      return;
    }

    sendJson(res, 405, { error: "Method not allowed" });
  } catch (err) {
    sendJson(res, 500, { error: err.message || "Internal server error" });
  }
}

module.exports = { dispatch };
