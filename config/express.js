const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const express = require("express");
const bodyParser = require("body-parser");
const routes = require("../index.route");

const app = express();
app.use("/static", express.static(path.join(__dirname, "../app/", "static")));
app.use("/", express.static(path.join(__dirname, "../app/", "templates")));
app.use("/ui", express.static(path.join(__dirname, "../app/", "static")));
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

module.exports = { app, express };
