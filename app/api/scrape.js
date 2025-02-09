import puppeteer from "puppeteer";
import { dbConnect } from "../../lib/db.js";
import { Word } from "../../lib/wordmodel.js";
import cron from "node-cron";

export const scrapeWord = async () => {
  console.log("✅ Scraper started...");

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  try {
    const url = "https://www.merriam-webster.com/";
    console.log(`🔍 Visiting: ${url}`);

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // Extract all words from the list
    const words = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".topten li .word-text"))
        .map((el) => el.textContent.trim())
        .filter((word) => word);
    });

    if (!words.length) {
      console.log("❌ No words found.");
      await browser.close();
      return;
    }

    console.log(`✅ Extracted words: ${words.join(", ")}`);

    await dbConnect();

    for (const word of words) {
      await page.goto(`https://www.merriam-webster.com/dictionary/${word}`, {
        waitUntil: "domcontentloaded",
      });

      let meaning = await page.evaluate(() => {
        const element = document.querySelector(".dtText");
        return element ? element.textContent.trim() : "/";
      });
      const rawPronunciation = await page.evaluate(() => {
        const element = document.querySelector(".play-pron-v2"); // Adjust selector if needed
        return element ? element.textContent.trim() : null;
      });

      const pronounciation = rawPronunciation
        ? rawPronunciation.split("How")[0].trim()
        : word;
      if (!meaning) {
        console.log(`⚠️ No meaning found for ${word}`);
        continue;
      }
      const pronunciationPage = `https://howjsay.com/how-to-pronounce-${word}`;
      console.log(pronunciationPage);
      await page.goto(pronunciationPage, { waitUntil: "domcontentloaded" });

      const pronunciationAudioUrl = await page.evaluate(() => {
        const audioSource = document.querySelector(".alphContain audio source");
        return audioSource ? audioSource.getAttribute("src") : null;
      });

      if (!pronunciationAudioUrl) {
        console.log("❌ No pronunciation audio found.");
      } else {
        console.log(`✅ Pronunciation Audio URL: ${pronunciationAudioUrl}`);
      }

      // Remove all content inside brackets (both () and [])
      meaning = meaning.replace(/\([^)]*\)|\[[^\]]*\]/g, "").trim();

      const existingWord = await Word.findOne({ word });
      if (!existingWord) {
        await Word.create({ word, meaning, pronounciation,audiourl:pronunciationAudioUrl });
        console.log(`✅ Saved: ${word} -> ${meaning} -> ${pronounciation}`);
      } else {
        console.log(`⚠️ Word already exists: ${word}`);
      }
    }
  } catch (error) {
    console.error("🚨 Error in scraper:", error);
  } finally {
    await browser.close();
  }
};

// ✅ Call `scrapeWord` directly (No `req` or `res`)
scrapeWord();

cron.schedule("*/2 * * * *", () => {
  console.log("🔄 Running scraper job...");
  scrapeWord();
});
