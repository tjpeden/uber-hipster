var Express = require('express'),
    Mongoose = require('mongoose'),
    Passport = require('passport'),
    RedisStore = require('connect-redis')(Express),
    resources = require('./router');

require('./passport');

var app = module.exports = Express.createServer();
var pub = __dirname + '/public';

var dbURL = process.env.MONGODB;

console.log(dbURL);
Mongoose.connect(dbURL);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout: false });
  app.use(Express.favicon(pub + '/favicon.ico'));
  app.use(Express.bodyParser());
  app.use(Express.methodOverride());
  app.use(Express.cookieParser());
  app.use(Express.session({ store: new RedisStore(require('./redis')), secret: 'mega-uber-hipster' }));
  app.use(Passport.initialize());
  app.use(Passport.session());
  app.use(Express.static(pub));
});

app.configure('development', function(){
  app.use(Express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(Express.errorHandler());
});

require('./helpers')(app);

// Routes

app.get('/', function(request, response) {
  if(!request.isAuthenticated()) {
    response.render('index');
  } else {
    response.redirect('/posts');
  }
});

app.get('/auth/google',
  Passport.authenticate('google', { failureRedirect: '/' }),
  function(request, response) {});

app.get('/auth/google/return',
  Passport.authenticate('google', { failureRedirect: '/' }),
  function(request, response) {
    response.redirect('/posts');
  });

app.get('/logout', function(request, response) {
  request.logout();
  response.redirect('/');
});

// Setup resources
resources(app);

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
