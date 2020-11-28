const crypto = require("crypto");
const { encode } = require("punycode");

function md5_salt(s, salt = "redis-monitor") {
  if (s) return md5(s + salt);
  else return "";
}
function md5(s) {
  s = s.toString("utf-8");
  m = crypto.createHash("md5");
  m.update(new Buffer(s, "binary"));
  return m.digest("hex");
}

module.exports = {
  md5,
  md5_salt,
};
