import { app, session, Notification ,ipcMain, shell, DownloadItem, BrowserWindow, nativeImage } from 'electron';
import path from 'path'
import { readDir, readFileMusic, readFileMV, encode163Key } from './read'
// import { identifyMusic } from './identify'
import { openFolder, openSong } from './folder'
import { setStoreDownload } from './download'
import { setCookie, getCookie, setHistroyDownloadInterrupted, getHistroyDownloadInterrupted, clearHistroyDownloadInterrupted, clearAllHistoryDownloadInterrupted, setDownloadSongs, getDownloadSongs, clearDownloadSongs, getDownloadMVs, clearDownloadMVs, getDownloadPath, setDownloadPath, getCustomDownload, clearCustomDownload, setUserScanFolder, getUserScanFolder, setUserCheckScanFolder, getUserCheckScanFolder, getDownloadVoicePath, getDownloadMVPath, patchUpdateCustomDownload, getAllSong163Key, clear163key, getSong163Key } from './store'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import { LOAD_URL } from '../config';

interface Queue {
    [propnames: string]: {
        downloadParam: any;
        downloadType: number;
        downloadFileName: string;
        downloadPath: string;
        downloadItem: DownloadItem | null;
    }
}


// const winURL = process.env.NODE_ENV === "development" ? `https://192.168.3.3:4000/#/findMusic` : `${LOAD_URL}findMusic`;
const winURL = `https://localhost:4000/#/findMusic`

//下载的文件数据(参数 类型(1 歌曲 2 声音 3MV) 文件名 路径)
let downloadQueue: Queue = {};

let win: BrowserWindow

let playStatus: boolean = false

let offline : boolean = false

let icoIcon =
    !app.isPackaged ?
        path.join(__dirname, '../../public/icon.ico') :
        path.join(__dirname, '../icon.ico')

let prevIcon =
    !app.isPackaged ?
        path.join(__dirname, '../../public/ic_previous.png') :
        path.join(__dirname, '../ic_previous.png')

let playIcon =
    !app.isPackaged ?
        path.join(__dirname, '../../public/ic_play.png') :
        path.join(__dirname, '../ic_play.png')

let pauseIcon =
    !app.isPackaged ?
        path.join(__dirname, '../../public/ic_pause.png') :
        path.join(__dirname, '../ic_pause.png')

let nextIcon =
    !app.isPackaged ?
        path.join(__dirname, '../../public/ic_next.png') :
        path.join(__dirname, '../ic_next.png')


const setThumbarButtons = () => {
    win.setThumbarButtons([
        {
            tooltip: "上一曲",
            icon: nativeImage.createFromPath(prevIcon),
            click() {
                win.webContents.send('prev')
            },
        },
        {
            tooltip: playStatus ? "暂停" : '播放',
            icon: playStatus ? nativeImage.createFromPath(pauseIcon) : nativeImage.createFromPath(playIcon),
            click() {
                if (playStatus) {
                    win.webContents.send('pause')
                } else {
                    win.webContents.send('play')
                }
            },
        },
        {
            tooltip: "下一曲",
            icon: nativeImage.createFromPath(nextIcon),
            click() {
                win.webContents.send('next')
            },
        },
    ])
}

const createMainWindow = (browserWindow: typeof BrowserWindow) => {
    const obj = {
        autoHideMenuBar: false,
        frame: false,
        width: 1022,
        show: false,
        height: 670,
        backgroundColor: 'white',
        fullscreen: false,
        fullscreenable: true,
        minWidth: 1022,
        minHeight: 670,
        resizable: true,
        movable: true,
        closable: true,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            devTools: true,
            webSecurity: false,
            preload: path.join(__dirname, '../electron-preload/index.js')
        },
        minimizable: true,
        maximizable: true,
        icon: nativeImage.createFromPath(icoIcon),
        titleBarStyle: "hiddenInset",
    }
    win = new BrowserWindow(obj)

    if (app.isPackaged) {
        // win.loadURL('Icarus://./index.html/#/findMusic');
        win.loadFile(path.join(__dirname, "../index.html"), {
            hash: 'findMusic'
        });
        // win.webContents.openDevTools();
    } else {
        win.loadURL(winURL);
        win.webContents.openDevTools();
    }


    win.setThumbnailToolTip('网易云音乐')
    win.setMenu(null)
    win.setMovable(true)


    win.once('ready-to-show', () => {
        setTimeout(() => {
            global.loadingWindow.hide()
            win.show()
            setThumbarButtons()
        }, 2000)
    })

    return win
}

