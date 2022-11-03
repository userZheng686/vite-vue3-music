var import_electron = require("electron");
var import_lyric = require("./lyric.js");
var import_mini = require("./mini.js");
import_electron.contextBridge.exposeInMainWorld("desktopMainAPI", {
  notification: (title, body, status) => import_electron.ipcRenderer.invoke("notification", { title, body, status }),
  hide: () => import_electron.ipcRenderer.send("mainHide"),
  show: () => import_electron.ipcRenderer.send("mainShow"),
  minimize: () => import_electron.ipcRenderer.send("minimize"),
  revivification: () => import_electron.ipcRenderer.send("revivification"),
  href: (url) => import_electron.ipcRenderer.send("href", url),
  close: () => import_electron.ipcRenderer.send("close"),
  openPath: (path) => import_electron.ipcRenderer.send("openPath", path),
  openPathFolder: (path) => import_electron.ipcRenderer.send("openPathFolder", path),
  exit: () => import_electron.ipcRenderer.send("exit")
});
import_electron.contextBridge.exposeInMainWorld("readAPI", {
  readDir: (path) => import_electron.ipcRenderer.invoke("readDir", path),
  readFileMusic: (filePath) => import_electron.ipcRenderer.invoke("readFileMusic", filePath),
  readFileMV: (filePath) => import_electron.ipcRenderer.invoke("readFileMV", filePath),
  readMusic: (filePath) => import_electron.ipcRenderer.invoke("identify", filePath),
  write163Key: (filePath, obj) => import_electron.ipcRenderer.invoke("write163Key", filePath, obj)
});
import_electron.contextBridge.exposeInMainWorld("folderAPI", {
  getUserScanFolder: () => import_electron.ipcRenderer.invoke("getUserScanFolder"),
  setUserScanFolder: (path) => import_electron.ipcRenderer.invoke("setUserScanFolder", path),
  getUserCheckScanFolder: () => import_electron.ipcRenderer.invoke("getUserCheckScanFolder"),
  setUserCheckScanFolder: (path) => import_electron.ipcRenderer.invoke("setUserCheckScanFolder", path),
  openFolder: () => import_electron.ipcRenderer.invoke("openFolder"),
  openSong: () => import_electron.ipcRenderer.invoke("openSong")
});
import_electron.contextBridge.exposeInMainWorld("cookieAPI", {
  getCookie: () => import_electron.ipcRenderer.invoke("getCookie"),
  setCookie: () => import_electron.ipcRenderer.invoke("getDownloadSongs")
});
import_electron.contextBridge.exposeInMainWorld("downloadAPI", {
  getAllSong163Key: () => import_electron.ipcRenderer.invoke("getAllSong163Key"),
  getSong163Key: (filePath) => import_electron.ipcRenderer.invoke("getSong163Key", filePath),
  clear163key: () => import_electron.ipcRenderer.invoke("clear163key"),
  getCustomDownload: (type) => import_electron.ipcRenderer.invoke("getCustomDownload", type),
  patchUpdateCustomDownload: (type, list) => import_electron.ipcRenderer.invoke("patchUpdateCustomDownload", type, list),
  getDownloadSongs: () => import_electron.ipcRenderer.invoke("getDownloadSongs"),
  getDownloadPath: () => import_electron.ipcRenderer.invoke("getDownloadPath"),
  clearCustomDownload: (type) => import_electron.ipcRenderer.invoke("clearCustomDownload", type),
  clearDownloadSongs: () => import_electron.ipcRenderer.invoke("clearDownloadSongs"),
  setDownloadSongs: (ids) => import_electron.ipcRenderer.invoke("setDownloadSongs", ids),
  downloadSong: (path, param) => import_electron.ipcRenderer.invoke("downloadSong", path, param),
  downloadMV: (path, param) => import_electron.ipcRenderer.invoke("downloadMV", path, param),
  pause: (type, url) => import_electron.ipcRenderer.invoke("pause", type, url),
  resume: (type, url) => import_electron.ipcRenderer.invoke("resume", type, url),
  clear: (url) => import_electron.ipcRenderer.invoke("clear", url),
  getHistroyDownloadInterrupted: () => import_electron.ipcRenderer.invoke("getHistroyDownloadInterrupted"),
  clearAllHistoryDownloadInterrupted: () => import_electron.ipcRenderer.invoke("clearAllHistoryDownloadInterrupted"),
  resumeInterrupted: (item) => import_electron.ipcRenderer.invoke("resumeInterrupted", item)
});
import_electron.ipcRenderer.on("downloadUtil", (e, value) => {
  console.log("value", value);
});
let downloadParam;
let openFileCallback;
let updateSongProgressCallback;
let updateMVProgressCallback;
let completeSongDownloadCallback;
let completeMVDownloadCallback;
let cancelSongDownloadCallback;
let cancelMVDownloadCallback;
let prevCallback;
let pauseCallback;
let playCallback;
let nextCallback;
let onProgressSong = () => {
  if (Object.keys(downloadParam).length) {
    updateSongProgressCallback(downloadParam);
  }
};
let onCompleteSong = () => {
  if (Object.keys(downloadParam).length) {
    completeSongDownloadCallback(downloadParam);
  }
};
let onCancelSong = () => {
  cancelSongDownloadCallback(downloadParam);
};
let onProgressMV = () => {
  if (Object.keys(downloadParam).length) {
    updateMVProgressCallback(downloadParam);
  }
};
let onCompleteMV = () => {
  if (Object.keys(downloadParam).length) {
    completeMVDownloadCallback(downloadParam);
  }
};
let onCancelMV = () => {
  cancelMVDownloadCallback(downloadParam);
};
import_electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  openFile: (f) => openFileCallback = f,
  updateSongProgress: (f) => updateSongProgressCallback = f,
  completeSongDownload: (f) => completeSongDownloadCallback = f,
  cancelSongDownload: (f) => cancelSongDownloadCallback = f,
  updateMVProgress: (f) => updateMVProgressCallback = f,
  completeMVDownload: (f) => completeMVDownloadCallback = f,
  cancelMVDownload: (f) => cancelMVDownloadCallback = f,
  prev: (f) => prevCallback = f,
  play: (f) => playCallback = f,
  pause: (f) => pauseCallback = f,
  next: (f) => nextCallback = f,
  updateStatus: (status) => import_electron.ipcRenderer.send("status", status)
});
import_electron.ipcRenderer.on("openFile", (e, value) => {
  let result = JSON.parse(value);
  openFileCallback && openFileCallback(result);
  console.log("result", result);
});
import_electron.ipcRenderer.on("prev", (e, value) => {
  prevCallback && prevCallback();
  console.log("prev");
});
import_electron.ipcRenderer.on("play", (e, value) => {
  playCallback && playCallback();
  console.log("play");
});
import_electron.ipcRenderer.on("pause", (e, value) => {
  pauseCallback && pauseCallback();
  console.log("pause");
});
import_electron.ipcRenderer.on("next", (e, value) => {
  nextCallback && nextCallback();
  console.log("next");
});
import_electron.ipcRenderer.on("updateSongDownloadProgressing", (e, value) => {
  downloadParam = JSON.parse(value);
  onProgressSong();
});
import_electron.ipcRenderer.on("completeSongDownload", (e, value) => {
  downloadParam = JSON.parse(value);
  onCompleteSong();
});
import_electron.ipcRenderer.on("cancelSongDownload", (e, value) => {
  downloadParam = value;
  onCancelSong();
});
import_electron.ipcRenderer.on("updateMVDownloadProgressing", (e, value) => {
  downloadParam = JSON.parse(value);
  onProgressMV();
});
import_electron.ipcRenderer.on("completeMVDownload", (e, value) => {
  downloadParam = JSON.parse(value);
  onCompleteMV();
});
import_electron.ipcRenderer.on("cancelMVDownload", (e, value) => {
  downloadParam = value;
  onCancelMV();
});
