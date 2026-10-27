import { Router } from "express";
import Topic from "../models/Topic.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const topics = await Topic.find({ user: req.userId }).sort({ updatedAt: -1 });
    res.json({ topics });
  } catch (err) {
    console.error("Topic lookup failed:", err.message);
    res.status(500).json({ message: "Could not load your study tasks." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, description, category, targetDate, progress } = req.body || {};
    if (typeof name !== "string" || !name.trim()) return res.status(400).json({ message: "Topic name is required." });
    if (description !== undefined && typeof description !== "string") {
      return res.status(400).json({ message: "Task notes must be text." });
    }
    if (category !== undefined && typeof category !== "string") {
      return res.status(400).json({ message: "Subject must be text." });
    }
    const numericProgress = progress === undefined ? 0 : Number(progress);
    if (!Number.isFinite(numericProgress)) return res.status(400).json({ message: "Progress must be a number." });
    const topic = await Topic.create({
      user: req.userId, name: name.trim(), description: description || "",
      category: category || "Web Development", targetDate: targetDate || null,
      progress: Math.min(100, Math.max(0, numericProgress))
    });
    res.status(201).json({ topic });
  } catch (err) {
    console.error("Topic creation failed:", err.message);
    const status = err.name === "ValidationError" || err.name === "CastError" ? 400 : 500;
    res.status(status).json({ message: status === 400 ? "Check the task details and try again." : "Could not create topic." });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const allowed = ["name", "description", "category", "targetDate", "progress"];
    const updates = {};
    for (const key of allowed) if (key in (req.body || {})) updates[key] = req.body[key];
    if (Object.keys(updates).length === 0) return res.status(400).json({ message: "Add at least one task detail to update." });
    if (updates.name !== undefined && (typeof updates.name !== "string" || !updates.name.trim())) {
      return res.status(400).json({ message: "Topic name is required." });
    }
    if (updates.description !== undefined && typeof updates.description !== "string") {
      return res.status(400).json({ message: "Task notes must be text." });
    }
    if (updates.category !== undefined && typeof updates.category !== "string") {
      return res.status(400).json({ message: "Subject must be text." });
    }
    if (updates.progress !== undefined) {
      const progress = Number(updates.progress);
      if (!Number.isFinite(progress)) return res.status(400).json({ message: "Progress must be a number." });
      updates.progress = Math.min(100, Math.max(0, progress));
    }
    const topic = await Topic.findOneAndUpdate({ _id: req.params.id, user: req.userId }, updates, { new: true, runValidators: true });
    if (!topic) return res.status(404).json({ message: "Topic not found." });
    res.json({ topic });
  } catch (err) {
    console.error("Topic update failed:", err.message);
    res.status(400).json({ message: "Could not update topic. Check the details and try again." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const topic = await Topic.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!topic) return res.status(404).json({ message: "Topic not found." });
    res.json({ message: "Topic deleted." });
  } catch (err) {
    console.error("Topic deletion failed:", err.message);
    res.status(400).json({ message: "Could not delete topic." });
  }
});

export default router;
