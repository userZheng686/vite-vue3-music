
import electron, { ipcMain, app, BrowserWindow } from 'electron';
import path from 'path'
import { LOAD_URL } from '../config';

// const winURL = process.env.NODE_ENV === "development" ? `https://192.168.3.3:4000/#/desktopLyric` : `${LOAD_URL}desktopLyric`
const winURL = `https://localhost:4000/#/desktopLyric`
let win: BrowserWindow

const createLyricWindow = function (BrowserWindow) {
    const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;

    const obj = {
        width: 868,
        height: 168,
        show: false,
        frame: false,
        resizable: false,
        movable: false,
        y: height - 150,
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
            preload: path.join(__dirname, '../../preload/index.js')
        },
    };
    win = new BrowserWindow(obj);

    if (app.isPackaged) {
        win.loadFile(path.join(__dirname, "../../../dist/index.html"),{
            hash : 'desktopLyric'
        });
    } else {
        win.loadURL(winURL);
        win.webContents.openDevTools();
    }
    
    return win
}


ipcMain.on('lyricHide', () => {
    win.hide()
})

ipcMain.on('lyricShow', () => {
    win.show()
    win.focus()
})

ipcMain.handle('lyricGetBounds', (event) => {
    return win.getBounds()
})

ipcMain.handle('lyricSetBounds', (event, param) => {
    let { x, y, width, height } = param
    return win.setBounds({
        x,
        y,
        width,
        height
    })
})

ipcMain.handle('lyricSetSize', (event, param) => {
    let { width, height } = param
    win.setResizable(true)
    win.setSize(
        width,
        height
    )
    win.setResizable(false)
})


app.commandLine.appendSwitch('wm-window-animations-disabled');

export default createLyricWindow