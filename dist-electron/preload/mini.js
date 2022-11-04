var import_electron = require("electron");
import_electron.contextBridge.exposeInMainWorld("desktopMiniAPI", {
  show: () => import_electron.ipcRenderer.send("miniShow"),
  hide: () => import_electron.ipcRenderer.send("miniHide"),
  getBounds: async () => await import_electron.ipcRenderer.invoke("miniGetBounds"),
  setSize: async (width, height) => await import_electron.ipcRenderer.invoke("miniSetSize", { width, height }),
  setBounds: async (x, y, width, height) => await import_electron.ipcRenderer.invoke("miniSetBounds", x, y, width, height)
});
