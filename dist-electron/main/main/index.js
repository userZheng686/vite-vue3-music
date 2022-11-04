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
  default: () => stdin_default
});
module.exports = __toCommonJS(stdin_exports);
var import_electron = require("electron");
var import_path = __toESM(require("path"));
var import_read = require("./read");
var import_folder = require("./folder");
var import_download = require("./download");
var import_store = require("./store");
const winURL = `https://localhost:4000/#/findMusic`;
let downloadQueue = {};
let win;
let playStatus = false;
let offline = false;
let icoIcon = !import_electron.app.isPackaged ? import_path.default.join(__dirname, "../../../public/icon.ico") : import_path.default.join(__dirname, "../../../dist/icon.ico");
let prevIcon = !import_electron.app.isPackaged ? import_path.default.join(__dirname, "../../../public/ic_previous.png") : import_path.default.join(__dirname, "../../../dist/ic_previous.png");
let playIcon = !import_electron.app.isPackaged ? import_path.default.join(__dirname, "../../../public/ic_play.png") : import_path.default.join(__dirname, "../../../dist/ic_play.png");
let pauseIcon = !import_electron.app.isPackaged ? import_path.default.join(__dirname, "../../../public/ic_pause.png") : import_path.default.join(__dirname, "../../../dist/ic_pause.png");
let nextIcon = !import_electron.app.isPackaged ? import_path.default.join(__dirname, "../../../public/ic_next.png") : import_path.default.join(__dirname, "../../../dist/ic_next.png");
const setThumbarButtons = () => {
  win.setThumbarButtons([
    {
      tooltip: "\u4E0A\u4E00\u66F2",
      icon: import_electron.nativeImage.createFromPath(prevIcon),
      click() {
        win.webContents.send("prev");
      }
    },
    {
      tooltip: playStatus ? "\u6682\u505C" : "\u64AD\u653E",
      icon: playStatus ? import_electron.nativeImage.createFromPath(pauseIcon) : import_electron.nativeImage.createFromPath(playIcon),
      click() {
        if (playStatus) {
          win.webContents.send("pause");
        } else {
          win.webContents.send("play");
        }
      }
    },
    {
      tooltip: "\u4E0B\u4E00\u66F2",
      icon: import_electron.nativeImage.createFromPath(nextIcon),
      click() {
        win.webContents.send("next");
      }
    }
  ]);
};
const createMainWindow = (browserWindow) => {
  const obj = {
    autoHideMenuBar: false,
    frame: false,
    width: 1022,
    show: false,
    height: 670,
    backgroundColor: "white",
    fullscreen: false,
    fullscreenable: true,
    minWidth: 1022,
    minHeight: 670,
    resizable: true,
    movable: true,
    closable: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      devTools: true,
      webSecurity: false,
      preload: import_path.default.join(__dirname, "../../preload/index.js")
    },
    minimizable: true,
    maximizable: true,
    icon: import_electron.nativeImage.createFromPath(icoIcon),
    titleBarStyle: "hiddenInset"
  };
  win = new import_electron.BrowserWindow(obj);
  if (import_electron.app.isPackaged) {
    win.loadFile(import_path.default.join(__dirname, "../../../dist/index.html"), {
      hash: "findMusic"
    });
    win.webContents.openDevTools();
  } else {
    win.loadURL(winURL);
    win.webContents.openDevTools();
  }
  win.setThumbnailToolTip("\u7F51\u6613\u4E91\u97F3\u4E50");
  win.setMenu(null);
  win.setMovable(true);
  win.once("ready-to-show", () => {
    setTimeout(() => {
      global.loadingWindow.hide();
      win.show();
      setThumbarButtons();
    }, 2e3);
  });
  return win;
};
import_electron.app.on("open-file", async (event, path2) => {
  event.preventDefault();
  let result = await (0, import_read.readFileMusic)(path2);
  win.webContents.send("openFile", JSON.stringify(result));
});
import_electron.app.on("second-instance", async (event, argv) => {
  event.preventDefault();
  let result = await (0, import_read.readFileMusic)(argv[argv.length - 1]);
  win.webContents.send("openFile", JSON.stringify(result));
});
import_electron.app.whenReady().then(() => {
  import_electron.ipcMain.on("mainHide", () => {
    win.hide();
  });
  import_electron.ipcMain.on("mainShow", () => {
    win.show();
    win.focus();
  });
  import_electron.ipcMain.on("mainFocus", () => {
    win.focus();
  });
  import_electron.ipcMain.on("minimize", () => {
    console.log("minimize");
    win.minimize();
  });
  import_electron.ipcMain.on("revivification", () => {
    let isMaxImized = win.isMaximized();
    if (isMaxImized) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });
  import_electron.ipcMain.on("close", () => {
    win.hide();
  });
  import_electron.ipcMain.on("href", (event, url) => {
    import_electron.shell.openExternal(url);
  });
  import_electron.ipcMain.on("status", (event, status) => {
    playStatus = status;
    setThumbarButtons();
  });
  import_electron.ipcMain.handle("notification", (event, option) => {
    if (offline === option.status) {
      return;
    }
    offline = option.status;
    new import_electron.Notification({ title: option.title, body: option.body, icon: import_electron.nativeImage.createFromPath(icoIcon) }).show();
  });
  import_electron.ipcMain.handle("readDir", async (event, path2) => {
    const file = await (0, import_read.readDir)(path2);
    return file;
  });
  import_electron.ipcMain.handle("readFileMusic", async (event, filePath) => {
    const file = await (0, import_read.readFileMusic)(filePath);
    return file;
  });
  import_electron.ipcMain.handle("readFileMV", async (event, filePath) => {
    const file = await (0, import_read.readFileMV)(filePath);
    return file;
  });
  import_electron.ipcMain.handle("write163Key", async (event, filePath, obj) => {
    const file = await (0, import_read.encode163Key)(filePath, JSON.parse(obj));
    return file;
  });
  import_electron.ipcMain.handle("getAllSong163Key", () => {
    return (0, import_store.getAllSong163Key)();
  });
  import_electron.ipcMain.handle("getSong163Key", (event, filePath) => {
    return (0, import_store.getSong163Key)(filePath);
  });
  import_electron.ipcMain.handle("clear163key", () => {
    return (0, import_store.clear163key)();
  });
  import_electron.ipcMain.handle("openFolder", async (event, title) => {
    let folderPath = await (0, import_folder.openFolder)(title);
    return folderPath;
  });
  import_electron.ipcMain.on("openPath", (event, path2) => {
    import_electron.shell.openPath(path2);
  });
  import_electron.ipcMain.on("openPathFolder", (event, path2) => {
    import_electron.shell.showItemInFolder(path2);
  });
  import_electron.ipcMain.handle("openSong", async (event) => {
    let folderPath = await (0, import_folder.openSong)();
    return folderPath;
  });
  import_electron.ipcMain.handle("getCookie", async (event) => {
    let cookie = (0, import_store.getCookie)();
    return cookie;
  });
  import_electron.ipcMain.handle("setCookie", (event, cookie) => {
    let cookies = (0, import_store.setCookie)(cookie);
    return cookies;
  });
  import_electron.ipcMain.handle("setDownloadSongs", (event, ids) => {
    (0, import_store.setDownloadSongs)(ids);
  });
  import_electron.ipcMain.handle("getDownloadSongs", (event) => {
    let ids = (0, import_store.getDownloadSongs)();
    return ids;
  });
  import_electron.ipcMain.handle("clearDownloadSongs", (event) => {
    (0, import_store.clearDownloadSongs)();
  });
  import_electron.ipcMain.handle("getDownloadMVs", (event) => {
    let ids = (0, import_store.getDownloadMVs)();
    return ids;
  });
  import_electron.ipcMain.handle("clearDownloadMVs", (event) => {
    (0, import_store.clearDownloadMVs)();
  });
  import_electron.ipcMain.handle("getDownloadPath", (event) => {
    let path2 = (0, import_store.getDownloadPath)();
    return path2;
  });
  import_electron.ipcMain.handle("setDownloadPath", (event, path2) => {
    (0, import_store.setDownloadPath)(path2);
    (0, import_store.getDownloadVoicePath)();
    (0, import_store.getDownloadMVPath)();
  });
  import_electron.ipcMain.handle("getUserScanFolder", (event) => {
    return (0, import_store.getUserScanFolder)();
  });
  import_electron.ipcMain.handle("setUserScanFolder", (event, path2) => {
    (0, import_store.setUserScanFolder)(path2);
  });
  import_electron.ipcMain.handle("getUserCheckScanFolder", (event) => {
    return (0, import_store.getUserCheckScanFolder)();
  });
  import_electron.ipcMain.handle("setUserCheckScanFolder", (event, path2) => {
    (0, import_store.setUserCheckScanFolder)(JSON.parse(path2));
  });
  import_electron.ipcMain.handle("downloadSong", (event, url, param) => {
    downloadQueue[url] = {
      downloadParam: JSON.parse(param),
      downloadType: JSON.parse(param).type,
      downloadFileName: JSON.parse(param).item.fileName,
      downloadPath: "",
      downloadItem: null
    };
    console.log("downloadFileName", JSON.parse(param).item.fileName);
    win.webContents.downloadURL(url);
  });
  import_electron.ipcMain.handle("downloadMV", (event, url, param) => {
    downloadQueue[url] = {
      downloadParam: JSON.parse(param),
      downloadType: JSON.parse(param).type,
      downloadFileName: JSON.parse(param).item.fileName,
      downloadPath: "",
      downloadItem: null
    };
    win.webContents.downloadURL(url);
  });
  import_electron.ipcMain.handle("patchUpdateCustomDownload", (event, type, list) => {
    (0, import_store.patchUpdateCustomDownload)(type, JSON.parse(list));
  });
  import_electron.ipcMain.handle("getCustomDownload", (event, type) => {
    return (0, import_store.getCustomDownload)(type);
  });
  import_electron.ipcMain.handle("clearCustomDownload", (event, type) => {
    return (0, import_store.clearCustomDownload)(type);
  });
  import_electron.ipcMain.handle("pause", (event, type, url) => {
    var _a;
    if (type === "single" && url) {
      if (downloadQueue[url].downloadParam.item.downloadStatus === "resume" || downloadQueue[url].downloadParam.item.downloadStatus === "begin") {
        (_a = downloadQueue[url].downloadItem) == null ? void 0 : _a.pause();
        downloadQueue[url].downloadParam.item.downloadStatus = "pause";
        win.webContents.send("updateSongDownloadProgressing", JSON.stringify(downloadQueue[url].downloadParam));
      }
    } else if (type === "all") {
      console.log("queue", downloadQueue);
      Object.keys(downloadQueue).forEach((item) => {
        var _a2;
        if (downloadQueue[item].downloadParam.item.downloadStatus === "resume" || downloadQueue[item].downloadParam.item.downloadStatus === "begin") {
          (_a2 = downloadQueue[item].downloadItem) == null ? void 0 : _a2.pause();
          downloadQueue[item].downloadParam.item.downloadStatus = "pause";
          win.webContents.send("updateSongDownloadProgressing", JSON.stringify(downloadQueue[item].downloadParam));
        }
      });
    }
  });
  import_electron.ipcMain.handle("resume", (event, type, url) => {
    var _a;
    if (type === "single" && url) {
      if (downloadQueue[url].downloadParam.item.downloadStatus === "pause") {
        (_a = downloadQueue[url].downloadItem) == null ? void 0 : _a.resume();
        downloadQueue[url].downloadParam.item.downloadStatus = "resume";
        win.webContents.send("updateSongDownloadProgressing", JSON.stringify(downloadQueue[url].downloadParam));
      }
    } else if (type === "all") {
      Object.keys(downloadQueue).forEach((item) => {
        var _a2;
        if (downloadQueue[item].downloadParam.item.downloadStatus === "pause") {
          (_a2 = downloadQueue[item].downloadItem) == null ? void 0 : _a2.resume();
          downloadQueue[item].downloadParam.item.downloadStatus = "resume";
          win.webContents.send("updateSongDownloadProgressing", JSON.stringify(downloadQueue[item].downloadParam));
        }
      });
    }
  });
  import_electron.ipcMain.handle("clear", (event, url) => {
    let urls = JSON.parse(url);
    urls.forEach((item) => {
      var _a;
      if (downloadQueue[item]) {
        (_a = downloadQueue[item].downloadItem) == null ? void 0 : _a.cancel();
        if (downloadQueue[item].downloadParam.item.id) {
          win.webContents.send("cancelSongDownload", downloadQueue[item].downloadParam.item.id);
        } else if (downloadQueue[item].downloadParam.item.mvId) {
          win.webContents.send("cancelMVDownload", downloadQueue[item].downloadParam.item.mvId);
        }
        delete downloadQueue[item];
      }
    });
    (0, import_store.clearAllHistoryDownloadInterrupted)();
  });
  import_electron.ipcMain.handle("getHistroyDownloadInterrupted", () => {
    return (0, import_store.getHistroyDownloadInterrupted)();
  });
  import_electron.ipcMain.handle("clearAllHistoryDownloadInterrupted", () => {
    (0, import_store.clearAllHistoryDownloadInterrupted)();
  });
  import_electron.session.defaultSession.on("will-download", (e, item) => {
    let queueItem = downloadQueue[item.getURL()];
    if (!queueItem.downloadItem) {
      queueItem.downloadItem = item;
    }
    if (queueItem.downloadType === 1) {
      queueItem.downloadPath = import_path.default.join((0, import_store.getDownloadPath)(), queueItem.downloadFileName);
    } else if (queueItem.downloadType === 2) {
      queueItem.downloadPath = import_path.default.join((0, import_store.getDownloadVoicePath)(), queueItem.downloadFileName);
    } else if (queueItem.downloadType === 3) {
      queueItem.downloadPath = import_path.default.join((0, import_store.getDownloadMVPath)(), queueItem.downloadFileName);
    }
    console.log("path", queueItem.downloadPath);
    queueItem.downloadItem.setSavePath(queueItem.downloadPath);
    let progress = 0, prevProgress;
    queueItem.downloadItem.on("updated", (evt, state) => {
      var _a, _b;
      console.log("state", state);
      if ("progressing" === state) {
        if (item.getReceivedBytes() && item.getTotalBytes()) {
          progress = parseInt(100 * (item.getReceivedBytes() / item.getTotalBytes()));
        }
        console.log("progress", progress);
        queueItem.downloadParam.item.downloadReceivedBytes = item.getReceivedBytes() - queueItem.downloadParam.item.downloadReceivedBytes;
        if (prevProgress === progress)
          return;
        else
          prevProgress = progress;
        if (queueItem.downloadType === 1 || queueItem.downloadType === 2) {
          queueItem.downloadParam.item.progress = progress;
        } else if (queueItem.downloadType === 3) {
          queueItem.downloadParam.item.currentProgress = progress;
        }
      }
      let historyParam = {
        eTag: (_a = queueItem.downloadItem) == null ? void 0 : _a.getETag(),
        lastModified: (_b = queueItem.downloadItem) == null ? void 0 : _b.getLastModifiedTime(),
        startTime: item.getStartTime(),
        offset: item.getReceivedBytes(),
        length: item.getTotalBytes(),
        type: queueItem.downloadType,
        urlChain: item.getURLChain(),
        item: queueItem.downloadParam,
        path: queueItem.downloadPath,
        fileName: queueItem.downloadFileName
      };
      if (queueItem.downloadType === 1 || queueItem.downloadType === 2) {
        win.webContents.send("updateSongDownloadProgressing", JSON.stringify(queueItem.downloadParam));
      } else if (queueItem.downloadType === 3) {
        win.webContents.send("updateMVDownloadProgressing", JSON.stringify(queueItem.downloadParam));
      }
      (0, import_store.setHistroyDownloadInterrupted)(historyParam);
      setTimeout(() => {
      }, 300);
    });
    queueItem.downloadItem.on("done", (e2, state) => {
      if (state === "completed") {
        if (queueItem.downloadType === 1) {
          queueItem.downloadParam.item.downloadTime = new Date().getTime();
          queueItem.downloadParam.item.from.path = "\u672C\u5730";
          queueItem.downloadParam.item.songUrl = queueItem.downloadPath;
        } else if (queueItem.downloadType === 2) {
          queueItem.downloadParam.item.downloadTime = new Date().getTime();
          queueItem.downloadParam.item.from.path = "\u672C\u5730";
          queueItem.downloadParam.item.songUrl = queueItem.downloadPath;
        } else if (queueItem.downloadType === 3) {
          queueItem.downloadParam.item.videoParam[0] = queueItem.downloadPath;
        }
        queueItem.downloadParam.item.downloadStatus = "complete";
        (0, import_download.setStoreDownload)(JSON.stringify(queueItem.downloadParam));
        if (queueItem.downloadType === 1 || queueItem.downloadType === 2) {
          win.webContents.send("completeSongDownload", JSON.stringify(queueItem.downloadParam));
        } else if (queueItem.downloadType === 3) {
          win.webContents.send("completeMVDownload", JSON.stringify(queueItem.downloadParam));
        }
        (0, import_store.clearHistroyDownloadInterrupted)(queueItem.downloadParam.item.fileName);
      }
    });
    if (queueItem.downloadItem.canResume) {
      queueItem.downloadItem.resume();
    }
  });
  import_electron.ipcMain.handle("resumeInterrupted", (event, items) => {
    let { path: path2, urlChain, offset, length, lastModified, eTag, startTime, item, fileName, type } = JSON.parse(items);
    downloadQueue[urlChain[0]] = {
      downloadParam: item,
      downloadType: type,
      downloadFileName: fileName,
      downloadPath: "",
      downloadItem: null
    };
    downloadQueue[urlChain[0]].downloadParam.item.downloadStatus = "resume";
    import_electron.session.defaultSession.createInterruptedDownload({
      path: path2,
      urlChain,
      offset,
      length,
      lastModified,
      eTag,
      startTime
    });
  });
});
var stdin_default = createMainWindow;
