const { body } = require("express-validator");
const message = require("../helper/message");
const util = require("util");

const options = {
  name: {
    min: 10,
    max: 80,
  },
};

const commonValidationRules = [
  body("price")
    .optional()
    .isNumeric()
    .withMessage("price không đúng định dạng"),
  body("order").optional().isNumeric().withMessage("URL không đúng định dạng"),
];

const addValidationRules = [
  ...commonValidationRules,
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

const editValidationRules = (fieldsToValidate) => {
  const specificValidationRules = [
    ...(fieldsToValidate && fieldsToValidate.includes("name")
      ? [
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
        ]
      : []),
  ];

  return [...commonValidationRules, ...specificValidationRules];
};

module.exports = {
  addValidator: function () {
    return addValidationRules;
  },
  editValidator: function (fieldsToValidate) {
    return editValidationRules(fieldsToValidate);
  },
};
