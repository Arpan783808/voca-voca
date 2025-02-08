import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  toggleSize: (isMinimized) => ipcRenderer.send("toggle-size", isMinimized),
});
