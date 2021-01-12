const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  body: {
    type: String,
  },
});

const Post = mongoose.model("posts", postSchema);

module.exports = Post;
