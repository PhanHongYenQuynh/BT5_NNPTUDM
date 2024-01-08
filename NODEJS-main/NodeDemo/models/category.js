var SchemaCategory = require("../schema/category");
var SchemaProductCategory = require("../schema/productCategory");

module.exports = {
  getall: async function (query) {
    try {
      // Fetch all categories with isDelete=false, sorted by order
      const categories = await SchemaCategory.find({ isDelete: false })
        .sort({ order: 1 })
        .exec();

      // Populate products for each category
      const populatedCategories = await Promise.all(
        categories.map(async (category) => {
          const products = await SchemaProductCategory.find({
            categoryId: category._id,
          })
            .populate("productId", "name price")
            .exec();

          category.products = products.map(
            (productCategory) => productCategory.productId
          );
          return category;
        })
      );

      // Convert the format for the GET response
      const formattedCategories = populatedCategories.map((category) => ({
        name: category.name,
        order: category.order,
        products: category.products.map((product) => product._id),
      }));

      return formattedCategories;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getOne: function (id) {
    return SchemaCategory.findById(id);
  },
  getByName: function (name) {
    return SchemaCategory.findOne({ name: name }).exec();
  },
  //   createCategory: function (category) {
  //     return new SchemaCategory(category).save();
  //   },

  createCategory: async function (category) {
    try {
      // Extract products from the category object if provided
      const { product, ...categoryData } = category;

      // Create the category
      const newCategory = new SchemaCategory(categoryData);
      const savedCategory = await newCategory.save();

      // If products are provided, associate them with the category
      if (product && Array.isArray(product) && product.length > 0) {
        const productCategoryDocs = product.map((productId) => ({
          productId,
          categoryId: savedCategory._id,
        }));

        await SchemaProductCategory.create(productCategoryDocs);
      }

      return savedCategory;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  findAndUpdate: function (category) {
    return SchemaCategory.findOneAndUpdate({ _id: category.id }, category);
  },
  deleteById: async function (id) {
    try {
      const updatedCategory = await SchemaCategory.findOneAndUpdate(
        { _id: id },
        { $set: { isDelete: true } },
        { new: true }
      );

      return updatedCategory;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  findByIdAndUpdate: async function (categoryId, updateData) {
    try {
      const updatedCategory = await SchemaCategory.findByIdAndUpdate(
        categoryId,
        updateData,
        { new: true }
      );

      return updatedCategory;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
