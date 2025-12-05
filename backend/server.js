const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://project:root@cluster0.h5xccde.mongodb.net/giflogin?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// MODEL
const User = mongoose.model("User", {
  password: String,
  gifUrl: { type: String, unique: true },
  
});

// REGISTER
app.post("/register", async (req, res) => {
  const { password, gifUrl } = req.body;

  const existing = await User.findOne({ gifUrl });
  if (existing)
    return res
      .status(400)
      .json({ error: "This GIF is already taken! Choose another one." });

  const hashed = await bcrypt.hash(password, 10);

  await User.create({ password: hashed, gifUrl });

  res.json({ success: true });
});

// LOGIN
app.post("/login", async (req, res) => {
  const { password, gifUrl } = req.body;
  const user = await User.findOne({ gifUrl });

  if (!user)
    return res.status(400).json({ error: "User not found with this GIF" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Wrong password" });

  const token = jwt.sign({ id: user._id }, "SECRET123");

  res.json({ token, gifUrl: user.gifUrl });
});

// VERIFY SESSION
app.get("/verify", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, "SECRET123");
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ gifUrl: user.gifUrl });
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
});

app.listen(3001, () => console.log("API OK on http://localhost:3001"));
