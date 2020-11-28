const express = require("express");
const redisInfoRoutes = require("./api/routes/RedisInfo.route");
const router = express.Router();

router.get("/check-api", (req, res) => res.send("OK"));

router.use("/", redisInfoRoutes);

module.exports = router;
