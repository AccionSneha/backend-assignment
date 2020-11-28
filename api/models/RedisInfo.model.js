const Sequelize = require("sequelize");
const moment = require("moment");
const sequelize = require("../../config/database");

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
      defaultValue: moment.now(),
    },
    // createdAt: {
    //   type: Sequelize.DATE,
    // },
    // updatedAt: {
    //   type: Sequelize.DATE,
    // },
  },
  { tableName }
);

RedisInfo.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  delete values.password;

  return values;
};

module.exports = RedisInfo;
