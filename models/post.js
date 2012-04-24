var Mongoose = require('mongoose'),
    addUpdate = require('./update'),
    Schema = Mongoose.Schema;

var Post = new Schema({
  title: {type: String, unique: true},
  description: String
});

Post.plugin(addUpdate);

Post.statics.ordered = function(callback) {
  return this.find().asc('title').run(callback);
}

Mongoose.model('Post', Post);
