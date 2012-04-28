
/**
 * Module dependencies.
 */

var express = require('express'),
    Mongoose = require('mongoose');
    require('express-resource');

var routes = {};
routes.post = require('./routes/post_controller');

var app = module.exports = express.createServer();
var pub = __dirname + '/public';

var dbURL = process.env.MONGODB;

console.log(dbURL);
Mongoose.connect(dbURL);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout: false });
  app.use(express.favicon(pub + '/favicon.ico'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(pub));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

require('./helpers')(app);

// Routes

app.get('/', function(request, response) {
  response.redirect('/posts');
});

app.resource('posts', routes.post);

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
