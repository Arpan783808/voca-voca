import { app, BrowserWindow } from "electron";
import path from "path";
import { spawn } from "child_process";
import { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import net from "net";

const __dirname = dirname(fileURLToPath(import.meta.url));

// 🔹 Load `.env` file
const envPath = app.isPackaged
  ? path.join(process.resourcesPath, ".env")
  : path.join(__dirname, "../.env");

dotenv.config({ path: envPath });

console.log("Environment:", process.env.NODE_ENV);

let mainWindow;
let nextProcess;
const isDev = !app.isPackaged;

app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

const checkNextServer = (port, retries = 10) => {
  return new Promise((resolve) => {
    const tryConnect = (attemptsLeft) => {
      const socket = net.createConnection(port, "localhost");

      socket.on("connect", () => {
        socket.end();
        resolve(true);
      });

      socket.on("error", () => {
        if (attemptsLeft > 0) {
          setTimeout(() => tryConnect(attemptsLeft - 1), 1000);
        } else {
          resolve(false);
        }
      });
    };

    tryConnect(retries);
  });
};

const startNextServer = async () => {
  const nextPort = 3000;
  const command = isDev ? "npm" : "node";
  const args = isDev ? ["run", "dev"] : [".next/standalone/server.js"];
  const options = { cwd: path.join(__dirname, ".."), shell: true };

  console.log(`🚀 Starting Next.js (${isDev ? "development" : "production"})...`);
  nextProcess = spawn(command, args, options);

  nextProcess.stdout.on("data", (data) => console.log(`[Next.js] ${data}`));
  nextProcess.stderr.on("data", (data) => console.error(`[Next.js Error] ${data}`));

  nextProcess.on("exit", (code) => {
    console.log(`⚠️ Next.js process exited with code ${code}`);
    nextProcess = null;
  });

  console.log("⌛ Waiting for Next.js server to be ready...");
  const isReady = await checkNextServer(nextPort);

  if (isReady) {
    console.log("✅ Next.js server is ready!");
  } else {
    console.error("❌ Next.js server failed to start.");
  }
};


app.whenReady().then(async () => {
  await startNextServer();

  mainWindow = new BrowserWindow({
    width: 250,
    height: 120,
    minWidth: 250,
    minHeight: 120,
    maxWidth: 250,
    maxHeight: 150,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL("http://localhost:3000");

  mainWindow.on("closed", () => {
    mainWindow = null;
    if (nextProcess) nextProcess.kill();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (nextProcess) nextProcess.kill();
    app.quit();
  }
});
