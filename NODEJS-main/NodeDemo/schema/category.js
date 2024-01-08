var mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: String,
    order: Number,
    isDelete: { type: Boolean, default: false },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("category", schema);
