const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");

// Qidiruv API endpointi
router.get("/", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Qidiruv so'rovi kiritilmagan" });
    }

    // Foydalanuvchilarni qidirish
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { fullName: { $regex: query, $options: "i" } },
        { bio: { $regex: query, $options: "i" } }
      ]
    }).select("username fullName avatar bio");

    // Postlarni qidirish
    const posts = await Post.find({
      $or: [
        { content: { $regex: query, $options: "i" } },
        { caption: { $regex: query, $options: "i" } }
      ]
    })
    .populate("author", "username avatar")
    .sort({ createdAt: -1 });

    // Debug uchun
    console.log("Qidiruv so'rovi:", query);
    console.log("Topilgan foydalanuvchilar:", users);
    console.log("Topilgan postlar:", posts);

    res.json({
      users,
      posts
    });
  } catch (error) {
    console.error("Qidiruv xatosi:", error);
    res.status(500).json({ error: "Server xatosi" });
  }
});

module.exports = router; 