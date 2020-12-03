/**
 * This returns the response from the api.
 * @param {*} success
 * @param {*} data
 * @returns {JSON} :returns 1:success 0:failure
 */
const standardResponse = (success, data) => {
  rst = {};
  rst["success"] = success;
  rst["data"] = data;
  return rst;
};

module.exports = {
  standardResponse,
};
