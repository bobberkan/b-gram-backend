require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const searchRoutes = require("./routes/searchRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB'ga ulanish
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/bgram")
  .then(() => console.log("✅ MongoDB ga muvaffaqiyatli ulandi!"))
  .catch((err) => console.error("MongoDB ulanish xatosi:", err));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/search", searchRoutes);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portda ishlayapti`);
});
