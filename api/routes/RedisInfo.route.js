const express = require("express");
const RedisInfoController = require("../controllers/RedisInfoController");
const router = express.Router();

//get redis list
router.route("/redis_list").get(RedisInfoController.redisList);

//get redis info
router.route("/redis_info").get(RedisInfoController.redisInfo);

//get redis monitor
router.route("/redis_monitor").get(RedisInfoController.monitor);

//get ping
router.route("/ping").get(RedisInfoController.ping);

//add ip
router.route("/add").post(RedisInfoController.add);

//delete ip
router.route("/del").post(RedisInfoController.del);

//flush all
router
  .route("/redis/flushall")
  .get(RedisInfoController.flushall)
  .post(RedisInfoController.flushall);

module.exports = router;
