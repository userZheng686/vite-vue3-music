import { app } from 'electron'
import fs from 'fs'

interface DownloadParam {
    eTag: string | undefined;
    lastModified: string | undefined;
    startTime: number;
    offset: number;
    length: number;
    type: number;
    urlChain: string[];
    item: {
        type: number;
        item: any;
    };
    path: string;
    fileName: string;
}


const Store = require('electron-store');

let option = {
    name: "config",//文件名称,默认 config
    fileExtension: "json",//文件后缀,默认json
    cwd: app.getPath('userData'),//文件位置,尽量不要动，默认情况下，它将通过遵循系统约定来选择最佳位置。C:\Users\xxx\AppData\Roaming\test\config.json
    //    encryptionKey:"aes-256-cbc" ,//对配置文件进行加密
    clearInvalidConfig: true, // 发生 SyntaxError  则清空配置,
}
const store = new Store(option);

//设置用户下载的歌曲id（包含云盘上传 客户端歌曲下载）
export function setDownloadSongs(ids: number[]) {
    let downloadIds = store.get('downloadSongId') || []
    downloadIds.push(...ids)
    downloadIds = Array.from(new Set(downloadIds))
    store.set('downloadSongId', downloadIds)
}

//获取用户已经下载的歌曲id（包含云盘上传 客户端歌曲下载）
export function getDownloadSongs() {
    return store.get('downloadSongId') || []
}

//清空所有已经下载的歌曲id(测试)
export function clearDownloadSongs() {
    store.set('downloadSongId', [])
}

//设置用户下载的声音id
export function setDownloadVoices(ids: number[]) {
    let downloadIds = store.get('downloadVoiceId') || []
    downloadIds.push(...ids)
    downloadIds = Array.from(new Set(downloadIds))
    store.set('downloadVoiceId', downloadIds)
}

//设置用户下载的MVid
export function setDownloadMVs(ids: number[]) {
    let downloadIds = store.get('downloadMVId') || []
    downloadIds.push(...ids)
    downloadIds = Array.from(new Set(downloadIds))
    store.set('downloadMVId', downloadIds)
}

//获取用户已经下载的MVid
export function getDownloadMVs() {
    // store.set('downloadMVId', [])
    return store.get('downloadMVId') || []
}

//清空所有已经下载的mvid(测试)
export function clearDownloadMVs() {
    store.set('downloadMVId', [])
}


//设置客户端下载(单曲，声音，MV)
//做去重处理
//单曲 type 1
//声音 type 2
//MV  type 3
export function setCustomDownload(type: number, item: any) {
    if (type === 1) {
        let songDownload = store.get('songDownload') || []
        let songIndex = songDownload.findIndex((song: any) => song.id === item.id)
        if (songIndex === -1) {
            songDownload.push(item)
        }
        store.set('songDownload', songDownload)
    } else if (type === 2) {
        let voiceDownload = store.get('voiceDownload') || []
        let voiceIndex = voiceDownload.findIndex((song: any) => song.id === item.id)
        if (voiceIndex === -1) {
            voiceDownload.push(item)
        }
        store.set('voiceDownload', voiceDownload)
    } else if (type === 3) {
        let songDownload = store.get('mvDownload') || []
        songDownload.push(item)
        store.set('mvDownload', songDownload)
    }
}


//批量更新客户端下载的文件数据
export function patchUpdateCustomDownload(type: number, list: any[]) {
    if (type === 1) {
        store.set('songDownload', list)
    } else if (type === 2) {
        store.set('voiceDownload', list)
    } else if (type === 3) {
        store.set('mvDownload', list)
    }
}

//返回客户端下载（单曲，声音，MV）
//单曲 type 1
//声音 type 2
//MV  type 3
export function getCustomDownload(type: number) {
    if (type === 1) {
        // store.set('songDownload', [])
        return store.get('songDownload')
    } else if (type === 2) {
        // store.set('mvDownload', [])
        return store.get('voiceDownload')
    } else if (type === 3) {
        // store.set('mvDownload', [])
        return store.get('mvDownload')
    }
}

//清空客户端(测试)
export function clearCustomDownload(type: number) {
    if (type === 1) {
        store.set('songDownload', [])
        // return store.get('songDownload')
    } else if (type === 2) {
        store.set('voiceDownload', [])
        // return store.get('mvDownload')
    } else if (type === 3) {
        store.set('mvDownload', [])
        // return store.get('mvDownload')
    }
}

