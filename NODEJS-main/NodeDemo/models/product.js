var SchemaProduct = require('../schema/product')
var SchemaProductCategory = require("../schema/productCategory");

module.exports = {
  getall: async function (query) {
    // Fetch all products with isDelete=false, sorted by order
    const products = await SchemaProduct.find({ isDelete: false })
      .sort({ order: 1 })
      .exec();
    return products;
  },
  getOne: function (id) {
    return SchemaProduct.findById(id);
  },
  getByName: function (name) {
    return SchemaProduct.findOne({ name: name }).exec();
  },
  
  createProduct: async function (product) {
    const newProduct = new SchemaProduct(product);
    return newProduct.save();
  },
  findAndUpdate: function (product) {
    return SchemaProduct.findOneAndUpdate({ _id: product.id }, product);
  },
  deleteById: async function (id) {
    try {
      const updatedProduct = await SchemaProduct.findOneAndUpdate(
        { _id: id },
        { $set: { isDelete: true } },
        { new: true }
      );

      return updatedProduct;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  findByIdAndUpdate: async function (productId, updateData) {
    try {
      const updatedProduct = await SchemaProduct.findByIdAndUpdate(
        productId,
        updateData,
        { new: true }
      );

      return updatedProduct;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};