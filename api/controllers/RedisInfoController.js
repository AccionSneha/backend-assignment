const redisMonitorUtil = require("../../util/redisMonitorUtil");
const { RedisMonitor } = require("../../util/redisMonitorUtil");
const redisUtil = require("../../util/redisUtil");
const responseUtil = require("../../util/responseUtil");
const { md5 } = require("../../util/stringUtil");
const RedisInfo = require("../models/RedisInfo.model");

/**
 * Get list for all redis server
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {JSON}
 */
const redis_list = async (req, res) => {
  try {
    const info = await RedisInfo.findAll();
    if (!info.length) {
      return res.json(responseUtil.standard_response(0, "Not Found!"));
    }
    return res.json(responseUtil.standard_response(1, info));
  } catch (err) {
    console.log(err);
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
const redis_info = async (req, res) => {
  try {
    const query = req.query.md5;

    if (!query) {
      return res.status(503).json({ msg: "Bad Request!" });
    }
    const info = await RedisInfo.findOne({ where: { md5: query } });

    if (info) {
      return res.json(responseUtil.standard_response(1, info));
    }

    return res.json(responseUtil.standard_response(0, "Not Found!"));
  } catch (err) {
    console.log(err);
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
const redis_monitor = async (req, res) => {
  let rst;
  try {
    const query = req.query.md5;
    if (!query) {
      return res.status(503).json({ msg: "Bad Request!" });
    }
    let info = await RedisInfo.findOne({ where: { md5: query } });
    info = info ? info.toJSON() : {};

    if (info) {
      const redisMonitor = new RedisMonitor();
      rst = await redisMonitor.get_info(
        (host = info.host),
        (port = info.port),
        (password = info.password)
      );
    } else {
      rst = responseUtil.standard_response(
        0,
        "redis informations does not exist!"
      );
    }
  } catch (err) {
    rst = responseUtil.standard_response(
      0,
      "error getting redis realtime information!"
    );
  }
  return res.json(rst);
};

/**
 * Check the status of redis server
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {JSON}
 */
const ping = async (req, res) => {
  let rst = {};
  try {
    let { host, port, password } = req.query;
    port = !port ? 6379 : port;

    const redisMonitor = new RedisMonitor();

    rst = await redisMonitor.ping(host, port, password);
  } catch (e) {
    rst = { success: 0, data: "ping error!" };
  }
  return res.json(rst);
};

/**
 * Add a new redis server
 * @param {*} req : accepts md5 as key
 * @param {*} res
 * @param {*} next
 * @returns {JSON}
 */
const add = async (req, res) => {
  let rst = {};
  let { host, port, password } = req.body;
  port = !port ? 6379 : port;

  if (!host) {
    return res.json(responseUtil.standard_response(0, "Paramter missing!"));
  }

  try {
    const redisMonitor = new RedisMonitor();
    rst = await redisMonitor.ping(host, port, password);

    if (!rst) {
      return res.json(responseUtil.standard_response(0, "Ping error!"));
    }
  } catch (e) {
    responseUtil.standard_response(0, "Ping error!");
  }

  let md5String = md5(host + port.toString());
  let redis_info = await RedisInfo.findOne({ where: { md5: md5String } });

  if (redis_info) {
    redis_info.password = password;
  } else {
    redis_info = await RedisInfo.create({
      md5: md5String,
      host: host,
      port: port,
      password: password,
    });
  }
  return res.json(responseUtil.standard_response(1, redis_info));
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
    const info = await RedisInfo.findOne({ where: { md5: md5 } });

    if (info && info.toJSON()) {
      await RedisInfo.destroy({
        where: {
          md5: md5,
        },
      });

      return res.json(
        responseUtil.standard_response(1, "Data deleted successfully.")
      );
    } else {
      return res.json(responseUtil.standard_response(0, "Not Found!"));
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

/**
 * Flush redis server
 * @param {*} req : accepts md5 as key
 * @param {*} res
 * @param {*} next
 * @returns {JSON}
 */
const flushall = async (req, res) => {
  try {
    const { md5, db } = req.query;
    let r = {};
    if (!md5) {
      return res.status(503).json({ msg: "Bad Request!" });
    }
    const redis_info = await RedisInfo.findOne({ where: { md5: md5 } });

    if (redis_info) {
      r = redisUtil.flushall(
        redis_info.host,
        redis_info.port,
        redis_info.password,
        db
      );
      if (r) {
        return responseUtil.standard_response(1, "Success!");
      }
      return responseUtil.standard_response(0, "Flush db error!");
    }
    return responseUtil.standard_response(0, "Not Found!");
  } catch (e) {
    return responseUtil.standard_response(0, "Connect to redis error!");
  }
};

module.exports = {
  redis_list,
  redis_info,
  redis_monitor,
  ping,
  add,
  del,
  flushall,
};
