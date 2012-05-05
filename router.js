(function() {
  var fs = require('fs');
  var lingo = require('lingo');
  
  function $(destination, source) { // extend
    for(var property in source)
      if(source.hasOwnProperty(property))
        destination[property] = source[property];
    return destination;
  }
  
  function Router(dir) {
    this.dir = dir;
    this.routes = {};
  }
  
  $(Router.prototype, {
    initControllers: function(done) {
      var self = this;
      fs.readdir(this.dir, function(error, files) {
        if(error) throw error;
        files.forEach(function(file) {
          var name = file.match(/^[^_]+/);
          self.routes[name] = require(self.dir + file);
        });
        done();
      });
    },
    createRoutes: function(app) {
      for(var route in this.routes) {
        for(var action in this.routes[route]) {
          var path = this.path(route, action),
              callback = this.routes[route][action];
          // console.log(route, action, path);
          switch(action) {
            case 'all': 
              app.all(path, callback);
            case 'index':
              app.get(path, callback);
              break;
            case 'show':
              app.get(path, callback);
              break;
            case 'new':
              app.get(path, callback);
              break;
            case 'create':
              app.post(path, callback);
              break;
            case 'edit':
              app.get(path, callback);
              break;
            case 'update':
              app.put(path, callback);
              break;
            case 'destroy':
              app.del(path, callback);
              break;
            default: break;
          }
        }
      }
    },
    path: function(route, action) {
      var result = '/' + route;
      
      switch(action) {
        case 'all':
        case 'show':
        case 'edit':
        case 'update':
        case 'destroy':
          result += '/:' + lingo.en.singularize(route);
        default: break;
      };
      
      switch(action) {
        case 'all':
          result += '?/:op?';
          break;
        case 'new':
        case 'edit':
          result += '/' + action;
        default: break;
      }
      
      if('all' != action) result += '.:format?';
      
      return result;
    }
  });
  
  module.exports = function(app, dir) {
    if(!dir) dir = './controllers/';
    var router = new Router(dir);
    router.initControllers(function() {
      router.createRoutes(app);
    });
  };
})();
