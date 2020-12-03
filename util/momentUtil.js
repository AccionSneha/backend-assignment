const moment = require("moment");
const now = moment();

module.exports = {
  dateTime: now.format("YYYY-MM-DD H:mm:ss"),
  moment,
};
