var express = require("express");
const { model } = require("mongoose");
const { use } = require(".");
var router = express.Router();
var responseData = require("../helper/responseData");
var modelCategory = require("../models/category");
var validate = require("../validates/category");
const { validationResult } = require("express-validator");
const category = require("../schema/category");

router.get("/", async function (req, res, next) {
  console.log(req.query);
  var categorysAll = await modelCategory.getall(req.query);
  responseData.responseReturn(res, 200, true, categorysAll);
});


router.get("/:id", async function (req, res, next) {
  // get by ID
  try {
    console.log(`ID: ${req.params.id}`);
    var category = await modelCategory.getOne(req.params.id);
    responseData.responseReturn(res, 200, true, category);
  } catch (error) {
    console.log(`ERROR: ${error}`);
    responseData.responseReturn(res, 404, false, "khong tim thay product");
  }
});

router.post("/add", validate.addValidator(), async function (req, res, next) {
  const { name, order} = req.body;
  console.log(`name: ${name}`);
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    responseData.responseReturn(
      res,
      400,
      false,
      errors.array().map((error) => error.msg)
    );
    return;
  }
  var category = await modelCategory.getByName(req.body.name);
  console.log(`category: ${JSON.stringify(category)}`);
  if (category) {
    responseData.responseReturn(res, 404, false, "category da ton tai");
  } else {
    const newCategory = await modelCategory.createCategory({
      name: name,
      order: order
    });
    responseData.responseReturn(res, 200, true, newCategory);
  }
});
router.put(
  "/edit/:id",
  validate.editValidator(["name"]),
  async function (req, res, next) {
    try {
      var errors = validationResult(req);
      if (!errors.isEmpty()) {
        responseData.responseReturn(
          res,
          400,
          false,
          errors.array().map((error) => error.msg)
        );
        return;
      }

      const updatedCategory = await modelCategory.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!updatedCategory) {
        responseData.responseReturn(res, 404, false, "khong tim thay category");
        return;
      }

      responseData.responseReturn(res, 200, true, updatedCategory);
    } catch (error) {
      console.error(error);
      responseData.responseReturn(res, 500, false, "loi server");
    }
  }
);
router.delete("/delete/:id", async function (req, res, next) {
  try {
    const idDelete = req.params.id;
    console.log(`ID: ${idDelete}`);
    var product = await modelCategory.deleteById(idDelete);
    console.log(`After delete: ${category}`);
    if (!category)
      responseData.responseReturn(res, 404, false, "khong tim thay category");
    responseData.responseReturn(res, 200, true, "xoa thanh cong");
  } catch (error) {
    responseData.responseReturn(res, 404, false, "khong tim thay category");
  }
});

module.exports = router;
