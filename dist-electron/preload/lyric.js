var import_electron = require("electron");
import_electron.contextBridge.exposeInMainWorld("desktopLyricAPI", {
  show: () => import_electron.ipcRenderer.send("lyricShow"),
  hide: () => import_electron.ipcRenderer.send("lyricHide"),
  getBounds: async () => await import_electron.ipcRenderer.invoke("lyricGetBounds"),
  setSize: async (width, height) => await import_electron.ipcRenderer.invoke("lyricSetSize", { width, height }),
  setBounds: async (x, y, width, height) => await import_electron.ipcRenderer.invoke("lyricSetBounds", x, y, width, height)
});
