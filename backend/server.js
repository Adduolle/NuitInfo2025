const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// --- MONGODB CONNECTION ---
mongoose
  .connect(
    "mongodb+srv://project:root@cluster0.h5xccde.mongodb.net/giflogin?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- USER MODEL ---
const User = mongoose.model("User", {
  password: String,
  gifUrl: { type: String, unique: true },
  scores: {
    clickTrap: { type: Number, default: 0 },
    // D'autres jeux plus tard
  },
  description: { type: String, default: "" },
  talents: { type: [String], default: [] },
  skills: { type: [String], default: [] },
  softSkills: { type: [String], default: [] },
  projets: { type: [String], default: [] },
  passions: { type: [String], default: [] },
});

// --- REGISTER ---
app.post("/register", async (req, res) => {
  const { password, gifUrl } = req.body;

  const existing = await User.findOne({ gifUrl });
  if (existing)
    return res
      .status(400)
      .json({ error: "This GIF is already taken! Choose another one." });

  const hashed = await bcrypt.hash(password, 10);

  await User.create({ password: hashed, gifUrl, scores: { clickTrap: 0 } });

  res.json({ success: true });
});

// --- LOGIN ---
app.post("/login", async (req, res) => {
  const { password, gifUrl } = req.body;
  const user = await User.findOne({ gifUrl });

  if (!user)
    return res.status(400).json({ error: "User not found with this GIF" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Wrong password" });

  const token = jwt.sign({ id: user._id }, "SECRET123");

  res.json({ token, gifUrl: user.gifUrl, scores: user.scores });
});

// --- SAVE SCORE ---
app.post("/score", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  const { gameId, score } = req.body;

  try {
    const decoded = jwt.verify(token, "SECRET123");
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.scores) user.scores = {};

    const currentScore = user.scores[gameId] || 0;
    if (score > currentScore) {
      user.scores[gameId] = score;
      user.markModified("scores");
      await user.save();
    }

    res.json({ success: true, bestScore: user.scores[gameId] });
  } catch (e) {
    console.error(e);
    res.status(401).json({ error: "Invalid token or server error" });
  }
});

// --- VERIFY SESSION ---
app.get("/verify", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, "SECRET123");
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ gifUrl: user.gifUrl, scores: user.scores });
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// --- GET PROFILE ---
app.get("/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, "SECRET123");
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      gifUrl: user.gifUrl,
      description: user.description,
      scores: user.scores,
      skills: user.skills,
      softSkills: user.softSkills,
      projets: user.projets,
      passions: user.passions,
    });
  } catch (e) {
    console.error(e);
    res.status(401).json({ error: "Invalid token" });
  }
});

// --- UPDATE PROFILE ---
app.put("/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  const { description, skills, softSkills, projets, passions } = req.body;

  try {
    const decoded = jwt.verify(token, "SECRET123");
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (description !== undefined) user.description = description;
    if (skills !== undefined) user.skills = skills;
    if (softSkills !== undefined) user.softSkills = softSkills;
    if (projets !== undefined) user.projets = projets;
    if (passions !== undefined) user.passions = passions;

    await user.save();

    res.json({
      success: true,
      gifUrl: user.gifUrl,
      description: user.description,
      skills: user.skills,
      softSkills: user.softSkills,
      projets: user.projets,
      passions: user.passions,
    });
  } catch (e) {
    console.error(e);
    res.status(401).json({ error: "Invalid token" });
  }
});

// --- START SERVER ---
app.listen(3001, () => console.log("API OK on http://localhost:3001"));
