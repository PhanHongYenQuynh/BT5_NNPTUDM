var SchemaProduct = require('../schema/product')

module.exports ={
    getall: function(query) {
        var sort = {};
        var search = {};
        
        if (query.sort) {
            sort.price = (query.sort[0] === '-') ? -1 : 1;
        }
        
        if (query.key) {
            search.name = new RegExp(query.key, 'i');
        }
    
        var limit = parseInt(query.limit) || 10;
        var page = parseInt(query.page) || 1;
        var skip = (page - 1) * limit;
    
        return SchemaProduct
            .find({ ...search, isDelete: false })
            .select('name description image price')
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .exec();
    }
    ,
    getOne:function(id){
        return SchemaProduct.findById(id);
    },
    getByName:function (name){
        return SchemaProduct.findOne({name: name}).exec();
    },
    createProduct:function(product){
        return new SchemaProduct(product).save();
    },
    findAndUpdate:function(product){
        return SchemaProduct.findOneAndUpdate(
            {_id: product.id},
            product
        );
    },
    deleteById: async function(id) {
        try {
            const updatedProduct = await SchemaProduct.findOneAndUpdate(
                { _id: id},
                { $set: { isDelete: true } },
                { new: true }
            );
    
            return updatedProduct;
        } catch (error) {
            console.error(error);
            throw error; 
        }
    },
    findByIdAndUpdate:async function(productId, updateData) {
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
    }
    
}