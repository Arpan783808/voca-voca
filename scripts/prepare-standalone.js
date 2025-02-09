import { copyFileSync, mkdirSync } from "fs";
import path from "path";

const standalonePath = path.join(".next", "standalone");
const targetPath = path.join("electron", "standalone");

// Ensure target directory exists
mkdirSync(targetPath, { recursive: true });

// Copy necessary files
copyFileSync(path.join(standalonePath, "server.js"), path.join(targetPath, "server.js"));
copyFileSync("package.json", path.join(targetPath, "package.json"));

console.log("✅ Next.js standalone files prepared.");
