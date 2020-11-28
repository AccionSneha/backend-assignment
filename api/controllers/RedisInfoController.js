const { RedisMonitor } = require("../../util/redisMonitorUtil");
const responseUtil = require("../../util/responseUtil");
const { md5 } = require("../../util/stringUtil");
const RedisInfo = require("../models/RedisInfo.model");

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
    console.log("ERROR", err);
    rst = responseUtil.standard_response(
      0,
      "error getting redis realtime information!"
    );
  }
  return res.json(rst);
};

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

const add = async (req, res) => {
  let rst = {};
  let { host, port, password } = req.body;
  port = !port ? 6379 : port;

  if (!(host && port)) {
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

const del = async (req, res) => {
  // md5 = RequestUtil.get_parameter('md5', '')
  //   redis_info = RedisInfo.query.get(md5)
  //   if redis_info:
  //       redis_info.delete()
  //       return ResponseUtil.standard_response(1, 'Success!')
  //   return ResponseUtil.standard_response(0, 'Not Found!')
};

const flushall = async (req, res) => {
  try {
    const info = await RedisInfo.findAll();

    return res.status(200).json({ info });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Internal server error" });
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
