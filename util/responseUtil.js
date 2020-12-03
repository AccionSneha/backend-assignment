/**
 * This function acts as generic response from the api.
 * @param {*} success
 * @param {*} data
 * @returns {JSON} :returns 1:success 0:failure
 */
const standardResponse = (success, data) => {
  let response = {};
  response["success"] = success;
  response["data"] = data;
  return response;
};

module.exports = {
  standardResponse,
};
