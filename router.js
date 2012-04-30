var fs = require('fs');

var dir = './controllers/'
    routes = {};

fs.readdir(dir, function(error, files) {
  files.forEach(function(file) {
    var route = require(dir + file),
        name = file.match(/^[^_]+/);
    routes[name] = route;
  });
});

module.exports = routes;
