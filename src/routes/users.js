var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
const validarRegister = require('../validation/registerValidation')
const validarLogin = require('../validation/loginValidation')


router.get('/login', validarLogin, userController.login.get);
router.post('/login', validarLogin, userController.login.post);


router.get('/register', validarRegister, userController.register.get);
router.post('/register', validarRegister, userController.register.post);

module.exports = router;
