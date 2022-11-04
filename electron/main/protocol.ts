import { protocol } from 'electron'
import path from "path";
import fs from "fs";

export function initProtocolSceme() {
    protocol.registerSchemesAsPrivileged([
        { scheme: "Icarus", privileges: { standard: true, supportFetchAPI: true, secure: true, corsEnabled: true } },
    ]);
}

export function regDefaultProtocol(request: { url: string | URL; }, response: (arg0: { mimeType: string; data: Buffer; }) => void){
  let pathName = new URL(request.url).pathname;
  let extension = path.extname(pathName).toLowerCase();
  if (!extension) return
  pathName = decodeURI(pathName);
  let filePath = path.join(__dirname, pathName);
  fs.readFile(filePath, (error, data) => {
    if (error) return
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