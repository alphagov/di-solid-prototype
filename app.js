var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let nunjucks = require('nunjucks')
var path = require('path');

var indexRouter = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

nunjucks.configure(
  ['views', 'node_modules/govuk-frontend/'], 
  {
    autoescape:  true,
    express:  app
  }
)
app.set('view engine', 'njk');

app.use('/assets', express.static(path.join(__dirname, '/node_modules/govuk-frontend/govuk/assets')))

module.exports = app;
