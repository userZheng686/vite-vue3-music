var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var stdin_exports = {};
__export(stdin_exports, {
  clear163key: () => clear163key,
  clearAllHistoryDownloadInterrupted: () => clearAllHistoryDownloadInterrupted,
  clearCustomDownload: () => clearCustomDownload,
  clearDownloadMVs: () => clearDownloadMVs,
  clearDownloadSongs: () => clearDownloadSongs,
  clearHistroyDownloadInterrupted: () => clearHistroyDownloadInterrupted,
  getAllSong163Key: () => getAllSong163Key,
  getCookie: () => getCookie,
  getCustomDownload: () => getCustomDownload,
  getDownloadMVPath: () => getDownloadMVPath,
  getDownloadMVs: () => getDownloadMVs,
  getDownloadPath: () => getDownloadPath,
  getDownloadSongs: () => getDownloadSongs,
  getDownloadVoicePath: () => getDownloadVoicePath,
  getHistroyDownloadInterrupted: () => getHistroyDownloadInterrupted,
  getSong163Key: () => getSong163Key,
  getUserCheckScanFolder: () => getUserCheckScanFolder,
  getUserScanFolder: () => getUserScanFolder,
  patchUpdateCustomDownload: () => patchUpdateCustomDownload,
  setCookie: () => setCookie,
  setCustomDownload: () => setCustomDownload,
  setDownloadMVs: () => setDownloadMVs,
  setDownloadPath: () => setDownloadPath,
  setDownloadSongs: () => setDownloadSongs,
  setDownloadVoices: () => setDownloadVoices,
  setHistroyDownloadInterrupted: () => setHistroyDownloadInterrupted,
  setSong163Key: () => setSong163Key,
  setUserCheckScanFolder: () => setUserCheckScanFolder,
  setUserScanFolder: () => setUserScanFolder
});
module.exports = __toCommonJS(stdin_exports);
var import_electron = require("electron");
var import_fs = __toESM(require("fs"));
var import_electron_store = __toESM(require("electron-store"));
let option = {
  name: "config",
  fileExtension: "json",
  cwd: import_electron.app.getPath("userData"),
  clearInvalidConfig: true
};
const store = new import_electron_store.default(option);
function setDownloadSongs(ids) {
  let downloadIds = store.get("downloadSongId") || [];
  downloadIds.push(...ids);
  downloadIds = Array.from(new Set(downloadIds));
  store.set("downloadSongId", downloadIds);
}
function getDownloadSongs() {
  return store.get("downloadSongId") || [];
}
function clearDownloadSongs() {
  store.set("downloadSongId", []);
}
function setDownloadVoices(ids) {
  let downloadIds = store.get("downloadVoiceId") || [];
  downloadIds.push(...ids);
  downloadIds = Array.from(new Set(downloadIds));
  store.set("downloadVoiceId", downloadIds);
}
function setDownloadMVs(ids) {
  let downloadIds = store.get("downloadMVId") || [];
  downloadIds.push(...ids);
  downloadIds = Array.from(new Set(downloadIds));
  store.set("downloadMVId", downloadIds);
}
function getDownloadMVs() {
  return store.get("downloadMVId") || [];
}
function clearDownloadMVs() {
  store.set("downloadMVId", []);
}
function setCustomDownload(type, item) {
  if (type === 1) {
    let songDownload = store.get("songDownload") || [];
    let songIndex = songDownload.findIndex((song) => song.id === item.id);
    if (songIndex === -1) {
      songDownload.push(item);
    }
    store.set("songDownload", songDownload);
  } else if (type === 2) {
    let voiceDownload = store.get("voiceDownload") || [];
    let voiceIndex = voiceDownload.findIndex((song) => song.id === item.id);
    if (voiceIndex === -1) {
      voiceDownload.push(item);
    }
    store.set("voiceDownload", voiceDownload);
  } else if (type === 3) {
    let songDownload = store.get("mvDownload") || [];
    songDownload.push(item);
    store.set("mvDownload", songDownload);
  }
}
function patchUpdateCustomDownload(type, list) {
  if (type === 1) {
    store.set("songDownload", list);
  } else if (type === 2) {
    store.set("voiceDownload", list);
  } else if (type === 3) {
    store.set("mvDownload", list);
  }
}
function getCustomDownload(type) {
  if (type === 1) {
    return store.get("songDownload");
  } else if (type === 2) {
    return store.get("voiceDownload");
  } else if (type === 3) {
    return store.get("mvDownload");
  }
}
function clearCustomDownload(type) {
  if (type === 1) {
    store.set("songDownload", []);
  } else if (type === 2) {
    store.set("voiceDownload", []);
  } else if (type === 3) {
    store.set("mvDownload", []);
  }
}
function setHistroyDownloadInterrupted(downloadParam) {
  let historyDownloadInterrupted = store.get("historyDownloadInterrupted");
  if (!historyDownloadInterrupted) {
    historyDownloadInterrupted = store.set("historyDownloadInterrupted", []);
  }
  let { fileName } = downloadParam;
  let fileNameIndex = historyDownloadInterrupted.findIndex((item) => {
    return item.fileName === fileName;
  });
  if (fileNameIndex === -1) {
    historyDownloadInterrupted.push(downloadParam);
  } else {
    historyDownloadInterrupted[fileNameIndex] = downloadParam;
  }
  store.set("historyDownloadInterrupted", historyDownloadInterrupted);
}
function clearHistroyDownloadInterrupted(fileName) {
  let historyDownloadInterrupted = getHistroyDownloadInterrupted();
  let fileNameIndex = historyDownloadInterrupted.findIndex((item) => {
    return item.fileName === fileName;
  });
  historyDownloadInterrupted.splice(fileNameIndex, 1);
  store.set("historyDownloadInterrupted", historyDownloadInterrupted);
}
function getHistroyDownloadInterrupted() {
  return store.get("historyDownloadInterrupted");
}
function clearAllHistoryDownloadInterrupted() {
  store.set("historyDownloadInterrupted", []);
}
function setDownloadPath(path) {
  store.set("downloadPath", path);
}
function getDownloadPath() {
  let downloadPath = store.get("downloadPath") || "D:\\CloudMusic";
  if (downloadPath) {
    setDownloadPath(`D:\\CloudMusic`);
  }
  return downloadPath;
}
function getDownloadVoicePath() {
  let normalDownloadPath = getDownloadPath();
  let voiceDownloadPath = normalDownloadPath + "\\\u7535\u53F0\u8282\u76EE";
  if (import_fs.default.existsSync(voiceDownloadPath)) {
    return voiceDownloadPath;
  } else {
    import_fs.default.mkdirSync(voiceDownloadPath);
    return voiceDownloadPath;
  }
}
function getDownloadMVPath() {
  let normalDownloadPath = getDownloadPath();
  let mvDownloadPath = normalDownloadPath + "\\MV";
  if (import_fs.default.existsSync(mvDownloadPath)) {
    return mvDownloadPath;
  } else {
    import_fs.default.mkdirSync(mvDownloadPath);
    return mvDownloadPath;
  }
}
function setCookie(cookie) {
  store.set("cookie", cookie);
  return cookie;
}
function getCookie() {
  return store.get("cookie");
}
function setUserScanFolder(path) {
  let scanDir = store.get("userScanFolder") || [];
  scanDir.push(path);
  store.set("userScanFolder", scanDir);
}
function getUserScanFolder() {
  return store.get("userScanFolder") || [];
}
function setUserCheckScanFolder(path) {
  store.set("userCheckScanFolder", path);
}
function getUserCheckScanFolder() {
  return store.get("userCheckScanFolder") || [];
}
function setSong163Key(filePath, key) {
  let song163Key = store.get("song163Key");
  if (!song163Key) {
    store.set("song163Key", {});
    song163Key = {};
  }
  song163Key[filePath] = key;
  store.set("song163Key", song163Key);
}
function clear163key() {
  store.set("song163Key", {});
  return getAllSong163Key();
}
function getAllSong163Key() {
  return store.get("song163Key");
}
function getSong163Key(filePath) {
  let song163Key = store.get("song163Key");
  if (Object.keys(song163Key).length) {
    return song163Key[filePath];
  } else {
    return null;
  }
}
