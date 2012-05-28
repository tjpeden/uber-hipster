
/*
 * GET home page.
 */

var Mongoose = require('mongoose');

require('../../models/post');

var Post = Mongoose.model('Post');

module.exports = {
  all: function(request, response, next) {
    if(request.isAuthenticated()) {
      next();
    } else {
      response.redirect('home');
    }
  },
  index: function(request, response) {
    Post.ownedBy(request.user).run(function(error, posts) {
      response.render('posts/index', { posts: posts });
    });
  },
  show: function(request, response) {
    Post.findById(request.params.post, function(error, post) {
      if(error) {
        console.log(request.url);
        console.log(error);
      } else {
        switch(request.params.format) {
        case 'json':
          response.send(post);
          break;
        default:
          response.send(415); // Perhaps I shall implement this later
          break;
        }
      }
    });
  },
  new: function(request, response) {
    var post = new Post();
    response.render('posts/new', { post: post });
  },
  create: function(request, response) {
    var post = new Post(request.body.post);
    post._owner = request.user._id;
    post.save(function(error) {
      if(error) {
        response.render('posts/new', { post: post });
      } else {
        response.redirect('/posts');
      }
    });
  },
  edit: function(request, response) {
    Post.findById(request.params.post, function(error, post) {
      if(error) {
        console.log(error);
        response.redirect('/posts');
      } else {
        response.render('posts/edit', { post: post });
      }
    });
  },
  update: function(request, response) {
    Post.findById(request.params.post, function(error, post) {
      if(error) {
        console.log(error);
      } else {
        post.update(request.body.post);
        post.save();
      }
      response.redirect('/posts');
    });
  },
  toggle: function(request, response) {
    Post.findById(request.params.post, function(error, post) {
      if(error) {
      
      } else {
        post.star = !post.star;
        post.save(function(error) {
          Post.ownedBy(request.user).run(function(error, posts) {
            response.partial('posts/_post', posts);
          });
        });
      }
    });
  },
  destroy: function(request, response) {
    Post.findById(request.params.post, function(error, post) {
      if(error) {
        console.log(error);
      } else {
        post.remove(function(error) {
          if(error) {
            console.log(error);
          }
          Post.ownedBy(request.user).run(function(error, posts) {
            response.partial('posts/_post', posts);
          });
        });
      }
    });
  }
};