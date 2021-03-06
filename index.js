require("dotenv").config();
const path = require("path");
const config = require("./config");
const environment = process.env.NODE_ENV;
const { app, express } = require("./config/express");
const port = process.env.PORT;

const dbService = require("./api/services/db.service");
const DB = dbService(environment, config.migrate).start();

app.use("/static", express.static(path.join(__dirname, "app", "static")));
app.use(
  "/static/dist",
  express.static(path.join(__dirname, "app", "static", "dist"))
);
app.use("/templates", express.static(path.join(__dirname, "app", "templates")));
app.use("/favicon.ico", express.static("favicon.ico"));
app.get("/*", (req, res) => {
  return res.sendFile(
    path.join(__dirname, "app", "templates", "index_page.html")
  );
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  return DB;
});

module.exports = app;
