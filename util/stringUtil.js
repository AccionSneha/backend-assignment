const crypto = require("crypto");

/**
 * Converts the input to hex using md5 algo.
 * @param {*} s
 */
const md5 = (input) => {
  input = input.toString("utf-8");
  let inputHash = crypto.createHash("md5");
  inputHash.update(new Buffer(input, "binary"));
  return inputHash.digest("hex");
};

module.exports = {
  md5,
};
