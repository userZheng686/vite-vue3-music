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
const winURL = `https://localhost:4000/#/desktopUpdate`;
let win;
const createUpdateWindow = function(BrowserWindow2) {
  const { width, height } = import_electron.default.screen.getPrimaryDisplay().workAreaSize;
  const obj = {
    width: 300,
    height: 360,
    show: false,
    frame: false,
    resizable: false,
    movable: false,
    y: height - 150,
    fullscreenable: false,
    minimizable: false,
    backgroundColor: "#00000000",
    maximizable: false,
    transparent: true,
    alwaysOnTop: false,
    skipTaskbar: true,
    closable: false,
    hasShadow: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: true,
      devTools: true,
      preload: import_path.default.join(__dirname, "../../preload/index.js")
    }
  };
  win = new BrowserWindow2(obj);
  if (import_electron.app.isPackaged) {
    win.loadFile(import_path.default.join(__dirname, "../../../dist/index.html"), {
      hash: "desktopUpdate"
    });
  } else {
    win.loadURL(winURL);
  }
  return win;
};
import_electron.ipcMain.on("updateHide", () => {
  win.hide();
});
import_electron.ipcMain.on("updateShow", () => {
  win.show();
  win.focus();
});
import_electron.ipcMain.handle("updateGetBounds", (event) => {
  return win.getBounds();
});
import_electron.ipcMain.handle("updateSetBounds", (event, param) => {
  let { x, y, width, height } = param;
  return win.setBounds({
    x,
    y,
    width,
    height
  });
});
import_electron.ipcMain.handle("updateSetSize", (event, param) => {
  let { width, height } = param;
  win.setResizable(true);
  win.setSize(width, height);
  win.setResizable(false);
});
import_electron.app.commandLine.appendSwitch("wm-window-animations-disabled");
var stdin_default = createUpdateWindow;
