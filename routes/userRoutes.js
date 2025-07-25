const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// 🔐 Registratsiya (POST /api/users/register)
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Foydalanuvchi mavjudligini tekshiramiz
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "Bu email yoki username allaqachon ro'yxatdan o'tgan" });
    }

    // Parolni hash qilamiz
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Yangi foydalanuvchi yaratamiz
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // JWT token yaratamiz
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
      },
    });
  } catch (err) {
    console.error("❌ Registratsiya xatosi:", err.message);
    res.status(500).json({ error: "Server xatosi, iltimos keyinroq urinib ko'ring." });
  }
});

// 🔑 Login (POST /api/users/login)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Foydalanuvchini topamiz
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Email yoki parol noto'g'ri" });
    }

    // Parolni tekshiramiz
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Email yoki parol noto'g'ri" });
    }

    // JWT token yaratamiz
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    console.error("❌ Login xatosi:", err.message);
    res.status(500).json({ error: "Server xatosi, iltimos keyinroq urinib ko'ring." });
  }
});

// 👤 Profil ma'lumotlarini olish (GET /api/users/:id)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("❌ Profil ma'lumotlarini olishda xatolik:", err.message);
    res.status(500).json({ error: "Server xatosi, iltimos keyinroq urinib ko'ring." });
  }
});

// 📝 Profilni yangilash (PUT /api/users/:id)
router.put("/:id", async (req, res) => {
  try {
    const { bio, profilePicture } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
    }

    if (bio) user.bio = bio;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();
    res.status(200).json(user);
  } catch (err) {
    console.error("❌ Profilni yangilashda xatolik:", err.message);
    res.status(500).json({ error: "Server xatosi, iltimos keyinroq urinib ko'ring." });
  }
});

module.exports = router; 