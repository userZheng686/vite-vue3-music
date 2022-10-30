
import electron, { ipcMain, app, BrowserWindow } from 'electron';
import path from 'path'
import { LOAD_URL } from '../config';

// const winURL = process.env.NODE_ENV === "development" ? `https://192.168.3.3:4000/#/desktopLyric` : `${LOAD_URL}desktopLyric`
const winURL = `../../public/loading.html`
let win: BrowserWindow

const createLoadingWindow = function (BrowserWindow) {
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
        skipTaskbar: true, // 任务栏中不显示窗口
        closable: false,
        hasShadow: false,
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: true,
            devTools: false,
            preload: path.join(__dirname, '../electron-preload/index.js')
        },
    };
    win = new BrowserWindow(obj);

    if (app.isPackaged) {
        win.loadFile(path.join(__dirname, "../loading.html"));
    } else {
        win.loadFile(winURL);
    }
    // win.webContents.openDevTools();
    return win
}


app.commandLine.appendSwitch('wm-window-animations-disabled');

export default createLoadingWindow