const cors = require("cors");
const http = require("http");
const helmet = require("helmet");
const express = require("express");
const bodyParser = require("body-parser");
const routes = require("../index.route");

const app = express();

app.use("/static", express.static("static"));
app.use("/", express.static("templates"));
app.use("/favicon.ico", express.static("favicon.ico"));
app.use(cors());

app.use(
  helmet({
    dnsPrefetchControl: false,
    frameguard: false,
    ieNoOpen: false,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api", routes);

module.exports = app;
