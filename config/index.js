// require and configure dotenv, will load vars in .env in PROCESS.ENV
require("dotenv").config();

const config = {
  migrate: false,
  port: process.env.PORT,
};

module.exports = config;
