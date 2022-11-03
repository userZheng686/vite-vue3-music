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
  initProtocolSceme: () => initProtocolSceme,
  regDefaultProtocol: () => regDefaultProtocol
});
module.exports = __toCommonJS(stdin_exports);
var import_electron = require("electron");
var import_path = __toESM(require("path"));
var import_fs = __toESM(require("fs"));
function initProtocolSceme() {
  import_electron.protocol.registerSchemesAsPrivileged([
    { scheme: "Icarus", privileges: { standard: true, supportFetchAPI: true, secure: true, corsEnabled: true } }
  ]);
}
function regDefaultProtocol(request, response) {
  let pathName = new URL(request.url).pathname;
  let extension = import_path.default.extname(pathName).toLowerCase();
  if (!extension)
    return;
  pathName = decodeURI(pathName);
  let filePath = import_path.default.join(__dirname, pathName);
  import_fs.default.readFile(filePath, (error, data) => {
    if (error)
      return;
    let mimeType = "";
    if (extension === ".js") {
      mimeType = "text/javascript";
    } else if (extension === ".html") {
      mimeType = "text/html";
    } else if (extension === ".css") {
      mimeType = "text/css";
    } else if (extension === ".svg") {
      mimeType = "image/svg+xml";
    } else if (extension === ".json") {
      mimeType = "application/json";
    }
    response({ mimeType, data });
  });
}
