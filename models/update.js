module.exports = function addUpdate(schema, options) {
  schema.methods.update = function(obj) {
    for(var prop in obj) {
      if(obj.hasOwnProperty(prop)) {
        this[prop] = obj[prop];
      }
    }
  }
}