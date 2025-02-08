import { app, BrowserWindow} from "electron";
import path from "path";

let mainWindow;
import { dirname } from "path";
import { fileURLToPath } from "url";

// Define __dirname manually
const __dirname = dirname(fileURLToPath(import.meta.url));

app.whenReady().then(() => {
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
      nodeIntegration: false, // Disable for security
      contextIsolation: true
    },
  });

  mainWindow.loadURL("http://localhost:3000");

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

});
