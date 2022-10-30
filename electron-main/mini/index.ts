
import electron, { ipcMain, app, BrowserWindow } from 'electron';
import path from 'path'
import { LOAD_URL } from '../config';

// const winURL = process.env.NODE_ENV === "development" ? `https://192.168.3.3:4000/#/desktopMini` : `${LOAD_URL}desktopMini`
const winURL = `https://localhost:4000/#/desktopMini`
let win: BrowserWindow

const createMiniWindow = function (BrowserWindow) {
    const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;

    const obj = {
        // maxHeight: 80,
        width: 374,
        height: 450,
        // height: 100,
        show: false,
        frame: false,
        resizable: false,
        movable: false,
        y: 150,
        x: 150,
        fullscreenable: false,
        minimizable: false,
        maximizable: false,
        transparent: true,
        alwaysOnTop: true,
        skipTaskbar: true, // 任务栏中不显示窗口
        closable: false,
        hasShadow: process.platform === "darwin" ? false : false,
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
        win.loadFile(path.join(__dirname, "../index.html"),{
            hash : 'desktopMini'
        });
    } else {
        win.loadURL(winURL);
    }

    // win.webContents.openDevTools();
    return win
}

app.whenReady().then(() => {


    ipcMain.on('miniHide', () => {
        win.hide()
    })

    ipcMain.on('miniShow', () => {
        win.show()
        win.focus()

    })

    ipcMain.handle('miniGetBounds', (event) => {
        return win.getBounds()
    })

    ipcMain.handle('miniSetBounds', (event, param) => {
        let { x, y, width, height } = param
        return win.setBounds({
            x,
            y,
            width,
            height
        })
    })

    ipcMain.handle('miniSetSize', (event, param) => {
        let { width, height } = param
        win.setResizable(true)
        win.setSize(
            width,
            height
        )
        win.setResizable(false)
    })
})



export default createMiniWindow