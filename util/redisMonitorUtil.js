const redis = require("redis");
const util = require("util");
const moment = require("moment");

initRedis = async (host, port, password) => {
  return new Promise((resolve, reject) => {
    let client = redis.createClient({
      host: host,
      port: port,
      password: password,
    });

    client.on("error", (error) => {
      console.log("error in redis connection");
      reject(error);
    });

    client.on("ready", () => {
      console.log("redis server is connected successfully.");
      resolve(client);
    });
  });
};

new_request = async (host, port, password, charset = "utf8") => {
  let redis_rst = {};

  try {
    let start = moment.now();
    let client = await initRedis(host, port, password);

    let info = client.server_info;
    let end = moment.now();
    info["get_time"] = (end - start) * 1000;

    redis_rst["success"] = 1;
    redis_rst["data"] = info;
  } catch (e) {
    redis_rst["success"] = 0;
    redis_rst["data"] = "error";
  }

  return redis_rst;
};

class RedisMonitor {
  ping = async (host, port, password, charset = "utf8") => {
    let redis_rst = {};
    if (host && port) {
      try {
        let client = await initRedis(host, port, password);
        client.info();

        redis_rst["success"] = 1;
        redis_rst["data"] = "Ping success!";
      } catch (e) {
        redis_rst["success"] = 0;
        redis_rst["data"] = "Ping error!";
      }
      return redis_rst;
    } else {
      return { success: 0, data: "Parameter error!" };
    }
  };

  get_info = async (host, port, password, charset = "utf8") => {
    let redis_rst = {};
    if (host && port) {
      redis_rst = await new_request(host, port, password, charset);
    } else {
      redis_rst = { success: 0, data: "Parameter error!" };
    }
    return redis_rst;
  };
}

module.exports = {
  RedisMonitor,
};
