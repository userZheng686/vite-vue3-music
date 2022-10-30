// electron-main/index.ts
import { app, BrowserWindow, ipcMain,protocol } from 'electron';
import path from 'path';
import createMainWindow from './main/index'
import createLyricWindow from './lyric/index'
import createMiniWindow from './mini/index'
import createLoadingWindow from './loading/index'
import { createTray } from './tray/index'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import { initProtocolSceme,regDefaultProtocol} from './protocol';

const args = [];
if (!app.isPackaged) {
  args.push(path.resolve(process.argv[1]));
}
args.push('--');


//设置开机自动启动
//windows
// app.setLoginItemSettings({
//     openAtLogin: true,
//     args: ["--openAsHidden"],
// });
//mac
//设置开机启动
// app.setLoginItemSettings({
//   openAtLogin: true,
//   openAsHidden: true,
// });

app.commandLine.appendSwitch('wm-window-animations-disabled');
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');


initProtocolSceme()


app.whenReady().then(() => {

    // protocol.registerBufferProtocol("Icarus", (request , response) =>
    //     regDefaultProtocol(request, response)
    // );

    // app.setAsDefaultProtocolClient('Icarus', process.execPath, args);


    global.loadingWindow = createLoadingWindow(BrowserWindow)
    global.mainWindow = createMainWindow(BrowserWindow)
    global.lyricWindow = createLyricWindow(BrowserWindow)
    global.miniWindow = createMiniWindow(BrowserWindow)
    createTray()


    protocol.registerFileProtocol('atom', (request, callback) => {
        const url = request.url.substr(7)
        callback(decodeURI(path.normalize(url)))
    })

    //关闭应用
    ipcMain.on('exit', () => {
        console.log('exit')
        app.exit()
    })

});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

