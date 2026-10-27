import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 1000, default: "" },
  category: { type: String, trim: true, default: "Web Development" },
  targetDate: { type: Date, default: null },
  progress: { type: Number, min: 0, max: 100, default: 0 }
}, { timestamps: true });

export default mongoose.model("Topic", topicSchema);
