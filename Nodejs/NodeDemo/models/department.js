var SchemaDepartment = require('../schema/department')

// get, getbyID,create,update, delete
module.exports = {
    getall: function (query) {
        var sort = {};
        var Search = {};
        if (query.sort) {
            if (query.sort[0] == '-') {
                sort[query.sort.substring(1)] = 'desc';
            } else {
                sort[query.sort] = 'asc';
            }
        }
        if (query.key) {
            Search.name = new RegExp(query.key, 'i');
        }
        var limit = parseInt(query.limit) || 2;
        var page = parseInt(query.page) || 1;
        var skip = (page - 1) * limit;
        return SchemaDepartment.find(Search).select('name').sort(sort).limit(limit).skip(skip).exec();
    },
    getbyID: function (id) {
        return SchemaDepartment.findById(id);
    },
    getByName: function (name) {
        return SchemaDepartment.findOne({ name: name }).exec();
    },
    create: function (department) {
        return new SchemaDepartment(department).save();
    },
    update: function (product) {
        return SchemaDepartment.findOneAndUpdate({ _id: product.id }, product);
    },
    delete: async function (id) {
        try {
            const updatedDepartment = await SchemaDepartment.findByIdAndDelete(id);

            return updatedDepartment;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    findByIdAndUpdate: async function (departmentId, updateData) {
        try {
            const updatedDepartment = await SchemaDepartment.findByIdAndUpdate(
                departmentId,
                updateData,
                { new: true }
            );

            return updatedDepartment;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
}