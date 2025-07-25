const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  username: { type: String, required: true },
  text: { type: String, required: true },
  image: { type: String },
  likes: { type: Number, default: 0 },
  comments: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
});


const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
module.exports = Post;
