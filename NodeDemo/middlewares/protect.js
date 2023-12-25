// protect.js
var jwt = require("jsonwebtoken");
const configs = require("../helper/configs");

module.exports = {
  checkLogin: async function (req, res, next) {
    var token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer")) {
      return res.status(401).json({ err: "Vui long dang nhap" });
    }

    token = token.split(" ")[1];
    try {
      var userID = await jwt.verify(token, configs.SECRET_KEY);
      req.userID = userID.id;
      next();
    } catch (error) {
      return res.status(401).json({ err: "Vui long dang nhap" });
    }
  },

  checkRole: function (roles) {
    return async function (req, res, next) {
      var user = await modelUser.getOne(req.userID);
      var role = user.role;

      if (roles.includes(role)) {
        next();
      } else {
        res.status(403).json({ err: "Ban khong du quyen" });
      }
    };
  },
};
