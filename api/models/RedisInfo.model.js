const Sequelize = require("sequelize");
const sequelize = require("../../config/database");
const { dateTime } = require("../../util/momentUtil");
const tableName = "redis_monitor";

const RedisInfo = sequelize.define(
  "redis_monitor",
  {
    md5: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    host: {
      type: Sequelize.STRING,
    },
    port: {
      type: Sequelize.INTEGER,
      default: 6379,
    },
    password: {
      type: Sequelize.STRING,
    },
    add_time: {
      type: Sequelize.STRING,
      defaultValue: dateTime,
    },
  },
  { tableName }
);

RedisInfo.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  delete values.password;

  return values;
};

module.exports = RedisInfo;
