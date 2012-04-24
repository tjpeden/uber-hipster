
/*
 * GET home page.
 */

var Mongoose = require('mongoose');

require('../models/post');

var Post = Mongoose.model('Post');

module.exports = {
  index: function(req, res) {
    Post.find(function(error, posts) {
      res.render('index', { posts: posts });
    });
  },
  new: function(req, res) {
    var post = new Post();
    res.render('form', { method: 'post', post: post });
  },
  create: function(req, res) {
    var post = new Post();
    post.update(req.body.post);
    res.redirect('home');
  },
  show: function(req, res) {
    switch(req.format) {
      case 'json':
        Post.findById(function(error, post) {
          res.send(post);
        });
        break;
      default:
        res.send(404);
        break;
    }
  },
  edit: function(req, res) {},
  update: function(req, res) {},
  destroy: function(req, res) {}
};