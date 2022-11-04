import os from "os";
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('desktopMiniAPI', {
    show: () => ipcRenderer.send('miniShow'),
    hide: () => ipcRenderer.send('miniHide'),
    getBounds: async () => await ipcRenderer.invoke('miniGetBounds'),
    setSize: async (width: number, height: number) => await ipcRenderer.invoke('miniSetSize', { width, height }),
    setBounds: async (x: number, y: number, width: number, height: number) => await ipcRenderer.invoke('miniSetBounds', x, y, width, height),
});

