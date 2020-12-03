const Sequelize = require("sequelize");
const sequelize = require("../../config/database");
const moment = require("moment");

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
      defaultValue: () => {
        now = moment();
        return now.format("YYYY-MM-DD H:mm:ss");
      },
    },
  },
  { tableName }
);

RedisInfo.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = RedisInfo;
