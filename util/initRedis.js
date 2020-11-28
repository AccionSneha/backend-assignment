const redis = require("redis");

const client = redis.createClient();

client.on("connect", () => {
  console.log("Redis server connected!");
});

client.on("error", (error) => {
  console.error("Error connecting redis server.", error);
});

client.on("end", () => {
  console.error("Redis server connection closed.");
});

process.on("SIGINT", () => {
  client.quit();
});

module.exports = client;
