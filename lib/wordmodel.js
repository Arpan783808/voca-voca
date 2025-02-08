import mongoose from "mongoose";

const WordSchema = new mongoose.Schema({
  word: { type: String, required: true, unique: true },
  meaning: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Word = mongoose.models.Word || mongoose.model("Word", WordSchema);
