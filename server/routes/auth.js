import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const makeToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
const safeUser = (u) => ({ id: u._id, name: u.name, email: u.email, focus: u.focus });

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, focus } = req.body || {};
    if (typeof name !== "string" || !name.trim() || typeof email !== "string" || !email.trim() || typeof password !== "string" || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }
    if (password.length < 8) return res.status(400).json({ message: "Use a password with at least 8 characters." });
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.findOne({ email: normalizedEmail })) return res.status(409).json({ message: "An account with this email already exists." });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash, focus: focus || "Web Development" });
    res.status(201).json({ token: makeToken(user._id.toString()), user: safeUser(user) });
  } catch (err) {
    console.error("Signup failed:", err.message);
    if (err.code === 11000) return res.status(409).json({ message: "An account with this email already exists." });
    const status = err.name === "ValidationError" ? 400 : 500;
    res.status(status).json({ message: status === 400 ? "Please check your account details and try again." : "Could not create your account." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Email and password are required." });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: "Email or password is incorrect." });
    res.json({ token: makeToken(user._id.toString()), user: safeUser(user) });
  } catch (err) {
    console.error("Login failed:", err.message);
    res.status(500).json({ message: "Could not log in right now." });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "Account not found." });
    res.json({ user: safeUser(user) });
  } catch (err) {
    console.error("Account lookup failed:", err.message);
    res.status(500).json({ message: "Could not load your account right now." });
  }
});

export default router;
