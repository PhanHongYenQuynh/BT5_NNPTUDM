var mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: String,
    descritption: String,
    image: String,
    price: Number,
    isDelete: { type: Boolean, default: false },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("product", schema);
