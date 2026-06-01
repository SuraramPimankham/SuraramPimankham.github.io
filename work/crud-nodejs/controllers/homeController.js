const fs = require("fs");
const path = require("path");
const { sendHtml } = require("../utils/httpHelpers");

const VIEW_FILE = path.join(__dirname, "..", "views", "index.html");

function index(req, res) {
  const html = fs.readFileSync(VIEW_FILE, "utf8");
  sendHtml(res, 200, html);
}

module.exports = { index };
