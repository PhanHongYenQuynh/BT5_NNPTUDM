const { body } = require("express-validator");
const message = require("../helper/message");
const util = require("util");

const options = {
    name: {
        min: 10,
        max: 80,
    }
};


const validate = [
    body("name")
        .isLength({ min: options.name.min, max: options.name.max })
        .withMessage(
            util.format(
                message.size_string_message,
                "name",
                options.name.min,
                options.name.max
            )
        ),
];


module.exports = {
    validate: function () {
        return validate;
    }
};
