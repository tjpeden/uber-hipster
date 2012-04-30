
/*
 * GET home page.
 */

var Mongoose = require('mongoose');

require('../models/post');

var Post = Mongoose.model('Post');

module.exports = {
  index: function(req, res) {
    Post.ownedBy(req.user).run(function(error, posts) {
      res.render('posts/index', { posts: posts });
    });
  },
  new: function(req, res) {
    var post = new Post();
    res.render('posts/new', { post: post });
  },
  create: function(req, res) {
    var post = new Post(req.body.post);
    post._owner = req.user._id;
    post.save(function(error) {
      if(error) {
        res.render('posts/new', { post: post });
      } else {
        res.redirect('index');
      }
    });
  },
  show: function(req, res) {
    Post.findById(req.params.post, function(error, post) {
      if(error) {
        console.log(req.url);
        console.log(error);
      } else {
        switch(req.format) {
        case 'json':
          res.send(post);
          break;
        default:
          res.send(404); // Perhaps I shall implement this later
          break;
        }
      }
    });
  },
  edit: function(req, res) {
    Post.findById(req.params.post, function(error, post) {
      if(error) {
        console.log(error);
        res.redirect('index');
      } else {
        res.render('posts/edit', { post: post });
      }
    });
  },
  update: function(req, res) {
    Post.findById(req.params.post, function(error, post) {
      if(error) {
        console.log(error);
      } else {
        post.update(req.body.post);
        post.save();
      }
      res.redirect('index');
    });
  },
  destroy: function(req, res) {
    Post.findById(req.params.post, function(error, post) {
      if(error) {
        console.log(error);
      } else {
        post.remove(function(error) {
          if(error) {
            console.log(error);
          }
          Post.ownedBy(req.user).run(function(error, posts) {
            res.partial('posts/_post', posts);
          });
        });
      }
    });
  }
};