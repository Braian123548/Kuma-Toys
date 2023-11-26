var express = require('express');
var router = express.Router();
const userLogin = require('../middlewares/userLogin')

/* GET home page. */
router.get('/',userLogin, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
