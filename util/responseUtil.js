function standard_response(success, data) {
  rst = {};
  rst["success"] = success;
  rst["data"] = data;
  return rst;
}

module.exports = {
  standard_response,
};
