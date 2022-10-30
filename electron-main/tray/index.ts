import electron, { ipcMain, app, BrowserWindow,Tray, nativeImage } from 'electron';
import path from 'path'
import { LOAD_URL } from '../config';

export const createTray = function(){
    let { width: screenWidth } = electron.screen.getPrimaryDisplay().size;
    const trayIconPath = !app.isPackaged ?
        path.join(__dirname, '../../public/tray.ico') :
        path.join(__dirname, '../tray.ico')
    
    const appTray = new Tray(trayIconPath);
    
    let trayBounds = appTray.getBounds();
    let trayWindow = createTrayWindow(trayBounds)

    appTray.setToolTip('网易云音乐')

    appTray.on('click',() => {
        global.mainWindow.show()
    })
    
    appTray.on("right-click", (event, bounds) => {
        const [trayMenuWidth, trayMenuHeight] = trayWindow.getSize();
        let { x, y } = electron.screen.getCursorScreenPoint();
        if (x + trayMenuWidth > screenWidth) {
            trayWindow.setPosition(
                x - trayMenuWidth,
                y - trayMenuHeight
            );
        } else {
            trayWindow.setPosition(x, y - trayMenuHeight);
        }
        trayWindow.show();
    })
    
    return appTray;
}

const createTrayWindow = function (bounds : Electron.Rectangle) {
    let win: BrowserWindow
    // const winURL = process.env.NODE_ENV === "development" ? `https://192.168.3.3:4000/#/tray` : `${LOAD_URL}tray`
    const winURL =  `https://localhost:4000/#/tray`
    const obj = {
        width: 240,
        height: 360,
        maxWidth: 240,
        maxHeight: 360,
        show: false,
        frame: false,
        resizable: false,
        backgroundColor : 'white',
        movable: false,
        y: bounds.y - 310,
        x: bounds.x,
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
            devTools: true,
            preload: path.join(__dirname, '../electron-preload/index.js')
        },
    };
    win = new BrowserWindow(obj);
    
    if (app.isPackaged) {
        win.loadFile(path.join(__dirname, "../index.html"),{
            hash : 'tray'
        });
    } else {
        win.loadURL(winURL);
    }

    // win.webContents.openDevTools();

    win.on("blur", () => {
        win.hide();
    });

    win.on("close", () => {
        win = null;
    });
    
    return win
}

