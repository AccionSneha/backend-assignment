const { initRedis } = require("./redisMonitorUtil");

const flushall = async (host, port, password, db) => {
  let client = await initRedis(host, port, password, db);
  return client.flushdb();
};

const set_value = async (
  host,
  port,
  password,
  db,
  key,
  value,
  timeout = -1
) => {
  let client = await initRedis(host, port, password, db);
  return client.setex(key, value, timeout);
};

const del_key = async (host, port, password, db, key) => {
  let client = await initRedis(host, port, password, db);
  return client.delete(key);
};

module.exports = {
  flushall,
  set_value,
  del_key,
};
