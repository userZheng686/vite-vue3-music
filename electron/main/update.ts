import { autoUpdater, UpdateInfo } from 'electron-updater';
import { app, BrowserWindow, dialog, ipcMain,protocol } from 'electron';
import path from 'path';

const message = {
    error: '检查更新出错',
    checking: '正在检查更新……',
    updateAva: '检测到新版本，正在下载……',
    updateNotAva: '现在使用的就是最新版本，不用更新',
};


if (!app.isPackaged) {
  autoUpdater.updateConfigPath = path.join(__dirname, 'dev-app-update.yml');
}

// 主进程跟渲染进程通信
const sendUpdateMessage = ({type,text} : {
    type : string,
    text : string | number
}) => {
    // 发送消息给渲染进程
    global.mainWindow.webContents.send('message', JSON.stringify({type,text}));
    global.updateWindow.webContents.send('message', JSON.stringify({type,text}));
};

// 设置自动下载为false，也就是说不开始自动下载
autoUpdater.autoDownload = false;

// 检测下载错误
autoUpdater.on('error', (error) => {
    sendUpdateMessage({
        type : 'updateError',
        text : `${message.error}:${error}`
    })
});

// 检测是否需要更新
autoUpdater.on('checking-for-update', () => {
    sendUpdateMessage({
        type : 'updateChecking',
        text : message.checking
    })
});


// 检测到可以更新时
autoUpdater.on('update-available', (info : UpdateInfo) => {
    // 这里我们可以做一个提示，让用户自己选择是否进行更新
    sendUpdateMessage({
        type : 'needUpdate',
        text : JSON.stringify({
            ...info,
            title : message.updateAva
        })
    })
});


// 检测到不需要更新时
autoUpdater.on('update-not-available', () => {
    // 这里可以做静默处理，不给渲染进程发通知，或者通知渲染进程当前已是最新版本，不需要更新
    sendUpdateMessage({
        type : 'notUpdate',
        text : message.updateNotAva
    })
});

// 更新下载进度
autoUpdater.on('download-progress', (progress) => {
    // 直接把当前的下载进度发送给渲染进程即可，有渲染层自己选择如何做展示
    sendUpdateMessage({
        type : 'progress',
        text : Number(progress.percent)
    })
});

// 当需要更新的内容下载完成后
autoUpdater.on('update-downloaded', () => {
    // 给用户一个提示，然后重启应用；或者直接重启也可以，只是这样会显得很突兀
    sendUpdateMessage({
        type : 'downloaded',
        text : `更新下载完毕，应用将重启并进行安装`
    })
});

// 我们需要主动触发一次更新检查
ipcMain.on('checkForUpdate', () => {
    // 当我们收到渲染进程传来的消息，主进程就就进行一次更新检查
    autoUpdater.checkForUpdates();
});

// 更新 用户触发
ipcMain.on('downloadUpdate', () => {
    // 直接更新
    autoUpdater.downloadUpdate();
});

//直接安装
ipcMain.on('quitAndInstall',() => {
    setImmediate(() => {
        autoUpdater.quitAndInstall()
        app.exit();
    });
})

// 当前引用的版本告知给渲染层
ipcMain.on('checkAppVersion', () => {
    sendUpdateMessage({
        type : 'version',
        text : `当前版本为:${app.getVersion()}`
    })
});






