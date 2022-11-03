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
var import_electron = require("electron");
var import_path = __toESM(require("path"));
var import_main = __toESM(require("./main/index"));
var import_lyric = __toESM(require("./lyric/index"));
var import_mini = __toESM(require("./mini/index"));
var import_loading = __toESM(require("./loading/index"));
var import_tray = require("./tray/index");
var import_protocol = require("./protocol");
const args = [];
if (!import_electron.app.isPackaged) {
  args.push(import_path.default.resolve(process.argv[1]));
}
args.push("--");
import_electron.app.commandLine.appendSwitch("wm-window-animations-disabled");
import_electron.app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");
(0, import_protocol.initProtocolSceme)();
const gotTheLock = import_electron.app.requestSingleInstanceLock();
if (!gotTheLock) {
  import_electron.app.exit();
}
import_electron.app.whenReady().then(() => {
  global.loadingWindow = (0, import_loading.default)(import_electron.BrowserWindow);
  global.mainWindow = (0, import_main.default)(import_electron.BrowserWindow);
  global.lyricWindow = (0, import_lyric.default)(import_electron.BrowserWindow);
  global.miniWindow = (0, import_mini.default)(import_electron.BrowserWindow);
  (0, import_tray.createTray)();
  import_electron.protocol.registerFileProtocol("atom", (request, callback) => {
    const url = request.url.substr(7);
    callback(decodeURI(import_path.default.normalize(url)));
  });
  import_electron.ipcMain.on("exit", () => {
    console.log("exit");
    import_electron.app.exit();
  });
});
import_electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    import_electron.app.quit();
  }
});
