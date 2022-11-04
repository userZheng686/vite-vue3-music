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
  createTray: () => createTray
});
module.exports = __toCommonJS(stdin_exports);
var import_electron = __toESM(require("electron"));
var import_path = __toESM(require("path"));
const createTray = function() {
  let { width: screenWidth } = import_electron.default.screen.getPrimaryDisplay().size;
  const trayIconPath = !import_electron.app.isPackaged ? import_path.default.join(__dirname, "../../../public/tray.ico") : import_path.default.join(__dirname, "../../../dist/tray.ico");
  const appTray = new import_electron.Tray(trayIconPath);
  let trayBounds = appTray.getBounds();
  let trayWindow = createTrayWindow(trayBounds);
  appTray.setToolTip("\u7F51\u6613\u4E91\u97F3\u4E50");
  appTray.on("click", () => {
    global.mainWindow.show();
  });
  appTray.on("right-click", (event, bounds) => {
    const [trayMenuWidth, trayMenuHeight] = trayWindow.getSize();
    let { x, y } = import_electron.default.screen.getCursorScreenPoint();
    if (x + trayMenuWidth > screenWidth) {
      trayWindow.setPosition(x - trayMenuWidth, y - trayMenuHeight);
    } else {
      trayWindow.setPosition(x, y - trayMenuHeight);
    }
    trayWindow.show();
  });
  return appTray;
};
const createTrayWindow = function(bounds) {
  let win;
  const winURL = `https://localhost:4000/#/tray`;
  const obj = {
    width: 240,
    height: 360,
    maxWidth: 240,
    maxHeight: 360,
    show: false,
    frame: false,
    resizable: false,
    backgroundColor: "white",
    movable: false,
    y: bounds.y - 310,
    x: bounds.x,
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
      devTools: true,
      preload: import_path.default.join(__dirname, "../../preload/index.js")
    }
  };
  win = new import_electron.BrowserWindow(obj);
  if (import_electron.app.isPackaged) {
    win.loadFile(import_path.default.join(__dirname, "../../../dist/index.html"), {
      hash: "tray"
    });
  } else {
    win.loadURL(winURL);
  }
  win.on("blur", () => {
    win.hide();
  });
  win.on("close", () => {
    win = null;
  });
  return win;
};
