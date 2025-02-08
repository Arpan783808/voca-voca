import { dbConnect } from "../../../lib/db.js";
import { Word } from "../../../lib/wordmodel.js";

export async function GET(req, res) {
  console.log(req.method);
  await dbConnect();
  const word = await Word.findOne().sort({ createdAt: -1 }); // Get last word
  if (!word) return res.status(404).json({ error: "No words in database" });
  return new Response(JSON.stringify(word), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
