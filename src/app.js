var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const adminRouter = require('./routes/admin');
const cartRouter = require('./routes/cart');

const methodOverride = require('method-override');
require("./database/models/index")
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(methodOverride('_method'))

app.use(session({
  secret: 'maincra', 
  resave: false,
  saveUninitialized: true,

}));


app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/products', productsRouter)
app.use('/admin', adminRouter)
app.use('/cart', cartRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(res.render("404"));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
