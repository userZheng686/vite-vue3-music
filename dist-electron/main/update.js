var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var import_electron_updater = require("electron-updater");
var import_electron = require("electron");
var import_path = __toESM(require("path"));
const message = {
  error: "\u68C0\u67E5\u66F4\u65B0\u51FA\u9519",
  checking: "\u6B63\u5728\u68C0\u67E5\u66F4\u65B0\u2026\u2026",
  updateAva: "\u68C0\u6D4B\u5230\u65B0\u7248\u672C\uFF0C\u6B63\u5728\u4E0B\u8F7D\u2026\u2026",
  updateNotAva: "\u73B0\u5728\u4F7F\u7528\u7684\u5C31\u662F\u6700\u65B0\u7248\u672C\uFF0C\u4E0D\u7528\u66F4\u65B0"
};
if (!import_electron.app.isPackaged) {
  import_electron_updater.autoUpdater.updateConfigPath = import_path.default.join(__dirname, "dev-app-update.yml");
}
const sendUpdateMessage = ({ type, text }) => {
  global.mainWindow.webContents.send("message", JSON.stringify({ type, text }));
  global.updateWindow.webContents.send("message", JSON.stringify({ type, text }));
};
import_electron_updater.autoUpdater.autoDownload = false;
import_electron_updater.autoUpdater.on("error", (error) => {
  sendUpdateMessage({
    type: "updateError",
    text: `${message.error}:${error}`
  });
});
import_electron_updater.autoUpdater.on("checking-for-update", () => {
  sendUpdateMessage({
    type: "updateChecking",
    text: message.checking
  });
});
import_electron_updater.autoUpdater.on("update-available", (info) => {
  sendUpdateMessage({
    type: "needUpdate",
    text: JSON.stringify({
      ...info,
      title: message.updateAva
    })
  });
});
import_electron_updater.autoUpdater.on("update-not-available", () => {
  sendUpdateMessage({
    type: "notUpdate",
    text: message.updateNotAva
  });
});
import_electron_updater.autoUpdater.on("download-progress", (progress) => {
  sendUpdateMessage({
    type: "progress",
    text: Number(progress.percent)
  });
});
import_electron_updater.autoUpdater.on("update-downloaded", () => {
  sendUpdateMessage({
    type: "downloaded",
    text: `\u66F4\u65B0\u4E0B\u8F7D\u5B8C\u6BD5\uFF0C\u5E94\u7528\u5C06\u91CD\u542F\u5E76\u8FDB\u884C\u5B89\u88C5`
  });
});
import_electron.ipcMain.on("checkForUpdate", () => {
  import_electron_updater.autoUpdater.checkForUpdates();
});
import_electron.ipcMain.on("downloadUpdate", () => {
  import_electron_updater.autoUpdater.downloadUpdate();
});
import_electron.ipcMain.on("quitAndInstall", () => {
  setImmediate(() => {
    import_electron_updater.autoUpdater.quitAndInstall();
    import_electron.app.exit();
  });
});
import_electron.ipcMain.on("checkAppVersion", () => {
  sendUpdateMessage({
    type: "version",
    text: `\u5F53\u524D\u7248\u672C\u4E3A:${import_electron.app.getVersion()}`
  });
});
