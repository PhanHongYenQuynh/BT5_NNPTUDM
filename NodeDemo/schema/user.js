var mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const schema = new mongoose.Schema({
  email: String,
  userName: String,
  password: String,
  role: {
    type: String,
    enum: ["user", "admin"], // Define the possible roles
    default: "user", // Set a default role if not provided
  },
});

schema.pre("save", function () {
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
  //bug sinh ra khi change password
});

module.exports = mongoose.model('user', schema);;

