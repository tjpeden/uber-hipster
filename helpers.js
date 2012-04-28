String.prototype.pluralize = function(count) {
  var lastLetter, len;
  if (count === 1) {
    return this.toString();
  }
  len = this.length;
  lastLetter = this.substr(len - 1);
  if (lastLetter === 'y') {
    return "" + (this.substr(0, len - 1)) + "ies";
  } else if (lastLetter === 's') {
    return this.toString();
  } else {
    return "" + this.toString() + "s";
  }
}

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
  
  result += obj.constructor.modelName.toLowerCase().pluralize() + '/';
  
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
}