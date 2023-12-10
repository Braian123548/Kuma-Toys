var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')
const validarRegister = require('../validation/registerValidation')
const validarLogin = require('../validation/loginValidation')
const {upload}= require('../middlewares/uploadProfile')

router.get('/login', validarLogin, userController.login.get);
router.post('/login', validarLogin, userController.login.post);


router.get('/register', validarRegister, userController.register.get);
router.post('/register',upload.single('profilePicture'), validarRegister, userController.register.post);


router.get('/profile/:id', validarRegister, userController.profile.get);
router.put('/profile/:id', upload.single('profilePicture'),validarRegister, userController.profile.put);

module.exports = router;
