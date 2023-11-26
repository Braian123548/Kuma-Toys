const express = require('express');
const router = express.Router();
const productsController= require('../controllers/productsController');
const { upload } = require('../middlewares/upload');

router

/* Create Products */    
    .get('/addProduct', productsController.addProduct.get)
    .post('/addProduct', upload.fields([
        {
            name: "mainImage"
        },
        {
            name: "images"
        }
    ]), productsController.addProduct.post)



/* Detail Products
    .get('/detail/:id', detail)



/*Edit y Update Products*/
    //.get('/edit/:id', edit)
    /*.put('/update/:id', upload.fields([
        {
            name: "mainImage"
        },
        {
            name: "images"
        }
    ]), update)



/*Eliminar Products*/
    /*.get('/remove/:id', remove)
    .delete('/remove/:id', remove)*/
    
    

    
module.exports = router;
