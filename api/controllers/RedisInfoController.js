const { md5 } = require("../../util/stringUtil");
const RedisInfoModel = require("../models/RedisInfo.model");
const RedisMonitor = require("../../util/redisMonitorUtil");
const { standardResponse } = require("../../util/responseUtil");

/**
 * Get list for all redis server
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {JSON}
 */
const redisList = async (req, res) => {
  try {
    const serverInfo = await RedisInfoModel.findAll();
    if (!serverInfo.length) {
      return res.json(standardResponse(1, []));
    }
    return res.json(standardResponse(1, serverInfo));
  } catch (err) {
    return res.status(500).json({ msg: "Internal server error" });
  }
};

/**
 * Get info of saved redis server
 * @param {*} req : accepts md5 as key
 * @param {*} res
 * @param {*} next
 * @returns {JSON}
 */
const redisInfo = async (req, res) => {
  try {
    const query = req.query.md5;

    if (!query) {
      return res.status(503).json({ msg: "Bad Request!" });
    }
    const serverInfo = await RedisInfoModel.findOne({ where: { md5: query } });

    if (serverInfo) {
      return res.json(standardResponse(1, serverInfo));
    }

    return res.json(standardResponse(0, "Not Found!"));
  } catch (err) {
    return res.status(500).json({ msg: "Internal server error" });
  }
};

/**
 * Get stats of particular redis server
 * @param {*} req : accepts md5 as key
 * @param {*} res
 * @param {*} next
 * @returns {JSON}
 */
const monitor = async (req, res) => {
  let response = {};
  try {
    const query = req.query.md5;
    if (!query) {
      return res.status(503).json({ msg: "Bad Request!" });
    }
    let serverInfo = await RedisInfoModel.findOne({ where: { md5: query } });
    serverInfo = serverInfo ? serverInfo.toJSON() : {};

    if (serverInfo) {
      const redisMonitor = new RedisMonitor();
      response = await redisMonitor.getRedisServerInfo(
        serverInfo.host,
        serverInfo.port,
        serverInfo.password
      );
    } else {
      response = standardResponse(0, "redis informations does not exist!");
    }
  } catch (err) {
    response = standardResponse(0, "error getting redis realtime information!");
  }
  return res.json(response);
};

/**
 * Check the status of redis server
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {JSON}
 */
const ping = async (req, res) => {
  let response = {};
  try {
    let { host, port, password } = req.query;
    port = !port ? 6379 : port;

    const redisMonitor = new RedisMonitor();

    response = await redisMonitor.ping(host, port, password);
  } catch (e) {
    response = { success: 0, data: "ping error!" };
  }
  return res.json(response);
};

/**
 * Add a new redis server
 * @param {*} req : accepts md5 as key
 * @param {*} res
 * @param {*} next
 * @returns {JSON}
 */
const add = async (req, res) => {
  try {
    let response = {};
    let { host, port, password } = req.body;
    port = !port ? 6379 : port;

    if (!host) {
      return res.json(standardResponse(0, "Paramter missing!"));
    }

    //check if host and port is available
    const redisMonitor = new RedisMonitor();
    response = await redisMonitor.ping(host, port, password);

    if (!response) {
      return res.json(standardResponse(0, "Ping error!"));
    }

    let md5String = md5(host + port.toString());
    let redisInfo = await RedisInfoModel.findOne({ where: { md5: md5String } });

    if (redisInfo) {
      redisInfo.password = password;
    } else {
      redisInfo = await RedisInfoModel.create({
        md5: md5String,
        host: host,
        port: port,
        password: password,
      });
    }
    return res.json(standardResponse(1, redisInfo));
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error" });
  }
};

/**
 * Delete redis server from db
 * @param {*} req : accepts md5 as key
 * @param {*} res
 * @param {*} next
 * @returns {JSON}
 */
const del = async (req, res) => {
  try {
    const { md5 } = req.body;

    if (!md5) {
      return res.status(503).json({ msg: "Bad Request!" });
    }
    let serverInfo = await RedisInfoModel.findOne({ where: { md5: md5 } });
    serverInfo = serverInfo ? serverInfo.toJSON() : {};

    if (serverInfo) {
      await RedisInfoModel.destroy({
        where: {
          md5: md5,
        },
      });

      return res.json(standardResponse(1, "Success!"));
    } else {
      return res.json(standardResponse(0, "Not Found!"));
    }
  } catch (err) {
    return res.status(500).json({ msg: "Internal server error" });
  }
};

/**
 * Flush redis server database
 * @param {*} req : accepts md5 as key
 * @param {*} res
 * @param {*} next
 * @returns {JSON}
 */
const flushall = async (req, res) => {
  try {
    const { md5, db } = req.query;
    let response = {};
    if (!md5) {
      return res.status(503).json({ msg: "Bad Request!" });
    }
    let serverInfo = await RedisInfoModel.findOne({ where: { md5: md5 } });

    if (serverInfo) {
      const redisMonitor = new RedisMonitor();
      response = await redisMonitor.flushall(host, port, password, db);

      if (response) {
        return standardResponse(1, "Success!");
      } else {
        return standardResponse(0, "Flush db error!");
      }
    } else {
      return standardResponse(0, "Not Found!");
    }
  } catch (e) {
    return standardResponse(0, "Connect to redis error!");
  }
};

module.exports = {
  redisList,
  redisInfo,
  monitor,
  ping,
  add,
  del,
  flushall,
};
