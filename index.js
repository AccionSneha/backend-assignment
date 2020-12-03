const path = require("path");
const config = require("./config");
const environment = process.env.NODE_ENV || "development";
const { app, express } = require("./config/express");
const port = process.env.PORT || config.port;
require("dotenv").config();

const dbService = require("./api/services/db.service");
const DB = dbService(environment, config.migrate).start();

app.use(express.static(path.join(__dirname, "app")));
app.use("/favicon.ico", express.static("favicon.ico"));
app.get("/ui", (req, res) => {
  return res.sendFile(
    path.join(__dirname, "app", "templates", "index_page.html")
  );
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  return DB;
});

module.exports = app;
