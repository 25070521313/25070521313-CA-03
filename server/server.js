import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import topicRoutes from "./routes/topics.js";

dotenv.config();
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error("JWT_SECRET must be set to a secret with at least 32 characters.");
  process.exit(1);
}

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok", app: "FLEXI API" }));
app.use("/api/auth", authRoutes);
app.use("/api/topics", topicRoutes);
app.use((err, _req, res, _next) => {
  console.error("Request failed:", err.message);
  const status = err.status || 500;
  res.status(status).json({
    message: status === 400 ? "Request body must be valid JSON." : "The request could not be processed."
  });
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/flexi")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`FLEXI API running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });