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
  openFolder: () => openFolder,
  openSong: () => openSong
});
module.exports = __toCommonJS(stdin_exports);
var import_electron = require("electron");
var path = __toESM(require("path"));
var fs = __toESM(require("fs"));
function openFolder() {
  return new Promise((resolve) => {
    let path2 = import_electron.dialog.showOpenDialogSync({
      title: "\u9009\u62E9\u6DFB\u52A0\u76EE\u5F55",
      properties: ["openFile", "openDirectory"]
    });
    resolve(path2);
  });
}
function openSong() {
  return new Promise((resolve) => {
    let filePath = import_electron.dialog.showOpenDialogSync({
      title: "\u6253\u5F00",
      defaultPath: "C:\\Users\\ZERO\\Music",
      buttonLabel: "\u9009\u62E9",
      filters: [
        { name: "\u97F3\u4E50\u6587\u4EF6", extensions: ["mp3", "aac", "wma", "wav", "ogg", "m4a", "ape", "flac", "cue"] }
      ],
      properties: ["openFile"]
    });
    let file = {
      name: path.basename(filePath[0]),
      data: fs.readFileSync(filePath[0])
    };
    resolve(file);
  });
}
