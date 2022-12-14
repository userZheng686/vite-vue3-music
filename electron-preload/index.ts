// electron-preload/index.ts
import os from "os";
import { contextBridge, ipcRenderer } from 'electron';
//歌曲列表声明
import { SongDetailSongsItem } from "i/api/api_song.d";
//mv下载声明
import { downloadItem } from 'i/view/videoDetail.d'
import './lyric.js'
import './mini.js'


contextBridge.exposeInMainWorld('desktopMainAPI', {
    hide: () => ipcRenderer.send('mainHide'),
    show: () => ipcRenderer.send('mainShow'),
    minimize: () => ipcRenderer.send('minimize'),
    revivification: () => ipcRenderer.send('revivification'),
    href: (url: string) => ipcRenderer.send('href', url),
    close: () => ipcRenderer.send('close'),
    openPath: (path: string) => ipcRenderer.send('openPath', path),
    openPathFolder: (path: string) => ipcRenderer.send('openPathFolder', path),
    exit : () => ipcRenderer.send('exit'),
})



contextBridge.exposeInMainWorld('readAPI', {
    readDir: async (path: string) => { const file = await ipcRenderer.invoke('readDir', path); return file },
    readFileMusic: async (filePath: string) => { const file = await ipcRenderer.invoke('readFileMusic', filePath); return file },
    readFileMV: async (filePath: string) => { const file = await ipcRenderer.invoke('readFileMV', filePath); return file },
    readMusic: async (filePath: string) => { const metadata = await ipcRenderer.invoke('identify', filePath); return metadata },
    write163Key: async (filePath: string, obj: string) => await ipcRenderer.invoke('write163Key', filePath, obj)
});

contextBridge.exposeInMainWorld('folderAPI', {
    getUserScanFolder: async () => await ipcRenderer.invoke('getUserScanFolder'),
    setUserScanFolder: async (path: string) => await ipcRenderer.invoke('setUserScanFolder', path),
    getUserCheckScanFolder: async () => await ipcRenderer.invoke('getUserCheckScanFolder'),
    setUserCheckScanFolder: async (path: string[]) => await ipcRenderer.invoke('setUserCheckScanFolder', path),
    openFolder: async () => await ipcRenderer.invoke('openFolder'),
    openSong: async () => await ipcRenderer.invoke('openSong'),
});

contextBridge.exposeInMainWorld('cookieAPI', {
    getCookie: () => ipcRenderer.invoke('getCookie'),
    setCookie: () => ipcRenderer.invoke('getDownloadSongs'),
});

contextBridge.exposeInMainWorld('downloadAPI', {
    //获取客户端已经下载好的内容（歌曲 声音 MV）
    getCustomDownload: (type: number) => ipcRenderer.invoke('getCustomDownload', type),
    //批量更新客户端已经下载的数据
    patchUpdateCustomDownload: (type: number, list: any) => ipcRenderer.invoke('patchUpdateCustomDownload', type, list),
    //已经下载完的所有歌曲id
    getDownloadSongs: () => ipcRenderer.invoke('getDownloadSongs'),
    //获取默认的下载路径
    getDownloadPath: () => ipcRenderer.invoke('getDownloadPath'),
    //清空客户端下载的内容（测试）
    clearCustomDownload: (type: number) => ipcRenderer.invoke('clearCustomDownload', type),
    //清空下载完的所有歌曲id
    clearDownloadSongs: () => ipcRenderer.invoke('clearDownloadSongs'),
    //记录已经下载完的歌曲id
    setDownloadSongs: (ids: number[]) => ipcRenderer.invoke('setDownloadSongs', ids),
    //下载歌曲
    downloadSong: (path: string, param: { type: number, item: SongDetailSongsItem }) => ipcRenderer.invoke('downloadSong', path, param),
    //下载MV
    downloadMV: (path: string, param: { type: number, item: downloadItem }) => ipcRenderer.invoke('downloadMV', path, param),
    //暂停下载
    pause: (type: string, url?: string) => ipcRenderer.invoke('pause', type, url),
    //恢复下载
    resume: (type: string, url?: string) => ipcRenderer.invoke('resume', type, url),
    //清空全部（测试）
    clear: (url: string[]) => ipcRenderer.invoke('clear', url),
    //获取未完成下载的历史记录
    getHistroyDownloadInterrupted: () => ipcRenderer.invoke('getHistroyDownloadInterrupted'),
    //清空所有下载的历史记录（测试）
    clearAllHistoryDownloadInterrupted: () => ipcRenderer.invoke('clearAllHistoryDownloadInterrupted'),
    //恢复中断的下载
    resumeInterrupted: (item: string) => ipcRenderer.invoke('resumeInterrupted', item),
})

