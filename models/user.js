var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema
    Auth = require('mongoose-auth');

var User = new Schema({
  accessToken: String,
  expires: Date,
  refreshToken: String,
  email: String
});

Mongoose.model('User', User);
