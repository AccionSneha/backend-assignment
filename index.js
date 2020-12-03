require("dotenv").config();
const path = require("path");
const config = require("./config");
const environment = process.env.NODE_ENV;
const { app, express } = require("./config/express");
const port = process.env.PORT;

const dbService = require("./api/services/db.service");
const DB = dbService(environment, config.migrate).start();

process.env.PWD = process.cwd();

// console.log(path.join(process.env.PWD, "app", "static"));

app.use(express.static(path.join(process.env.PWD, "app")));
app.use("/static", express.static(path.join(process.env.PWD, "app", "static")));
app.use("/favicon.ico", express.static("favicon.ico"));
app.get("/", (req, res) => {
  return res.sendFile(
    path.join(process.env.PWD, "app", "templates", "index_page.html")
  );
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  return DB;
});

module.exports = app;