//接受主进程传进来的下载工具函数
//更新歌曲下载进度
ipcRenderer.on('downloadUtil', (e, value) => {
    console.log('value', value)
})


//实时下载传递过来的参数 这个不确定 由回调函数自己决定
let downloadParam: any
/**
 * 更新进度和通知下载分为两个事件 因为进度100不代表下载完毕 需要另行通知渲染进程进行下载
 */
//更新进度
let updateSongProgressCallback: Function
let updateMVProgressCallback: Function
//通知下载完毕
let completeSongDownloadCallback: Function
let completeMVDownloadCallback: Function
//取消下载
let cancelSongDownloadCallback: Function
let cancelMVDownloadCallback: Function

//上一首
let prevCallback: Function
//暂停
let pauseCallback : Function
//播放
let playCallback : Function
//下一首
let nextCallback: Function


//回调 通知渲染进程更新歌曲下载进度
let onProgressSong = () => {
    if (Object.keys(downloadParam).length) {
        updateSongProgressCallback(downloadParam)
    }
}
//回调 通知渲染进程歌曲下载完毕
let onCompleteSong = () => {
    if (Object.keys(downloadParam).length) {
        completeSongDownloadCallback(downloadParam)
    }
}
//回调 通知渲染进程歌曲取消下载
let onCancelSong = () => {
    cancelSongDownloadCallback(downloadParam)
}
//回调 通知渲染进程更新MV下载进度
let onProgressMV = () => {
    if (Object.keys(downloadParam).length) {
        updateMVProgressCallback(downloadParam)
    }
}
//回调 通知渲染进程MV下载完毕
let onCompleteMV = () => {
    if (Object.keys(downloadParam).length) {
        completeMVDownloadCallback(downloadParam)
    }
}
//回调 通知渲染进程MV取消下载
let onCancelMV = () => {
    cancelMVDownloadCallback(downloadParam)
}

//因为渲染进程中监听不到主进程发出的事件  所以只能通过回调函数来监听值
contextBridge.exposeInMainWorld('ipcRenderer', {
    updateSongProgress: (f: Function) => updateSongProgressCallback = f,
    completeSongDownload: (f: Function) => completeSongDownloadCallback = f,
    cancelSongDownload: (f: Function) => cancelSongDownloadCallback = f,
    updateMVProgress: (f: Function) => updateMVProgressCallback = f,
    completeMVDownload: (f: Function) => completeMVDownloadCallback = f,
    cancelMVDownload: (f: Function) => cancelMVDownloadCallback = f,
    prev: (f: Function) => prevCallback = f,
    play: (f: Function) => playCallback = f,
    pause: (f: Function) => pauseCallback = f,
    next: (f: Function) => nextCallback = f,
    updateStatus : (status : string) => ipcRenderer.send('status', status),
})

//上一首
ipcRenderer.on('prev',(e,value) => {
    prevCallback && prevCallback()
    console.log('prev')
})

//播放
ipcRenderer.on('play',(e,value) => {
    playCallback && playCallback()
    console.log('play')
})

//暂停
ipcRenderer.on('pause',(e,value) => {
    pauseCallback && pauseCallback()
    console.log('pause')
})

//下一首
ipcRenderer.on('next',(e,value) => {
    nextCallback && nextCallback()
    console.log('next')
})


//更新歌曲下载进度
ipcRenderer.on('updateSongDownloadProgressing', (e, value) => {
    // console.log('value', value)
    downloadParam = JSON.parse(value)
    onProgressSong()
})

//通知歌曲下载完毕
ipcRenderer.on('completeSongDownload', (e, value) => {
    // console.log('value', value)
    downloadParam = JSON.parse(value)
    onCompleteSong()
})

//通知歌曲下载取消
ipcRenderer.on('cancelSongDownload', (e, value) => {
    // console.log('value', value)
    downloadParam = value
    onCancelSong()
})

//更新MV下载进度
ipcRenderer.on('updateMVDownloadProgressing', (e, value) => {
    // console.log('value', value)
    downloadParam = JSON.parse(value)
    onProgressMV()
})

//通知MV下载完毕
ipcRenderer.on('completeMVDownload', (e, value) => {
    // console.log('value', value)
    downloadParam = JSON.parse(value)
    onCompleteMV()
})

//通知MV下载取消
ipcRenderer.on('cancelMVDownload', (e, value) => {
    // console.log('value', value)
    downloadParam = value
    onCancelMV()
})


