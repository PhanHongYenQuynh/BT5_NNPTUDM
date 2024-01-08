var express = require('express');
const { model } = require('mongoose');
const { use } = require('.');
var router = express.Router();
var responseData = require('../helper/responseData');
var modelProduct = require('../models/product')
var validate = require('../validates/product')
const { validationResult } = require('express-validator');

router.get('/', async function (req, res, next) {
  console.log(req.query);
  var productsAll = await modelProduct.getall(req.query);
  responseData.responseReturn(res, 200, true, productsAll);
});
router.get('/:id', async function (req, res, next) {// get by ID
  try {
    console.log(`ID: ${req.params.id}`)
    var product = await modelProduct.getOne(req.params.id);
    responseData.responseReturn(res, 200, true, product);
  } catch (error) {
    console.log(`ERROR: ${error}`)
    responseData.responseReturn(res, 404, false, "khong tim thay product");
  }
});
router.post('/add', validate.addValidator(),
  async function (req, res, next) {
    const { name, description, image, price } = req.body;
    console.log(`name: ${name}, descritption: ${description}, image: ${image}`)
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      responseData.responseReturn(res, 400, false, errors.array().map(error => error.msg));
      return;
    }
    var product = await modelProduct.getByName(req.body.name);
    console.log(`product: ${JSON.stringify(product)}`)
    if (product) {
      responseData.responseReturn(res, 404, false, "product da ton tai");
    } else {
      const newProduct = await modelProduct.createProduct({
        name: name,
        descritption: description,
        image: image,
        price: price
      })
      responseData.responseReturn(res, 200, true, newProduct);
    }
  });
router.put('/edit/:id', validate.editValidator(['name', 'description']),
  async function (req, res, next) {
    try {
      var errors = validationResult(req);
      if (!errors.isEmpty()) {
        responseData.responseReturn(res, 400, false, errors.array().map(error => error.msg));
        return;
      }

      const updatedProduct = await modelProduct.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!updatedProduct) {
        responseData.responseReturn(res, 404, false, "khong tim thay product");
        return;
      }

      responseData.responseReturn(res, 200, true, updatedProduct);
    } catch (error) {
      console.error(error);
      responseData.responseReturn(res, 500, false, "loi server");
    }
  });
router.delete('/delete/:id', async function (req, res, next) {
  try {
    const idDelete = req.params.id;
    console.log(`ID: ${idDelete}`)
    var product = await modelProduct.deleteById(idDelete);
    console.log(`After delete: ${product}`)
    if (!product)
      responseData.responseReturn(res, 404, false, "khong tim thay product");
    responseData.responseReturn(res, 200, true, "xoa thanh cong");
  } catch (error) {
    responseData.responseReturn(res, 404, false, "khong tim thay product");
  }
});

module.exports = router;
