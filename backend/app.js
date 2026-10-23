
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var clienteRouter = require('./routes/Cliente');
var administradorRouter = require('./routes/administrador');
var boletosRouter = require('./routes/Boletos');
var itemVendaRouter = require('./routes/item_venda');
var produtoRouter = require('./routes/produto');
var servicoRouter = require('./routes/servico');
var vendasRouter = require('./routes/vendas');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.use('/', indexRouter);
app.use('/Cliente', clienteRouter);
app.use('/administrador', administradorRouter);
app.use('/boletos', boletosRouter);
app.use('/Item_Venda', itemVendaRouter);
app.use('/Produto', produtoRouter);
app.use('/Servico', servicoRouter);
app.use('/Vendas', vendasRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
