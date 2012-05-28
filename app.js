var express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    RedisStore = require('connect-redis')(express),
    Resource = require('express-resource-new');

require('./lib/passport');

var app = module.exports = express.createServer();
var pub = __dirname + '/public';

// Configuration
var sessionOptions = { secret: 'mega-uber-hipster' }
if(app.settings.env == 'production')
  sessionOptions.store = new RedisStore(require('./lib/redis'));

app.configure(function(){
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout: false });
  app.set('controllers', __dirname + '/app/controllers');
  app.use(express.favicon(pub + '/favicon.ico'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session(sessionOptions));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(pub));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

mongoose.connect(process.env.MONGODB);

require('./lib/helpers')(app);

// Routes

app.get('/', function(request, response) {
  if(!request.isAuthenticated()) {
    response.render('index');
  } else {
    response.redirect('/posts');
  }
});

app.get('/about', function(request, response) {
  response.render('about');
});

app.get('/auth/google',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(request, response) {});

app.get('/auth/google/return',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(request, response) {
    response.redirect('/posts');
  });

app.get('/logout', function(request, response) {
  request.logout();
  response.redirect('/');
});

app.get('/install', function(request, response) {
  response.render('install');
});

app.get('/resources', function(request, response) {
  response.send("<pre>"+JSON.stringify(app.resources, function(key, value) {
    if(value == app)
      return '[Circular]';
    return value;
  }, "  ")+"</pre>");
});

// Setup resources
app.resource('posts', function() {
  this.member('put', 'toggle');
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
