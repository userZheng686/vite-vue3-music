import type { IpcRenderer } from "electron/renderer";

export interface desktopLyric {
    getBounds: Function;
    setBounds: Function;
    setSize: Function;
    show: Function;
    hide: Function;
}

export interface desktopUpdate {
    getBounds: Function;
    setBounds: Function;
    setSize: Function;
    show: Function;
    hide: Function;
    message : Function;
    checkForUpdate : Function;
    checkAppVersion : Function;
    downloadUpdate : Function;
}

export interface desktopMini {
    getBounds: Function;
    setBounds: Function;
    setSize: Function;
    show: Function;
    hide: Function;
}



export interface desktopMain {
    notification : Function;
    show: Function;
    hide: Function;
    focus: Function;
    minimize: Function;
    revivification: Function;
    close: Function;
    href: Function;
    openPath: Function;
    openPathFolder: Function;
    exit : Function;
}

export interface read {
    readDir: Function;
    readFileMusic: Function;
    readFileMV: Function;
    write163Key: Function;
}



export interface folder {
    getUserScanFolder: Function;
    setUserScanFolder: Function;
    getUserCheckScanFolder: Function;
    setUserCheckScanFolder: Function;
    openFolder: Function;
    openSong: Function;
}

export interface cookie {
    setCookie: Function;
    getCookie: Function;
}

export interface download {
    getAllSong163Key : Function;
    getSong163Key : Function;
    clear163key : Function;
    getCustomDownload: Function;
    getDownloadSongs: Function;
    getDownloadPath: Function;
    clearCustomDownload: Function;
    clearDownloadSongs: Function;
    setDownloadSongs: Function;
    downloadSong: Function;
    downloadMV: Function;
    pause: Function;
    resume: Function;
    clear: Function;
    patchUpdateCustomDownload: Function;
    getHistroyDownloadInterrupted: Function;
    resumeInterrupted: Function;
}

export interface ipcRenderer {
    openFile : Function;
    updateSongProgress: Function;
    completeSongDownload: Function;
    cancelSongDownload: Function;
    updateMVProgress: Function;
    completeMVDownload: Function;
    cancelMVDownload: Function;
    prev: Function,
    play: Function,
    pause: Function,
    next : Function,
    updateStatus : Function
}

export interface playAPICallback {
    enterSongDetail: Function;
    prevSong: Function;
    playMusic: Function;
    nextSong: Function;
    forward: Function;
    rewind: Function;
}

export interface playAPI {
    enterSongDetail: Function;
    prevSong: Function;
    playMusic: Function;
    nextSong: Function;
    forward: Function;
    rewind: Function;
}

declare global {
    interface Window {
        readAPI: read;
        folderAPI: folder;
        cookieAPI: cookie;
        downloadAPI: download;
        ipcRenderer: ipcRenderer;
        desktopLyricAPI: desktopLyric;
        desktopMiniAPI: desktopMini;
        desktopMainAPI: desktopMain;
        playAPICallback: playAPICallback;
        playAPI: playAPI;
        desktopUpdateAPI : desktopUpdate;
    }
    interface Interrupted {
        eTag: string | undefined;
        lastModified: string | undefined;
        startTime: number;
        offset: number;
        length: number;
        type: number;
        urlChain: string[];
        item: any;
        path: string;
        fileName: string;
    }
}
