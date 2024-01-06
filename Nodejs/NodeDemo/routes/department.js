var express = require("express");
const { model } = require("mongoose");
const { use } = require(".");
var router = express.Router();
var responseData = require("../helper/responseData");
var modelDepartment = require("../models/department");
var validate = require("../validates/department");
const { validationResult } = require("express-validator");

router.get("/", async function (req, res, next) {
  console.log(req.query);
  var productsAll = await modelDepartment.getall(req.query);
  responseData.responseReturn(res, 200, true, productsAll);
});

router.get("/:id", async function (req, res, next) {
  // get by ID
  try {
    console.log(`ID: ${req.params.id}`);
    var product = await modelDepartment.getOne(req.params.id);
    responseData.responseReturn(res, 200, true, product);
  } catch (error) {
    console.log(`ERROR: ${error}`);
    responseData.responseReturn(res, 404, false, "khong tim thay department");
  }
});

router.post("/add", validate.validate(), async function (req, res, next) {
  const { name } = req.body;
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
  const newProduct = await modelDepartment.create({
    name: name
  });
  responseData.responseReturn(res, 200, true, newProduct);
});
router.put(
  "/edit/:id",
  validate.validate(["name"]),
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

      const updatedDepartment = await modelDepartment.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!updatedDepartment) {
        responseData.responseReturn(res, 404, false, "khong tim thay department");
        return;
      }

      responseData.responseReturn(res, 200, true, updatedDepartment);
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
    var department = await modelDepartment.deleteById(idDelete);
    console.log(`After delete: ${department}`);
    if (!department)
      responseData.responseReturn(res, 404, false, "khong tim thay department");
    responseData.responseReturn(res, 200, true, "xoa thanh cong");
  } catch (error) {
    responseData.responseReturn(res, 404, false, "khong tim thay department");
  }
});

module.exports = router;
