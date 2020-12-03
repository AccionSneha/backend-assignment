const redis = require("redis");
const { moment } = require("./momentUtil");
const { standardResponse } = require("./responseUtil");

/**
 * Initialises redis instance for provided configuraton
 * @param {*} host : redis host
 * @param {*} port : redis port
 * @param {*} password : password if any
 */
const initRedis = async (host, port, password) => {
  console.log(host, port, password);

  return new Promise((resolve, reject) => {
    let client = redis.createClient({
      host: host,
      port: port,
      // no_ready_check: true,
      auth_pass: password,
    });

    client.on("error", (error) => {
      console.log("error in redis connection", error);
      reject(error);
    });

    client.on("ready", () => {
      console.log("redis server is connected successfully.");
      resolve(client);
    });
  });
};

/**
 * Initializes the redis instance and gets server information.
 * @param {*} host : redis host
 * @param {*} port : redis port
 * @param {*} password : password if any
 */
const newRedisRequest = async (host, port, password) => {
  let redisResponse = {};

  try {
    let start = moment.now();
    let client = await initRedis(host, port, password);

    let serverInfo = client.server_info;
    let end = moment.now();
    serverInfo["get_time"] = end - start;

    redisResponse = standardResponse(1, serverInfo);
  } catch (e) {
    redisResponse = standardResponse(0, "error");
  }

  return redisResponse;
};

class RedisMonitor {
  /**
   * Ping the redis server on requested host and port.
   * @param {*} host : redis host
   * @param {*} port : redis port
   * @param {*} password : server password if any
   */
  ping = async (host, port, password) => {
    try {
      if (!host && !port) {
        return standardResponse(0, "Parameter error!");
      }

      let redisResponse = {};
      let client = await initRedis(host, port, password);

      if (client.info()) {
        redisResponse = standardResponse(1, "Ping success!");
      } else {
        redisResponse = standardResponse(0, "Ping error!");
      }
    } catch (e) {
      redisResponse = standardResponse(0, "Ping error!");
    }
    return redisResponse;
  };

  /**
   * Get redis server info.
   * @param {*} host : redis host
   * @param {*} port : redis port
   * @param {*} password : server password if any
   */
  getRedisServerInfo = async (host, port, password) => {
    let redisResponse = {};
    if (host && port) {
      redisResponse = await newRedisRequest(host, port, password);
    } else {
      redisResponse = standardResponse(0, "Parameter error!");
    }
    return redisResponse;
  };

  /**
   * Flush the redis database for provided db
   * @param {*} host : redis host
   * @param {*} port : redis port
   * @param {*} password: password if any
   * @param {*} db : db to flush
   */
  flushall = async (host, port, password, db) => {
    let client = redis.createClient({
      host: host,
      port: port,
      password: password,
      db: db,
    });
    return client.flushdb();
  };
}

module.exports = RedisMonitor;
