var express = require('express');
var router = express.Router();
const adminController = require('../controllers/adminController')
const userAdmin = require('../middlewares/userAdmin')
/* GET home page. */
router.get('/',userAdmin,adminController.addProduct.get);

module.exports = router;
