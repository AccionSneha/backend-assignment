const path = require("path");
const config = require("./config");
const environment = process.env.NODE_ENV;
const app = require("./config/express");
const port = process.env.PORT || config.port;

console.log(path.join(__dirname, "templates", "index_page.html"));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "templates", "index_page.html"));
  //__dirname : It will resolve to your project folder.
});
const dbService = require("./api/services/db.service");
const DB = dbService(environment, config.migrate).start();

app.listen(port, () => {
  console.log(`Server listening on port ${port} in ${environment} mode`);
  return DB;
});

module.exports = app;
