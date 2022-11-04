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
const winURL = `../../public/loading.html`;
let win;
const createLoadingWindow = function(BrowserWindow2) {
  const obj = {
    width: 270,
    height: 270,
    show: true,
    frame: false,
    resizable: false,
    movable: true,
    fullscreenable: false,
    minimizable: false,
    maximizable: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    closable: false,
    hasShadow: false,
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
    win.loadFile(import_path.default.join(__dirname, "../../../dist/loading.html"));
  } else {
    win.loadFile(winURL);
  }
  return win;
};
import_electron.app.commandLine.appendSwitch("wm-window-animations-disabled");
var stdin_default = createLoadingWindow;
