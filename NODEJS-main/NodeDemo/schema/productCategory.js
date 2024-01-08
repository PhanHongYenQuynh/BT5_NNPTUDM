const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
});

module.exports = mongoose.model("productCategory", schema);
