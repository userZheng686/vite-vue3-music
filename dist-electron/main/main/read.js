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
  encode163Key: () => encode163Key,
  readDir: () => readDir,
  readFileMV: () => readFileMV,
  readFileMusic: () => readFileMusic,
  writeFileMusicMetadata: () => writeFileMusicMetadata
});
module.exports = __toCommonJS(stdin_exports);
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_js_base64 = require("js-base64");
var import_store = require("./store");
var mm = __toESM(require("music-metadata"));
var import_crypto = __toESM(require("crypto"));
var ffmetadata = __toESM(require("ffmetadata"));
let readDir = (dirPath) => {
  return import_fs.default.readdirSync(dirPath);
};
let diskSize = function(size, unit) {
  let res = "";
  let B = 8;
  let KB = 1024 * B;
  let MB = 1024 * KB;
  let GB = 1024 * MB;
  let TB = 1024 * GB;
  switch (unit) {
    case "K":
      {
        res = String(size / KB);
      }
      ;
      break;
    case "M":
      {
        res = String(size / MB);
      }
      ;
      break;
    case "G":
      {
        res = String(size / GB);
      }
      ;
      break;
    case "T":
      {
        res = String(size / TB);
      }
      ;
      break;
  }
  return res;
};
let transTime = (time, isHaveMillisecond) => {
  var _a;
  let mill;
  if (isHaveMillisecond) {
    mill = (_a = String(time).split(".")[1]) == null ? void 0 : _a.substring(0, 3);
  }
  let duration = parseInt(String(time));
  let minute = parseInt(String(duration / 60));
  let sec = duration % 60 + "";
  let isM0 = ":";
  if (minute === 0) {
    minute = "00";
  } else if (minute < 10) {
    minute = "0" + minute;
  }
  if (sec.length === 1) {
    sec = "0" + sec;
  }
  if (mill) {
    return minute + isM0 + sec + "." + mill;
  } else {
    return minute + isM0 + sec;
  }
};
let setObj = (filePath, decodeJson, common, format) => {
  var _a, _b;
  let fileSize = diskSize(format.bitrate * format.duration, "M");
  if (fileSize.split(".").length) {
    fileSize = fileSize.split(".")[0] + "." + ((_a = fileSize.split(".")[1]) == null ? void 0 : _a.substring(0, 2));
  }
  let obj = {};
  let picUrl = "";
  let ar = [];
  if (decodeJson == null ? void 0 : decodeJson.albumPic) {
    picUrl = decodeJson.albumPic;
  } else {
    if ((_b = common == null ? void 0 : common.picture) == null ? void 0 : _b.length) {
      picUrl = `data:${common == null ? void 0 : common.picture[0].format};base64,${import_js_base64.Base64.fromUint8Array(common == null ? void 0 : common.picture[0].data)}`;
    } else {
      picUrl = `http://p3.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg?param=1024y1024`;
    }
  }
  if (decodeJson == null ? void 0 : decodeJson.artist) {
    ar.push({
      alias: [],
      id: decodeJson.artist[0][1],
      name: decodeJson.artist[0][0],
      tns: []
    });
  } else {
    if (common.artist) {
      ar.push({
        alias: [],
        id: 0,
        name: common.artist,
        tns: []
      });
    }
  }
  try {
    if (decodeJson) {
      obj = {
        al: {
          id: decodeJson.albumId,
          name: decodeJson.album,
          alias: [],
          picUrl,
          tns: []
        },
        ar,
        sq: format.lossless ? true : false,
        id: decodeJson.musicId,
        mvid: decodeJson.mvId,
        name: decodeJson.musicName,
        fileSize,
        bitrate: format.bitrate,
        dt: format.duration * 1e3,
        originDt: format.duration * 1e3,
        from: {
          name: "\u6211\u4E0B\u8F7D\u7684\u97F3\u4E50",
          path: "localDownload",
          val: {
            type: 1,
            key: "song"
          }
        },
        songUrl: filePath,
        status: "no-play",
        like: false,
        is163key: true
      };
    } else {
      obj = {
        al: {
          id: 0,
          name: common.album,
          picUrl,
          tns: []
        },
        ar,
        sq: format.lossless ? true : false,
        name: common.title ? common.title : "\u672A\u77E5\u540D\u5B57",
        fileSize,
        bitrate: format.bitrate,
        dt: format.duration * 1e3,
        originDt: format.duration * 1e3,
        from: {
          name: "\u6211\u4E0B\u8F7D\u7684\u97F3\u4E50",
          path: "localDownload",
          val: {
            type: 1,
            key: "song"
          }
        },
        songUrl: filePath,
        status: "no-play",
        id: filePath,
        like: false,
        is163key: false
      };
    }
  } catch (e) {
    console.log("e", e);
  }
  return obj;
};
let decode163Key = (comment) => {
  let json;
  try {
    const aes128ecbDecipher = import_crypto.default.createDecipheriv("aes-128-ecb", "#14ljk_!\\]&0U<'(", "");
    const aesd = aes128ecbDecipher.update(comment, "base64") + aes128ecbDecipher.final();
    json = JSON.parse(aesd.substring(6));
  } catch (e) {
    json = null;
  } finally {
    return json;
  }
};
let encode = (encodeText) => {
  const aes128ecbDecipher = import_crypto.default.createCipheriv("aes-128-ecb", "#14ljk_!\\]&0U<'(", "");
  const aesd = aes128ecbDecipher.update(encodeText, "utf-8", "base64") + aes128ecbDecipher.final("base64");
  return aesd;
};
let encode163Key = (path2, obj) => {
  return new Promise((resolve, reject) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    let artist = [];
    if ((_a = obj == null ? void 0 : obj.artists) == null ? void 0 : _a.length) {
      obj.artists.forEach((item) => {
        artist.push([item.name, item.id]);
      });
    } else if ((_b = obj == null ? void 0 : obj.ar) == null ? void 0 : _b.length) {
      obj.ar.forEach((item) => {
        artist.push([item.name, item.id]);
      });
    } else if (obj == null ? void 0 : obj.pc) {
      artist = [[obj.pc.ar, obj.pc.id]];
    }
    let encodeObj = {
      format: path2.split(".")[1],
      musicId: obj.id,
      musicName: obj.name,
      artist,
      album: ((_c = obj == null ? void 0 : obj.album) == null ? void 0 : _c.name) || ((_d = obj == null ? void 0 : obj.al) == null ? void 0 : _d.name),
      albumId: ((_e = obj == null ? void 0 : obj.album) == null ? void 0 : _e.id) || ((_f = obj == null ? void 0 : obj.al) == null ? void 0 : _f.id),
      albumPic: ((_g = obj == null ? void 0 : obj.album) == null ? void 0 : _g.picUrl) || ((_h = obj == null ? void 0 : obj.al) == null ? void 0 : _h.picUrl),
      mvId: obj == null ? void 0 : obj.mvid,
      bitrate: parseInt(String(obj.bitrate)),
      duration: obj.duration || obj.dt,
      alias: obj.alias,
      transNames: obj.transName || []
    };
    let encodeKey = encode(`music:${JSON.stringify(encodeObj)}`);
    encodeKey = `163 key(Don't modify):${encodeKey}`;
    (0, import_store.setSong163Key)(path2, encodeKey);
    resolve(encodeKey);
  });
};
let testClear163Key = (filePath) => {
  return new Promise((resolve) => {
    (0, import_store.clear163key)();
    resolve("1");
  });
};
let readFileMusic = async (filePath) => {
  const metadata = await mm.parseFile(filePath);
  const key = (0, import_store.getSong163Key)(filePath);
  const { common, format } = metadata;
  let obj = {}, decodeJson;
  if (key) {
    decodeJson = decode163Key(key.substring(22));
    if (decodeJson) {
      obj = setObj(filePath, decodeJson, common, format);
    } else {
      obj = setObj(filePath, null, common, format);
    }
    return JSON.stringify(obj);
  } else {
    obj = setObj(filePath, null, common, format);
    return JSON.stringify(obj);
  }
};
let readFileMV = async (filePath) => {
  var _a;
  const metadata = await mm.parseFile(import_path.default.join(filePath));
  const { common, format } = metadata;
  let fileSize = diskSize(format.bitrate * format.duration, "M");
  if (fileSize.split(".").length) {
    fileSize = fileSize.split(".")[0] + "." + ((_a = fileSize.split(".")[1]) == null ? void 0 : _a.substring(0, 2));
  }
  return fileSize;
};
let writeFileMusicMetadata = async (filePath, obj) => {
  var _a, _b, _c, _d, _e;
  let artistName = ((_a = obj == null ? void 0 : obj.artists) == null ? void 0 : _a.map((item) => item.name)) || ((_b = obj == null ? void 0 : obj.ar) == null ? void 0 : _b.map((item) => item.name)) || ((_c = obj == null ? void 0 : obj.pc) == null ? void 0 : _c.ar) || "";
  let albumName = ((_d = obj == null ? void 0 : obj.album) == null ? void 0 : _d.name) || ((_e = obj == null ? void 0 : obj.al) == null ? void 0 : _e.name);
  let comment = await encode163Key(filePath, obj);
  let options = {
    artist: artistName,
    album: albumName,
    title: obj == null ? void 0 : obj.name,
    comment
  };
  ffmetadata.write(filePath, options, function(err) {
    if (err)
      console.error("Error writing cover art");
    else
      console.log("Cover art added");
  });
};
