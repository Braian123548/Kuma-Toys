const express = require('express');
const router = express.Router();
const productsController= require('../controllers/productsController');
const shopController= require('../controllers/shopController');
const detailController= require('../controllers/productsController');
const removeController= require('../controllers/productsController');
const upload  = require('../middlewares/upload');
// const addProductValidator = require('../validation/addProductValidator');

router

/* Create Products */   


     .post('/addProduct', upload.fields([
         {
             name: "mainImage"
         },
         {
             name: "images"
         }
     ]), productsController.addProduct.post)

    .get('/shop', shopController.shop.get)
    .get('/detail/:id', detailController.detail.get)


/* Detail Products
    .get('/detail/:id', detail)



/*Update Products*/
    // .get('/update/:id', productsController.updateProduct.get)
    .put('/update/:id',  upload.fields([
        {
            name: "mainImage"
        },
        {
            name: "images"
        }
    ]), productsController.updateProduct.put)

    .delete('/remove/:id', removeController.remove.delete)

    
module.exports = router;
