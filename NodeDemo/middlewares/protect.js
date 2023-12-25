var jwt = require("jsonwebtoken");
const configs = require("../helper/configs");
var modelUser = require("../models/user");
var responseData = require("../helper/responseData");
module.exports = {
  checkLogin: async function (req, res, next) {
    var result = {};
    var token = req.header("Authorization");
    if (!token) {
      result.err = "Vui long dang nhap";
    }
    if (token.startsWith("Bearer")) {
      token = token.split(" ")[1];
      try {
        var userID = await jwt.verify(token, configs.SECRET_KEY);
        result = userID.id;
      } catch (error) {
        result.err = "Vui long dang nhap";
      }
    } else {
      result.err = "Vui long dang nhap";
    }
    if (result.err) {
      responseData.responseReturn(res, 400, true, result.err);
      return;
    }
    console.log(`result ${result}`);
    req.userID = result;
    next();
  },
  checkRole: async function (req, res, next) {
    try {
      var user = await modelUser.getOne(req.userID);
      var role = user.role;
      console.log(`role: ${role}`);
      var DSRole = ["admins", "publisher"];
      if (DSRole.includes(role)) {
        next();
      } else {
        responseData.responseReturn(res, 403, true, "ban khong du quyen");
      }
    } catch (error) {
      console.error(error);
    }
  },
};
