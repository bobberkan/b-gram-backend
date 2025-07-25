const express = require("express");
const Post = require("../models/Post");

const router = express.Router();

// 🔵 Postlarni olish (GET /api/posts)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    console.error("❌ Postlarni olishda xatolik:", err.message);
    res.status(500).json({ error: "Server xatosi, iltimos keyinroq urinib ko'ring." });
  }
});

// 🟢 Yangi post qo'shish (POST /api/posts)
router.post("/", async (req, res) => {
  try {
    const { username, text, image } = req.body;
    if (!username || !text) {
      return res.status(400).json({ error: "Username va text maydonlari majburiy!" });
    }

    const newPost = new Post({ username, text, image });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("❌ Post qo'shishda xatolik:", err.message);
    res.status(500).json({ error: "Server xatosi, iltimos keyinroq urinib ko'ring." });
  }
});

// ❤️ Postni like qilish (PUT /api/posts/:id/like)
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post topilmadi" });
    }
    
    post.likes += 1;
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    console.error("❌ Like qo'shishda xatolik:", err.message);
    res.status(500).json({ error: "Server xatosi, iltimos keyinroq urinib ko'ring." });
  }
});

// 💬 Comment qo'shish (PUT /api/posts/:id/comment)
router.put("/:id/comment", async (req, res) => {
  try {
    const { username, text } = req.body;
    if (!username || !text) {
      return res.status(400).json({ error: "Username va comment text majburiy!" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post topilmadi" });
    }

    post.comments.push({ username, text, createdAt: new Date() });
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    console.error("❌ Comment qo'shishda xatolik:", err.message);
    res.status(500).json({ error: "Server xatosi, iltimos keyinroq urinib ko'ring." });
  }
});

// 🗑️ Postni o'chirish (DELETE /api/posts/:id)
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post topilmadi" });
    }
    res.status(200).json({ message: "Post muvaffaqiyatli o'chirildi" });
  } catch (err) {
    console.error("❌ Postni o'chirishda xatolik:", err.message);
    res.status(500).json({ error: "Server xatosi, iltimos keyinroq urinib ko'ring." });
  }
});

module.exports = router;
