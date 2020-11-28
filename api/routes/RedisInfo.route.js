const express = require("express");
const RedisInfoController = require("../controllers/RedisInfoController");
const router = express.Router();

//get redis list
router.route("/redis_list").get(RedisInfoController.redis_list);

//get redis info
router.route("/redis_info").get(RedisInfoController.redis_info);

//get redis monitor
router.route("/redis_monitor").get(RedisInfoController.redis_monitor);

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
