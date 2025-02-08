import puppeteer from "puppeteer";
import { dbConnect } from "../../lib/db.js";
import { Word } from "../../lib/wordmodel.js";
import cron from "node-cron";

export const scrapeWord = async () => {
  console.log("✅ Scraper started...");

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox","--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  try {
    const url = "https://www.merriam-webster.com/";
    console.log(`🔍 Visiting: ${url}`);

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    const word = await page.evaluate(() => {
      const element = document.querySelector(".topten li .word-text");
      return element ? element.textContent.trim() : null;
    });

    if (!word) {
      console.log("❌ No word found.");
      await browser.close();
      return;
    }

    console.log(`✅ Extracted word: ${word}`);

    await page.goto(`https://www.merriam-webster.com/dictionary/${word}`, {
      waitUntil: "domcontentloaded",
    });

    const meaning = await page.evaluate(() => {
      const element = document.querySelector(".dtText");
      return element ? element.textContent.trim() : null;
    });

    if (!meaning) {
      console.log("❌ No meaning found.");
      await browser.close();
      return;
    }

    console.log(`✅ Meaning: ${meaning}`);

    await dbConnect();

    const existingWord = await Word.findOne({ word });
    if (!existingWord) {
      await Word.create({ word, meaning });
      console.log("✅ Word saved to database.");
    } else {
      console.log("⚠️ Word already exists.");
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
