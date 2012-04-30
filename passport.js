var Mongoose = require('mongoose'),
    Passport = require('passport'),
    GoogleStrategy = require('passport-google').Strategy;

require('./models/user');

var User = Mongoose.model('User');

Passport.serializeUser(function(user, done) {
  done(null, user._id.toHexString());
});

Passport.deserializeUser(function(id, done) {
  User.findById(id, function(error, user){
    done(error, user);
  });
});

Passport.use(
  new GoogleStrategy({
    returnURL: 'http://uber.tjcoding.com/auth/google/return',
    realm: 'http://uber.tjcoding.com'
  },
  function(identifier, profile, done) {
    User.findOrCreate(identifier, profile, function(user) {
      done(null, user);
    });
  })
);