app.on('open-file',async (event,path) => {
    // 当用户想要在应用中打开一个文件时发出。 
    // 事件通常在应用已经打开，并且系统要再次使用该应用打开文件时发出。 
    // 也会在一个文件被拖到 dock 并且还没有运行的时候发出。 
    event.preventDefault()
    let result = await readFileMusic(path)
    win.webContents.send('openFile', JSON.stringify(result))
})


app.on('second-instance',async (event,argv) => {
    // 当用户想要在应用中打开一个文件时发出。 
    // 事件通常在应用已经打开，并且系统要再次使用该应用打开文件时发出。 
    // 也会在一个文件被拖到 dock 并且还没有运行的时候发出。 
    event.preventDefault()
    let result = await readFileMusic(argv[argv.length-1])
    win.webContents.send('openFile', JSON.stringify(result))
})

app.whenReady().then(() => {
    ipcMain.on('mainHide', () => {
        win.hide()
    })

    ipcMain.on('mainShow', () => {
        win.show()
        win.focus()
    })

    //聚焦
    ipcMain.on('mainFocus', () => {
        win.focus()
    })

    //最小化
    ipcMain.on('minimize', () => {
        console.log('minimize')
        win.minimize()
    })

    //还原
    ipcMain.on('revivification', () => {
        let isMaxImized = win.isMaximized()
        if (isMaxImized) {
            win.unmaximize()
        } else {
            win.maximize()
        }
    })

    //关闭
    ipcMain.on('close', () => {
        win.hide()
    })

    //链接跳转
    ipcMain.on('href', (event, url: string) => {
        shell.openExternal(url)
    })

    //更新状态
    ipcMain.on('status', (event, status: boolean) => {
        playStatus = status
        setThumbarButtons()
    })

    //桌面通知
    ipcMain.handle('notification',(event,option : {title : string,body : string,status: boolean}) => {
        if(offline === option.status) {
            return
        }
        offline = option.status
        new Notification({title:option.title, body:option.body, icon: nativeImage.createFromPath(icoIcon)}).show();
    })

    //读取目录 一定要用异步的 同步的会undefined
    ipcMain.handle('readDir', async (event, path: string) => {
        const file = await readDir(path)
        return file
    })

    //读取目录文件 一定要用异步的 同步的会undefined
    ipcMain.handle('readFileMusic', async (event, filePath: string) => {
        const file = await readFileMusic(filePath)
        return file
    })

    //读取目录文件 一定要用异步的 同步的会undefined
    ipcMain.handle('readFileMV', async (event, filePath: string) => {
        const file = await readFileMV(filePath)
        return file
    })

    //写入163key
    ipcMain.handle('write163Key', async (event, filePath: string, obj: string) => {
        const file = await encode163Key(filePath, JSON.parse(obj))
        return file
    })

    //返回所有的163key
    ipcMain.handle('getAllSong163Key', () => {
        return getAllSong163Key()
    })

    //读取对应路径的163key
    ipcMain.handle('getSong163Key', (event, filePath: string) => {
        return getSong163Key(filePath)
    })

    //清空所有的163key
    ipcMain.handle('clear163key', () => {
        return clear163key()
    })


    //读取音频文件（识别）
    // ipcMain.handle('identify', async (event, filePath: string) => {
    //     const metadata = await identifyMusic(filePath)
    //     return metadata
    // })

    //打开文件夹选择窗口
    ipcMain.handle('openFolder', async (event) => {
        let folderPath = await openFolder()
        return folderPath
    })

    //打开文件所在路径
    ipcMain.on('openPath', (event, path: string) => {
        shell.openPath(path)
    })

    //打开文件夹所在路径
    ipcMain.on('openPathFolder', (event, path: string) => {
        shell.showItemInFolder(path)
    })

    //打开音频文件选择窗口
    ipcMain.handle('openSong', async (event) => {
        let folderPath = await openSong()
        return folderPath
    })

    //读取用户cookie
    ipcMain.handle('getCookie', async (event) => {
        let cookie = getCookie()
        return cookie
    })

    //设置用户cookie
    ipcMain.handle('setCookie', (event, cookie: string) => {
        let cookies = setCookie(cookie)
        return cookies
    })

    //设置下载的歌曲id
    ipcMain.handle('setDownloadSongs', (event, ids: number[]) => {
        setDownloadSongs(ids)
    })

    //设置获取下载后的歌曲id
    ipcMain.handle('getDownloadSongs', (event) => {
        let ids = getDownloadSongs()
        return ids
    })

    //清空获取下载后的歌曲id(测试)
    ipcMain.handle('clearDownloadSongs', (event) => {
        clearDownloadSongs()
    })

    //设置获取下载后的mvid
    ipcMain.handle('getDownloadMVs', (event) => {
        let ids = getDownloadMVs()
        return ids
    })

    //清空下载后的mvid(测试)
    ipcMain.handle('clearDownloadMVs', (event) => {
        clearDownloadMVs()
    })

    //获取下载路径
    ipcMain.handle('getDownloadPath', (event) => {
        let path = getDownloadPath()
        return path
    })

    //设置下载路径
    ipcMain.handle('setDownloadPath', (event, path: string) => {
        setDownloadPath(path)
    })

    //获取用户选择扫描的路径
    ipcMain.handle('getUserScanFolder', (event) => {
        return getUserScanFolder()
    })

    //设置用户选择扫描的路径
    ipcMain.handle('setUserScanFolder', (event, path: string) => {
        setUserScanFolder(path)
    })

    //获取用户选择扫描的路径
    ipcMain.handle('getUserCheckScanFolder', (event) => {
        return getUserCheckScanFolder()
    })

    //设置用户选择扫描的路径
    ipcMain.handle('setUserCheckScanFolder', (event, path: string) => {
        setUserCheckScanFolder(JSON.parse(path))
    })

    //触发下载事件
    //url 下载地址
    //param json序列化后的数据
    ipcMain.handle('downloadSong', (event, url: string, param: string) => {
        downloadQueue[url] = {
            downloadParam: JSON.parse(param),
            downloadType: JSON.parse(param).type,
            downloadFileName: JSON.parse(param).item.fileName,
            // downloadFileName: 'asia' + '.' + JSON.parse(param).item.type,
            downloadPath: '',
            downloadItem: null
        }
        console.log('downloadFileName', JSON.parse(param).item.fileName)
        win.webContents.downloadURL(url)
    })

    //触发下载事件
    //url 下载地址
    //param json序列化后的数据
    ipcMain.handle('downloadMV', (event, url: string, param: string) => {
        downloadQueue[url] = {
            downloadParam: JSON.parse(param),
            downloadType: JSON.parse(param).type,
            downloadFileName: JSON.parse(param).item.fileName,
            downloadPath: '',
            downloadItem: null
        }
        win.webContents.downloadURL(url)
    })

    //批量更新本地客户端下载后的数据
    ipcMain.handle('patchUpdateCustomDownload', (event, type: number, list: string) => {
        patchUpdateCustomDownload(type, JSON.parse(list))
    })

    //获取本地客户端下载后的数据
    //type 类型 1 对应歌曲 2对应声音 3对应mv
    ipcMain.handle('getCustomDownload', (event, type: number) => {
        return getCustomDownload(type)
    })

    //清空本地客户端下载的数据(测试)
    ipcMain.handle('clearCustomDownload', (event, type: number) => {
        return clearCustomDownload(type)
    })

    //暂停下载
    ipcMain.handle('pause', (event, type: string, url?: string) => {
        if (type === 'single' && url) {
            if (downloadQueue[url].downloadParam.item.downloadStatus === 'resume' || downloadQueue[url].downloadParam.item.downloadStatus === 'begin') {
                downloadQueue[url].downloadItem?.pause()
                downloadQueue[url].downloadParam.item.downloadStatus = 'pause'
                win.webContents.send('updateSongDownloadProgressing', JSON.stringify(downloadQueue[url].downloadParam))
            }
        } else if (type === 'all') {
            console.log('queue', downloadQueue)
            Object.keys(downloadQueue).forEach(item => {
                if (downloadQueue[item].downloadParam.item.downloadStatus === 'resume' || downloadQueue[item].downloadParam.item.downloadStatus === 'begin') {
                    downloadQueue[item].downloadItem?.pause()
                    downloadQueue[item].downloadParam.item.downloadStatus = 'pause'
                    win.webContents.send('updateSongDownloadProgressing', JSON.stringify(downloadQueue[item].downloadParam))
                }
            })
        }
    })

    //恢复下载
    ipcMain.handle('resume', (event, type: string, url?: string) => {
        if (type === 'single' && url) {
            if (downloadQueue[url].downloadParam.item.downloadStatus === 'pause') {
                downloadQueue[url].downloadItem?.resume()
                downloadQueue[url].downloadParam.item.downloadStatus = 'resume'
                win.webContents.send('updateSongDownloadProgressing', JSON.stringify(downloadQueue[url].downloadParam))
            }
        } else if (type === 'all') {
            Object.keys(downloadQueue).forEach(item => {
                if (downloadQueue[item].downloadParam.item.downloadStatus === 'pause') {
                    downloadQueue[item].downloadItem?.resume()
                    downloadQueue[item].downloadParam.item.downloadStatus = 'resume'
                    win.webContents.send('updateSongDownloadProgressing', JSON.stringify(downloadQueue[item].downloadParam))
                }
            })
        }
    })

    //清空全部
    ipcMain.handle('clear', (event, url: string) => {
        let urls = JSON.parse(url)
        urls.forEach((item: string) => {
            if (downloadQueue[item]) {
                downloadQueue[item].downloadItem?.cancel()
                if (downloadQueue[item].downloadParam.item.id) {
                    win.webContents.send('cancelSongDownload', downloadQueue[item].downloadParam.item.id)
                } else if (downloadQueue[item].downloadParam.item.mvId) {
                    win.webContents.send('cancelMVDownload', downloadQueue[item].downloadParam.item.mvId)
                }
                delete downloadQueue[item]
            }
        })
        //清空全部下载的记录
        clearAllHistoryDownloadInterrupted();
    })

    //获取未完成下载的文件数据
    ipcMain.handle('getHistroyDownloadInterrupted', () => {
        return getHistroyDownloadInterrupted()
    })

    //测试 清空未下载完歌曲
    ipcMain.handle('clearAllHistoryDownloadInterrupted', () => {
        clearAllHistoryDownloadInterrupted()
    })

    //实时传递当前下载的情况 因为渲染进程监听不到主进程发出的事件 所以通过回调形式来传递当前情况
    session.defaultSession.on('will-download', (e, item) => {
        //取出下载队列的对象
        let queueItem = downloadQueue[item.getURL()]

        //拷贝一份当前在下载的实例 因为不能将下载的实例传递到渲染进程
        if (!queueItem.downloadItem) {
            queueItem.downloadItem = item
        }
        if (queueItem.downloadType === 1) {
            queueItem.downloadPath = path.join(getDownloadPath(), queueItem.downloadFileName);
        } else if (queueItem.downloadType === 2) {
            queueItem.downloadPath = path.join(getDownloadVoicePath(), queueItem.downloadFileName);
        } else if (queueItem.downloadType === 3) {
            queueItem.downloadPath = path.join(getDownloadMVPath(), queueItem.downloadFileName);
        }

        console.log('path', queueItem.downloadPath)
        queueItem.downloadItem.setSavePath(queueItem.downloadPath);

        // item.pause()
        //防止多次进度条重复调用渲染进程函数
        let progress = 0, prevProgress: number;

        //监听下载过程，计算并设置进度条进度
        queueItem.downloadItem.on('updated', (evt, state) => {
            console.log('state', state)
            if ('progressing' === state) {
                //此处  用接收到的字节数和总字节数求一个比例  就是进度百分比
                if (item.getReceivedBytes() && item.getTotalBytes()) {
                    progress = parseInt(
                        100 * (
                            item.getReceivedBytes() / item.getTotalBytes()
                        )
                    )
                }

                console.log('progress', progress)
                //计算下载速度
                queueItem.downloadParam.item.downloadReceivedBytes = item.getReceivedBytes() - queueItem.downloadParam.item.downloadReceivedBytes

                if (prevProgress === progress) return;
                else prevProgress = progress
                if (queueItem.downloadType === 1 || queueItem.downloadType === 2) {
                    queueItem.downloadParam.item.progress = progress
                } else if (queueItem.downloadType === 3) {
                    queueItem.downloadParam.item.currentProgress = progress
                }
                // 把百分比发给渲染进程进行展示
                // mainWindow.webContents.send('updateProgressing', value);
                // mac 程序坞、windows 任务栏显示进度
                // mainWindow.setProgressBar(value);
            }
            let historyParam = {
                eTag: queueItem.downloadItem?.getETag(),
                lastModified: queueItem.downloadItem?.getLastModifiedTime(),
                startTime: item.getStartTime(),
                offset: item.getReceivedBytes(),
                length: item.getTotalBytes(),
                type: queueItem.downloadType,
                urlChain: item.getURLChain(),
                item: queueItem.downloadParam,
                path: queueItem.downloadPath,
                fileName: queueItem.downloadFileName
            }
            if (queueItem.downloadType === 1 || queueItem.downloadType === 2) {
                win.webContents.send('updateSongDownloadProgressing', JSON.stringify(queueItem.downloadParam))
            } else if (queueItem.downloadType === 3) {
                win.webContents.send('updateMVDownloadProgressing', JSON.stringify(queueItem.downloadParam))
            }
            setHistroyDownloadInterrupted(historyParam)

            //手动暂停方便测试
            setTimeout(() => {
                // queueItem.downloadItem?.pause()
            }, 300)

        });
        //监听下载结束事件
        queueItem.downloadItem.on('done', (e, state) => {
            if (state === 'completed') {
                //下载结束了 那就把对应的下载资源的数据存到store中 等页面下次加载的时候直接去里面取 不用调请求了
                //更新下载时间 下载来源 下载路径（音乐播放时用到）
                if (queueItem.downloadType === 1) {
                    queueItem.downloadParam.item.downloadTime = new Date().getTime()
                    queueItem.downloadParam.item.from.path = '本地'
                    queueItem.downloadParam.item.songUrl = queueItem.downloadPath
                } else if (queueItem.downloadType === 2) {
                    queueItem.downloadParam.item.downloadTime = new Date().getTime()
                    queueItem.downloadParam.item.from.path = '本地'
                    queueItem.downloadParam.item.songUrl = queueItem.downloadPath
                } else if (queueItem.downloadType === 3) {
                    queueItem.downloadParam.item.videoParam[0] = queueItem.downloadPath
                }

                //更新下载状态
                queueItem.downloadParam.item.downloadStatus = 'complete'


                setStoreDownload(JSON.stringify(queueItem.downloadParam))

                if (queueItem.downloadType === 1 || queueItem.downloadType === 2) {
                    win.webContents.send('completeSongDownload', JSON.stringify(queueItem.downloadParam))
                } else if (queueItem.downloadType === 3) {
                    win.webContents.send('completeMVDownload', JSON.stringify(queueItem.downloadParam))
                }
                clearHistroyDownloadInterrupted(queueItem.downloadParam.item.fileName)
            }

            // //如果窗口还在的话，去掉进度条
            // if (!mainWindow.isDestroyed()) {
            //     mainWindow.setProgressBar(-1);
            // }
            // //下载被取消或中断了
            // if (state === 'interrupted') {
            //     electron.dialog.showErrorBox('下载失败', `文件 ${item.getFilename()} 因为某些原因被中断下载`);
            // }
            // // 下载成功后打开文件所在文件夹
            // if (state === 'completed') {
            //     setTimeout(() => {
            //         shell.showItemInFolder(filePath)
            //     }, 1000);
            // }
        });

        //是否可恢复下载
        if (queueItem.downloadItem.canResume) {
            queueItem.downloadItem.resume()
        }
    })

    //恢复下载
    ipcMain.handle('resumeInterrupted', (event, items: string) => {
        let { path, urlChain, offset, length, lastModified, eTag, startTime, item, fileName, type } = JSON.parse(items) as Interrupted
        downloadQueue[urlChain[0]] = {
            downloadParam: item,
            downloadType: type,
            downloadFileName: fileName,
            downloadPath: '',
            downloadItem: null
        }
        //更新下载状态
        downloadQueue[urlChain[0]].downloadParam.item.downloadStatus = 'resume'
        session.defaultSession.createInterruptedDownload({
            path,
            urlChain,
            offset, // 下载断点开始位置
            length,
            lastModified, //
            eTag, // 
            startTime
        })
    })

})


export default createMainWindow