
import electron, { ipcMain, app, BrowserWindow } from 'electron';
import path from 'path'
import { LOAD_URL } from '../config';

// const winURL = process.env.NODE_ENV === "development" ? `https://192.168.3.3:4000/#/desktopLyric` : `${LOAD_URL}desktopLyric`
const winURL = `https://localhost:4000/#/desktopUpdate`
let win: BrowserWindow

const createUpdateWindow = function (BrowserWindow) {
    const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;

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
        backgroundColor: '#00000000',
        maximizable: false,
        transparent: true,
        alwaysOnTop: false,
        skipTaskbar: true, // 任务栏中不显示窗口
        closable: false,
        hasShadow: false,
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: true,
            devTools: true,
            preload: path.join(__dirname, '../../preload/index.js')
        },
    };
    win = new BrowserWindow(obj);

    if (app.isPackaged) {
        win.loadFile(path.join(__dirname, "../../../dist/index.html"),{
            hash : 'desktopUpdate'
        });
        win.webContents.openDevTools();
    } else {
        win.loadURL(winURL);
        win.webContents.openDevTools();
    }
    
    return win
}


ipcMain.on('updateHide', () => {
    win.hide()
})

ipcMain.on('updateShow', () => {
    win.show()
    win.focus()
})

ipcMain.handle('updateGetBounds', (event) => {
    return win.getBounds()
})

ipcMain.handle('updateSetBounds', (event, param) => {
    let { x, y, width, height } = param
    return win.setBounds({
        x,
        y,
        width,
        height
    })
})

ipcMain.handle('updateSetSize', (event, param) => {
    let { width, height } = param
    win.setResizable(true)
    win.setSize(
        width,
        height
    )
    win.setResizable(false)
})


app.commandLine.appendSwitch('wm-window-animations-disabled');

export default createUpdateWindow