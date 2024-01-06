var jwt = require('jsonwebtoken');
const configs = require('../helper/configs');
var modelUser = require('../models/user')
var responseData = require('../helper/responseData');
module.exports = {
    checkLogin:
        async function (req) {
            var result = {}
            var token = req.headers.authorization;

            if (token && token.startsWith("Bearer")) {
                token = token.split(" ")[1];
            } else {
                if (req.cookies.tokenJWT) {
                    token = req.cookies.tokenJWT;
                } else {
                    return result.err = "Vui long dang nhap";
                }
            }
            try {
                var userID = await jwt.verify(token, configs.SECRET_KEY);
                return userID.id;
            } catch (error) {
                return result.err = "Vui long dang nhap";
            }
        }, 
    checkRole: async function (req, res, next) {
        try {
            var user = await modelUser.getOne(req.userID);
            var role = user.role;
            console.log(`role: ${role}`);
            var DSRole = ['admin', 'publisher'];
            if (DSRole.includes(role)) {
                next();
            }
            else {
                responseData.responseReturn(res, 403, true, "ban khong du quyen");
            }
        } catch (error) {
            console.error(error)
        }
    }

}