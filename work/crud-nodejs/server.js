require("dotenv").config();

const http = require("http");
const { dispatch } = require("./routes");
const { sendJson } = require("./utils/httpHelpers");
const itemModel = require("./models/itemModel");

const PORT = process.env.PORT || 3000;

async function start() {
  await itemModel.initStore();

  const server = http.createServer((req, res) => {
    dispatch(req, res).catch((err) => {
      sendJson(res, 500, { error: err.message || "Internal server error" });
    });
  });

  server.listen(PORT, () => {
    console.log(`CRUD (Node.js MVC) http://localhost:${PORT}`);
    console.log(`Storage: ${itemModel.getMode()}`);
    console.log("UI: /  |  API: /items  |  Images: /uploads");
  });
}

start().catch((err) => {
  console.error("Failed to start:", err.message);
  process.exit(1);
});
