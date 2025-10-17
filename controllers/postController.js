import Post from "../models/Post.js";
import { createError } from "../errorHandler.js";

export const addPost = (req, res, next) => {
  let newPost = new Post({
    title: req.body.title, 
    content: req.body.content, 
    author: {
      _id: req.user.id,
      username: req.user.username
    },
  });
  return newPost.save()
    .then(result => {
      return res.status(201).send(result);
    })
    .catch(next);
}

export const getAllPosts = (req, res, next) => {
  return Post.find()
    .then(posts => res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      "posts": posts
    }))
    .catch(next);
}

export const getPostById = (req, res, next) => {
  return Post.findById(req.params.id)
    .then(post => {
      if (post) {
        return res.status(200).json({success: true, post});
      } else {
        return next(createError("Post not found", 404));
      }
    })
    .catch(next);
}

export const updatePost = (req, res, next) => {
  return Post.findById(req.params.id)
    .then(post => {
      if (post) {
        if (post.author._id !== req.user.id) {
          return next(createError("You cannot update another person's post.", 403));
        }

        if (req.body.title) post.title = req.body.title;
        if (req.body.content) post.content = req.body.content;

        return post.save()
          .then(updatedPost => {
            return res.status(200).json({
              success: true,
              message: "Post updated successfully",
              updatedPost
            })
          })
          .catch(next);

      } else {
        return next(createError("Post not found", 404));
      }
    })
    .catch(next);
}

export const deletePost = (req, res, next) => {
  return Post.findById(req.params.id)
  .then(post => {
    if (post) {
      if (post.author._id !== req.user.id && !req.user.isAdmin) {
        return next(createError("You cannot delete another person's post.", 403));
      }

      return post.deleteOne()
        .then(() => {
          if (req.user.isAdmin) {
            console.log("This post was smited by the Imperator's Divine Authority of the Law! Praise Imperator Cerydra!");
          }
          return res.status(200).json({
            success: true,
            message: "Post deleted successfully"
          })
        })
        .catch(next);

    } else {
      return next(createError("Post not found", 404));
    }
  })
  .catch(next);
}

export const addComment = (req, res, next) => {
  let newComment = {
    author: {
      _id: req.user.id,
      username: req.user.username
    },
    postId: req.params.id,
    comment: req.body.comment
  };

  return Post.findByIdAndUpdate(
    req.params.id,
    {$push: {comments: newComment}},
    {new: true}
  )
    .then(post => {
      if (post) {
        return res.status(200).json({
          success: true,
          message: "Comment added successfully",
          updatedPost: post
        });
      } else {
        return next(createError("Post not found", 404));
      }
    })
    .catch(next);
}

export const getComments = (req, res, next) => {
  return Post.findById(req.params.id)
    .then(post => {
      if (post) {
        return res.status(200).json({
          success: true,
          comments: post.comments
        });
      } else {
        return next(createError("Post not found", 404));
      }
    })
    .catch(next);
}

export const deleteComment = (req, res, next) => {
  return Post.findOne({"comments._id": req.params.id})
  .then(post => {
    if (!post) {
      return next(createError("Comment not found", 404));
    }

    const comment = post.comments.id(req.params.id);
    if (comment.author._id !== req.user.id && !req.user.isAdmin) {
      return next(createError("You cannot delete another person's comment.", 403));
    }
    comment.deleteOne();
    return post.save()
      .then(() => {
        if (req.user.isAdmin) {
          console.log("This comment was smited by the Imperator's Divine Authority of the Law! Praise Imperator Cerydra!");
        }
        return res.status(200).json({
          success: true,
          message: "Comment deleted successfully.",
          post
        });
      })
      .catch(next)
  })
  .catch(next);
}

