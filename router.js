var fs = require('fs');

var dir = './controllers/'
    routes = {};

var files = fs.readdirSync(dir);
files.forEach(function(file) {
  var route = require(dir + file),
      name = file.match(/^[^_]+/);
  routes[name] = route;
});

module.exports = routes;
