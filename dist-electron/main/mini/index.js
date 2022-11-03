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
var import_electron = __toESM(require("electron"));
var import_path = __toESM(require("path"));
const winURL = `https://localhost:4000/#/desktopMini`;
let win;
const createMiniWindow = function(BrowserWindow2) {
  const { width, height } = import_electron.default.screen.getPrimaryDisplay().workAreaSize;
  const obj = {
    width: 374,
    height: 450,
    show: false,
    frame: false,
    resizable: false,
    movable: false,
    y: 150,
    x: 150,
    fullscreenable: false,
    minimizable: false,
    maximizable: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    closable: false,
    hasShadow: process.platform === "darwin" ? false : false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: true,
      devTools: false,
      preload: import_path.default.join(__dirname, "../../preload/index.js")
    }
  };
  win = new BrowserWindow2(obj);
  if (import_electron.app.isPackaged) {
    win.loadFile(import_path.default.join(__dirname, "../../../dist/index.html"), {
      hash: "desktopMini"
    });
  } else {
    win.loadURL(winURL);
  }
  return win;
};
import_electron.ipcMain.on("miniHide", () => {
  win.hide();
});
import_electron.ipcMain.on("miniShow", () => {
  win.show();
  win.focus();
});
import_electron.ipcMain.handle("miniGetBounds", (event) => {
  return win.getBounds();
});
import_electron.ipcMain.handle("miniSetBounds", (event, param) => {
  let { x, y, width, height } = param;
  return win.setBounds({
    x,
    y,
    width,
    height
  });
});
import_electron.ipcMain.handle("miniSetSize", (event, param) => {
  let { width, height } = param;
  win.setResizable(true);
  win.setSize(width, height);
  win.setResizable(false);
});
var stdin_default = createMiniWindow;
