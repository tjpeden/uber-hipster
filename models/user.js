var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema;

var Model;
var User = new Schema({
  identifier: { type: String, index: true },
  email: String,
  name: String,
  admin: { type: Boolean, default: false }
});

User.statics.findOrCreate = function(identifier, profile, callback) {
  var self = this;
  self.findOne({ email: profile.emails[0].value }, function(error, user) {
    if(error) throw error;
    if(user) {
      if(user.identifier != identifier) {
        user.identifier = identifier;
        user.save();
      }
      callback(user);
    } else {
      var user = new Model();
      user.identifier = identifier;
      user.email = profile.emails[0].value;
      user.name = profile.displayName;
      user.save(function(error){
        if(error) throw error;
        callback(user);
      });
    }
  });
}

Model = Mongoose.model('User', User);