//历史记录 用于记录没有下载完的文件（因为意外情况退出应用 或是用户自动退出应用 不包括取消下载）
export function setHistroyDownloadInterrupted(downloadParam: DownloadParam) {
    let historyDownloadInterrupted = store.get('historyDownloadInterrupted')
    if (!historyDownloadInterrupted) {
        historyDownloadInterrupted = store.set('historyDownloadInterrupted', [])
    }
    let { fileName } = downloadParam
    let fileNameIndex = historyDownloadInterrupted.findIndex((item: DownloadParam) => {
        return item.fileName === fileName
    })
    if (fileNameIndex === -1) {
        historyDownloadInterrupted.push(downloadParam)
    } else {
        historyDownloadInterrupted[fileNameIndex] = downloadParam;
    }
    store.set('historyDownloadInterrupted', historyDownloadInterrupted)
}

//清空已经下载完成的文件数据
export function clearHistroyDownloadInterrupted(fileName: string) {
    let historyDownloadInterrupted = getHistroyDownloadInterrupted()
    let fileNameIndex = historyDownloadInterrupted.findIndex((item: DownloadParam) => {
        return item.fileName === fileName
    })
    historyDownloadInterrupted.splice(fileNameIndex, 1)
    store.set('historyDownloadInterrupted', historyDownloadInterrupted)
}

//返回历史记录（记录没有下载完成的文件）
export function getHistroyDownloadInterrupted() {
    // store.set('historyDownloadInterrupted', [])
    return store.get('historyDownloadInterrupted')
}

export function clearAllHistoryDownloadInterrupted() {
    store.set('historyDownloadInterrupted', [])
}

//设置文件下载路径
export function setDownloadPath(path: string) {
    store.set('downloadPath', path)
}

//返回文件下载路径
export function getDownloadPath() {
    let downloadPath = store.get('downloadPath')
    if (downloadPath) {
        setDownloadPath(`D:\\CloudMusic`)
    }
    return downloadPath
}

//返回声音下载路径
export function getDownloadVoicePath() {
    //先获取默认下载路径
    let normalDownloadPath = getDownloadPath()
    //先去判断文件下载路径下面是否有MV文件夹 如果没有就去新建
    let voiceDownloadPath = normalDownloadPath + '\\电台节目'
    if (fs.existsSync(voiceDownloadPath)) {
        return voiceDownloadPath
    } else {
        fs.mkdirSync(voiceDownloadPath)
        return voiceDownloadPath
    }
}


//返回MV下载路径
export function getDownloadMVPath() {
    //先获取默认下载路径
    let normalDownloadPath = getDownloadPath()
    //先去判断文件下载路径下面是否有MV文件夹 如果没有就去新建
    let mvDownloadPath = normalDownloadPath + '\\MV'
    if (fs.existsSync(mvDownloadPath)) {
        return mvDownloadPath
    } else {
        fs.mkdirSync(mvDownloadPath)
        return mvDownloadPath
    }
}

//设置用户登录的cookie
export function setCookie(cookie: string) {
    store.set('cookie', cookie)
    return cookie
}

//返回用户登录的cookie
export function getCookie() {
    return store.get('cookie')
}

//设置用户扫描的文件夹
export function setUserScanFolder(path: string) {
    let scanDir = store.get('userScanFolder') || []
    scanDir.push(path)
    store.set('userScanFolder', scanDir)
}

//返回用户扫描的文件夹
export function getUserScanFolder() {
    return store.get('userScanFolder') || []
}

//设置用户选择扫描的文件夹
export function setUserCheckScanFolder(path: string[]) {
    store.set('userCheckScanFolder', path)
}

//返回用户选择扫描的文件夹
export function getUserCheckScanFolder() {
    // store.set('userCheckScanFolder', [])
    return store.get('userCheckScanFolder') || []
}

//设置163key
export function setSong163Key(filePath: string, key: string) {
    let song163Key = store.get('song163Key')
    song163Key[filePath] = key
    store.set('song163Key', song163Key)
}

//清空所有的163key（测试）
export function clear163key() {
    store.set('song163Key', {})
}

//返回163key
export function getSong163Key(filePath: string) {
    let song163Key = store.get('song163Key')
    if (Object.keys(song163Key).length) {
        return song163Key[filePath]
    } else {
        return null
    }

}