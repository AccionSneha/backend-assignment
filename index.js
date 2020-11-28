const config = require("./config");
const environment = process.env.NODE_ENV;

const app = require("./config/express");
const port = process.env.PORT || config.port;

// if (environment != "development") {
const dbService = require("./api/services/db.service");
const DB = dbService(environment, config.migrate).start();
// }

app.listen(port, () => {
  console.log(`Server listening on port ${port} in ${environment} mode`);
  // if (environment != "development")
  return DB;
});

module.exports = app;
