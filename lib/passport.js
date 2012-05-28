var Mongoose = require('mongoose'),
    Passport = require('passport'),
    GoogleStrategy = require('passport-google').Strategy;

require('../app/models/user');

var User = Mongoose.model('User');

Passport.serializeUser(function(user, done) {
  done(null, user._id.toHexString());
});

Passport.deserializeUser(function(id, done) {
  User.findById(id, function(error, user){
    done(error, user);
  });
});

var settings;

if(process.env.NODE_ENV == 'production') {
  settings = {
    returnURL: 'http://uber.tjcoding.com/auth/google/return',
    realm: 'http://uber.tjcoding.com'
  };
} else {
  settings = {
    returnURL: 'http://localhost:3000/auth/google/return',
    realm: 'http://localhost:3000'
  };
}

Passport.use(
  new GoogleStrategy(settings, function(identifier, profile, done) {
    User.findOrCreate(identifier, profile, function(user) {
      done(null, user);
    });
  })
);