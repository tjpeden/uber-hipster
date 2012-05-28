var lingo = require('lingo'),
    en = lingo.en;

function base(address) {
  var result = 'http://';
  switch(process.env.NODE_ENV) {
  case 'production':
    result += process.env.HOSTNAME
    break;
  case 'development':
  default:
    result += 'localhost';
    if(address.port && address.port != 80) {
      result += ':' + address.port;
    }
  }
  
  return result;
}

function pathFor(obj, options) {
  var result = '/';
  options = options || {};
  
  result += en.pluralize(obj.constructor.modelName.toLowerCase()) + '/';
  
  if(!obj.isNew) result += obj._id.toHexString();
  
  if(options.action) result += '/' + options.action;
  if(options.format) result += '.' + options.format;
  
  return result;
}

module.exports = function(app) {
  app.helpers({
    pathFor: pathFor,
    urlFor: function(obj, options) {
      return base(app.address()) + pathFor(obj);
    }
  });
  
  app.dynamicHelpers({
    user: function(request, response) {
      return request.user;
    }
  });
}