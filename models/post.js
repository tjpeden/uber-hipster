var Mongoose = require('mongoose'),
    addUpdate = require('./update'),
    Schema = Mongoose.Schema;

var Post = new Schema({
  _owner: { type: Schema.ObjectId, ref: 'User' },
  title: { type: String, unique: true },
  description: String
});

Post.plugin(addUpdate);

Post.statics.ownedBy = function(user) {
  return this.where('_owner', user._id).asc('title');
};

Mongoose.model('Post', Post);
