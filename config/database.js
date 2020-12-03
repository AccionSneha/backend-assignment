const Sequelize = require("sequelize");
const path = require("path");

let database;

database = new Sequelize({
  dialect: "sqlite",
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  storage: path.join(process.cwd(), "db", "redisInfo.sqlite"),
});

module.exports = database;
