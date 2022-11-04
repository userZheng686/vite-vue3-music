import os from "os";
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('desktopLyricAPI', {
    show: () => ipcRenderer.send('lyricShow'),
    hide: () => ipcRenderer.send('lyricHide'),
    getBounds: async () => await ipcRenderer.invoke('lyricGetBounds'),
    setSize: async (width: number, height: number) => await ipcRenderer.invoke('lyricSetSize', { width, height }),
    setBounds: async (x: number, y: number, width: number, height: number) => await ipcRenderer.invoke('lyricSetBounds', x, y, width, height),
});

