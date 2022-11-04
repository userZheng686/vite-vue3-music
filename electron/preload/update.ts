import os from "os";
import { contextBridge, ipcRenderer } from 'electron';

let messageCallback : Function
let messageCallback2 : Function

contextBridge.exposeInMainWorld('desktopUpdateAPI', {
    show: () => ipcRenderer.send('updateShow'),
    hide: () => ipcRenderer.send('updateHide'),
    getBounds: async () => await ipcRenderer.invoke('updateGetBounds'),
    setSize: async (width: number, height: number) => await ipcRenderer.invoke('updateSetSize', { width, height }),
    setBounds: async (x: number, y: number, width: number, height: number) => await ipcRenderer.invoke('updateSetBounds', x, y, width, height),
    message : (f : Function) => messageCallback = f,
    message2 : (f : Function) => messageCallback2 = f,
    quitAndInstall : () => ipcRenderer.send('quitAndInstall'),
    downloadUpdate : () => ipcRenderer.send('downloadUpdate'),
    checkForUpdate : () => ipcRenderer.send('checkForUpdate'),
    checkAppVersion : () => ipcRenderer.send('checkAppVersion'),
});

ipcRenderer.on('message',(e,value) => {
    messageCallback && messageCallback(value);
    messageCallback2 && messageCallback2(value);
})

