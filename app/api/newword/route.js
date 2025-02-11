import { dbConnect } from "../../../lib/db.js";
import { Word } from "../../../lib/wordmodel.js";

export async function POST(req, res) {
  await dbConnect();
  const randomWord = await Word.aggregate([{ $sample: { size: 1 } }]);

  if (randomWord.length === 0) {
    return res.status(404).json({ error: "No words in database" });
  }
  return new Response(JSON.stringify(randomWord), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
