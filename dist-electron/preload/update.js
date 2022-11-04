var import_electron = require("electron");
let messageCallback;
import_electron.contextBridge.exposeInMainWorld("desktopUpdateAPI", {
  show: () => import_electron.ipcRenderer.send("updateShow"),
  hide: () => import_electron.ipcRenderer.send("updateHide"),
  getBounds: async () => await import_electron.ipcRenderer.invoke("updateGetBounds"),
  setSize: async (width, height) => await import_electron.ipcRenderer.invoke("updateSetSize", { width, height }),
  setBounds: async (x, y, width, height) => await import_electron.ipcRenderer.invoke("updateSetBounds", x, y, width, height),
  message: (f) => messageCallback = f,
  downloadUpdate: () => import_electron.ipcRenderer.send("downloadUpdate"),
  checkForUpdate: () => import_electron.ipcRenderer.send("checkForUpdate"),
  checkAppVersion: () => import_electron.ipcRenderer.send("checkAppVersion")
});
import_electron.ipcRenderer.on("message", (e, value) => {
  messageCallback && messageCallback(value);
});
