var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var stdin_exports = {};
__export(stdin_exports, {
  setStoreDownload: () => setStoreDownload
});
module.exports = __toCommonJS(stdin_exports);
var import_store = require("./store");
var import_read = require("./read");
function setStoreDownload(param) {
  let paramOrigin = JSON.parse(param);
  (0, import_store.setCustomDownload)(paramOrigin.type, paramOrigin.item);
  if (paramOrigin.type === 1) {
    (0, import_store.setDownloadSongs)([paramOrigin.item.id]);
    (0, import_read.writeFileMusicMetadata)(paramOrigin.item.songUrl, paramOrigin.item);
  } else if (paramOrigin.type === 2) {
    (0, import_store.setDownloadVoices)([paramOrigin.item.id]);
  } else if (paramOrigin.type === 3) {
    (0, import_store.setDownloadMVs)([paramOrigin.item.mvId]);
  }
}
