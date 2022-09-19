var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session'); // express-session si o si aca

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({   // El manejo de sesiones tiene que estar si o si abajo del 'public' y los ruteos
  secret: 'IzKHigZDCiwXLemjwpHs',  // Tiene que ser un codigo random de minimo 20 caracteres
  resave: false,
  saveUninitialized: true
}));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.get('/', (req, res)=>{
  var conocido = Boolean(req.session.nombre);

  res.render('index', {
    title: 'Sesiones en Express.js',
    conocido: conocido,
    nombre: req.session.nombre
  })
});

app.post('/ingresar', (req, res)=>{
  if (req.body.nombre){
    req.session.nombre = req.body.nombre  // Guarda el nombre ingresado en la variable de sesion
  }
  res.redirect('/');  // Despues de guardar el nombre, se redirige a localhost:3000 
});

app.get('/salir', (req, res)=>{
  req.session.destroy();
  res.redirect('/');
});

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
