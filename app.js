var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//INICIO DE SESION

var session = require('express-session');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'Alejandro123456789',
  resave: false,
  saveUninitialized: true
}));

// Cargo el App Get para inicio de Session

app.get('/', function (req, res){
  var conocido = Boolean(req.session.nombre);

  res.render('index', {
    title: 'Sesiones en Express.js',
    conocido: conocido,
    nombre: req.session.nombre
  });
});

app.post('/ingresar', function (req, res){
  if(req.body.nombre){
    req.session.nombre = req.body.nombre
  }
  res.redirect('/');
});

app.get('/salir', function (req, res){
  req.session.destroy();
  res.redirect('/');
});

//Contador de Visitas

app.use(function(req, res,next){

  if(!req.session.visitas){
    req.session.visitas ={};
  }

  if(!req.session.visitas[req.originalUrl]){
    req.session.visitas[req.originalUrl]=1;    
  }else{
    req.session.visitas[req.originalUrl]++;
  }
  console.log(req.session.visitas);

  next();
});

app.get('/productos', function(req, res){
  res.render('pagina',{
    nombre: 'productos',
    visitas: req.session.visitas[req.originalUrl]
  });
});
app.get('/contacto', function(req, res){
  res.render('pagina',{
    nombre: 'contacto',
    visitas: req.session.visitas[req.originalUrl]
  });
});

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
