import { dbConnect } from "../../../lib/db.js";
import { Word } from "../../../lib/wordmodel.js";

export async function POST(req, res) {
  await dbConnect();
  const word = await Word.findOne().sort({ createdAt: -1 });
  if (!word) return res.status(404).json({ error: "No words in database" });
  console.log("word deleted:",word);
  await Word.findByIdAndDelete(word._id);
  const newword = await Word.findOne().sort({ createdAt: -1 });
  if (!newword) return res.status(404).json({ error: "No words in database" });
  return new Response(JSON.stringify(newword), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
