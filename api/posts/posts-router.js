const express = require("express");
const Post = require("../db-helpers");

const router = express.Router();

router.post("/", async (req, res) => {
  const blogPost = req.body;
  console.log(blogPost);
  try {
    if (blogPost.title && blogPost.contents) {
      const posted = await Post.insert(blogPost);
      if (posted) {
        res.status(201).json({ data: posted });
      } else {
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post",
        });
      }
    } else {
      res.status(500).json({
        error: "There was an error while saving the post to the database.",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "There was an error while saving the post to the database.",
    });
  }
});

router.post("/:id/comments", async (req, res) => {
  const id = req.params.id;
  const text = { ...req.body, post_id: id };
  try {
    if (text) {
      const posts = await Post.findById(id);
      if (posts) {
        const postedComment = await Post.insertComment(text);
        res.status(201).json(postedComment);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    } else {
      res
        .status(500)
        .json({ errorMessage: "Please provide text for the comment." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "The post information could not be retrieved.",
    });
  }
});

router.get("/", async (req, res) => {
  const posts = await Post.find();

  try {
    if (posts) {
      res.status(200).json({ data: posts });
    } else {
      res
        .status(404)
        .json({
          errorMessage: "The post with the specified ID does not exist",
        });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: `Server error: ${err}` });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);

  try {
    if (post) {
      res.status(200).json({ data: post });
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "The post information could not be retrieved." });
  }
});

router.get("/:id/comments", async (req, res) => {
  const id = req.params.id;
  const posts = await Post.findById(id);

  try {
    if (posts) {
      const comments = await Post.findPostComments(id);
      if (comments) {
        res.status(200).json({ data: comments });
      }
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: `Server error: ${err}` });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);

  try {
    if (post) {
      const deleted = await Post.remove(id);
      res.status(200).json({ message: "Delete successful" });
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "The post could not be removed." });
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const post = await Post.findById(id);
  const { title, contents } = req.body;
  const editPost = req.body;

  try {
    if (post) {
      if (editPost.title && editPost.contents) {
        const edited = await Post.update(id, editPost);
        res.status(200).json(edited);
      } else {
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post.",
        });
      }
    } else {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "The post information could not be modified." });
  }
});

module.exports = router;
