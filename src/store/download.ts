//这个store主要存储两种状态
//第一个是正在下载的歌曲状态（页面展示）
//第二个是获取已经下载完毕的歌曲（包含云盘上传 云盘下载 正常下载 本地等等） 这个数据从window.downloadAPI.getDownloadSongs拿

import { ref } from 'vue'
import { defineStore } from "pinia";
import { Names } from '../interface/store/enum.d'
//歌曲列表声明
import { SongDetailSongsItem } from "i/api/api_song.d";
//mv声明
import { downloadItem } from 'i/view/videoDetail.d'
import { list } from '@/localStorage/init'

interface downloadMVItem extends downloadItem {
    fileSize: string;
}

//下载歌曲的状态
let downloadSongs: SongDetailSongsItem[] = []
//未下载完的歌曲
let downloadSongsInterrupted: Interrupted[] = []
//下载声音的状态
let downloadVoices: SongDetailSongsItem[] = []
//未下载完的声音
let downloadVoicesInterrupted: Interrupted[] = []
//下载MV的状态
let downloadMVs: downloadItem[] = []
//未下载完的MV
let downloadMVsInterrupted: Interrupted[] = []
//已经下载完的所有歌曲id
let completeDownloadSongsIds = ref<number[]>([])
//已经下载完的所有歌曲Item
let completeDownloadSongItem = ref<SongDetailSongsItem[]>([])
//已经下载完的所有声音Item
let completeDownloadVoiceItem = ref<SongDetailSongsItem[]>([])
//已经下载完的所有MVItem
let completeDownloadMVItems = ref<Array<downloadMVItem>>([])

//下载目录
let songDir = ref<string>('')
let voiceDir = ref<string>('')

//获取没有下载完的歌曲 MV数据
let getInterruptedDownloadItem = async () => {
    let history = await window.downloadAPI.getHistroyDownloadInterrupted()
    history?.forEach((item: Interrupted) => {
        if (item.item.type === 1) {
            item.item.item.downloadStatus = 'interrupted'
            downloadSongs.push(item.item.item)
            downloadSongsInterrupted.push(item)
        } else if (item.item.type === 2) {
            item.item.item.downloadStatus = 'interrupted'
            downloadVoices.push(item.item.item)
            downloadVoicesInterrupted.push(item)
        } else if (item.item.type === 3) {
            item.item.item.downloadStatus = 'interrupted'
            downloadMVs.push(item.item.item)
            downloadMVsInterrupted.push(item)
        }
    })
}

//获取已经下载完的所有歌曲列表
let getCompleteDownloadSongItem = async () => {
    //下载目录
    songDir.value = await window.downloadAPI.getDownloadPath();
    //读取本地文件
    let songDirFile = await window.readAPI.readDir(songDir.value);
    //读取客户端下载
    let downloadSongList = await window.downloadAPI.getCustomDownload(1);
    //客户端下载的文件名
    let downloadSongListFileName = downloadSongList?.map((item: SongDetailSongsItem) => {
        let path = item.songUrl?.split(/\\/g);
        if (path?.length) {
            return path[path.length - 1];
        }
    });
    if(!downloadSongListFileName) return
    //比对 拿本地下载的文件去对比客户端下载列表 找到符合的
    songDirFile = songDirFile?.filter((item: string) => {
        return downloadSongListFileName.includes(item);
    });
    //比对 如果歌曲列表里面含有不是本地下载的文件 就先过滤
    downloadSongList = downloadSongList?.filter((item: SongDetailSongsItem) => {
        let path = item.songUrl?.split(/\\/g);
        if (path) {
            let fileName = path[path.length - 1];
            return songDirFile.includes(fileName);
        } else {
            return false;
        }
    });
    songDirFile?.forEach(async (item: string, index: number) => {
        let path = songDir.value + "\\" + item
        let file = await window.readAPI.readFileMusic(path);
        let parseFile = JSON.parse(file);
        let voiceListIndex = downloadSongList.findIndex(
            (items: SongDetailSongsItem) => items.fileName === item
        );
        if (voiceListIndex !== -1) {
            downloadSongList[voiceListIndex].fileSize = parseFile.fileSize;
            downloadSongList[voiceListIndex].from = {
                path: 'localDownload',
                name: '我下载的音乐',
                val: {
                    type: 1,
                    key: 'song'
                }
            }
        }

        if (index === songDirFile.length - 1) {
            completeDownloadSongItem.value = downloadSongList;
            completeDownloadSongsIds.value = completeDownloadSongItem.value.map(item => Number(item.id));
            // window.downloadAPI.patchUpdateCustomDownload(1, JSON.stringify(completeDownloadSongItem.value))
        }
    });

}

//获取已经下载完的所有声音列表
let getCompleteDownloadVoiceItem = async () => {
    //下载目录
    voiceDir.value = await window.downloadAPI.getDownloadPath();
    voiceDir.value += "\\电台节目";
    //读取本地文件
    let voiceDirFile = await window.readAPI.readDir(voiceDir.value);
    //读取客户端下载
    let downloadVoiceList = await window.downloadAPI.getCustomDownload(2);
    //所有下载过的声音文件名
    let downloadVoiceListFileName = downloadVoiceList?.map((item:SongDetailSongsItem) => {
        let path = item.songUrl?.split(/\\/g);
        if (path?.length) {
            return path[path.length - 1];
        }
    });
    if(!downloadVoiceListFileName) return
    //比对 拿本地下载的文件去对比声音列表 找到符合的 再去读取信息
    voiceDirFile = voiceDirFile?.filter((item: string) => {
        return downloadVoiceListFileName.includes(item);
    });
    //比对 如果声音列表里面含有不是本地下载的文件 就先过滤
    downloadVoiceList = downloadVoiceList?.filter((item : SongDetailSongsItem) => {
        let path = item.songUrl?.split(/\\/g);
        if (path) {
            let fileName = path[path.length - 1];
            return voiceDirFile.includes(fileName);
        } else {
            return false;
        }
    });
    voiceDirFile?.forEach(async (item: string, index: number) => {
        let file = await window.readAPI.readFileMusic(voiceDir.value + "\\" + item);
        let parseFile = JSON.parse(file);
        let voiceListIndex = completeDownloadVoiceItem.value.findIndex(
            (items) => items.songUrl === voiceDir.value + "\\" + item
        );
        if (voiceListIndex !== -1) {
            completeDownloadVoiceItem.value[voiceListIndex].fileSize = parseFile.fileSize + "MB";
            completeDownloadVoiceItem.value[voiceListIndex].from = {
                path: 'localDownload',
                name: '我下载的声音',
                val: {
                    type: 1,
                    key: 'voice'
                }
            }
        }
        if (index === voiceDirFile.length - 1) {
            completeDownloadVoiceItem.value = downloadVoiceList;
            // window.downloadAPI.patchUpdateCustomDownload(2, JSON.stringify(completeDownloadVoiceItem.value))
        }
    });

}

//获取已经下载完的所有mv列表
let getCompleteDownloadMVItem = async () => {
    completeDownloadMVItems.value = []
    //下载目录
    let dirPath = await window.downloadAPI.getDownloadPath();
    //读取MV下载目录的所有文件
    let mvDirPath = await window.readAPI.readDir(dirPath + "\\MV");
    //读取已经下载过的所有MV列表
    let downloadMVList = await window.downloadAPI.getCustomDownload(3);
    //所有下载过的MV文件名
    let downloadMVListFileName = downloadMVList?.map((item: { fileName: string }) => {
        return item.fileName;
    });
    if(!downloadMVListFileName) return;
    //比对 拿本地下载的文件去对比MV列表 找到符合的 再去读取信息
    mvDirPath = mvDirPath?.filter((item: string) => {
        return downloadMVListFileName.includes(item);
    });
    //比对 如果MV列表里面含有不是本地下载的文件 就先过滤
    downloadMVList = downloadMVList?.filter((item: { fileName: string }) => {
        return mvDirPath.includes(item.fileName);
    });
    
    //过滤 比对数据
    mvDirPath?.forEach(async (item: string, index: number) => {
        let path = dirPath + "\\MV" + "\\" + item
        let fileSize = await window.readAPI.readFileMV(path);
        let mvListIndex = downloadMVList.findIndex(
            (items: downloadMVItem) => items.fileName === item
        );
        if (mvListIndex !== -1) {
            let MVItem = { ...downloadMVList[mvListIndex] };
            MVItem.fileSize = fileSize + "MB";
            //将符合的数据填充到MVList里面
            completeDownloadMVItems.value.push(MVItem);
        }

        if (index === mvDirPath.length - 1) {
            // window.downloadAPI.patchUpdateCustomDownload(3, JSON.stringify(completeDownloadMVItems.value))
        }
    });
};

if (window.downloadAPI) {
    getInterruptedDownloadItem();
    getCompleteDownloadSongItem();
    getCompleteDownloadVoiceItem();
    getCompleteDownloadMVItem();
}


export const useDownload = defineStore(Names.DOWNLOAD, {
    state: () => {
        return {
            downloadSongs,
            downloadSongsInterrupted,
            downloadVoices,
            downloadVoicesInterrupted,
            downloadMVs,
            downloadMVsInterrupted,
            completeDownloadMVItems,
            completeDownloadSongItem,
            completeDownloadVoiceItem,
            completeDownloadSongsIds,
            songDir,
            voiceDir
        }
    },
    getters: {

    },
    actions: {
        //设置下载歌曲列表
        //处理两个情况 如果是没有填充过 那就填充 如果有填充 那么就更新下载进度
        setDownloadSongs(val: SongDetailSongsItem) {
            let { id, progress, downloadStatus, downloadReceivedBytes } = val
            let index = this.downloadSongs.findIndex((item) => item.id === id)
            if (index === -1) {
                this.downloadSongs.push(val)
            } else {
                //如果已经有填充了 那么就先找到位置 在更新
                this.downloadSongs[index].progress = progress
                this.downloadSongs[index].downloadStatus = downloadStatus
                this.downloadSongs[index].downloadReceivedBytes = downloadReceivedBytes
                //如果下载完毕 并且localStorage列表有这首歌曲 那就更新
                if (downloadStatus === 'complete') {
                    let listIndex = list.value.findIndex(item => item.id === val.id)
                    if (listIndex !== -1) {
                        list.value[listIndex] = val
                    }
                }

            }
        },
        //取消歌曲下载
        cancelDownloadSong(id: number) {
            let index = this.downloadSongs.findIndex(item => {
                return item.id === id
            })
            this.downloadSongs.splice(index, 1)
        },
        //设置下载MV列表
        //处理两个情况 如果是没有填充过 那就填充 如果有填充 那么就更新下载进度
        setDownloadMVs(val: downloadItem) {
            let { mvId, currentProgress, downloadStatus, downloadReceivedBytes } = val
            let index = this.downloadMVs.findIndex((item) => item.mvId === mvId)
            if (index === -1) {
                this.downloadMVs.push(val)
            } else {
                //如果已经有填充了 那么就先找到位置 在更新
                this.downloadMVs[index].currentProgress = currentProgress
                this.downloadMVs[index].downloadStatus = downloadStatus
                this.downloadMVs[index].downloadReceivedBytes = downloadReceivedBytes

            }
        },
        //如果歌曲下载完毕 那就更新进去
        setCompleteDownloadSongsIds(id: number) {
            if (!this.completeDownloadSongsIds.includes(id)) {
                this.completeDownloadSongsIds.push(id)
            }
            let index = downloadSongsInterrupted.findIndex(item => item.item.id === id)
            if (index !== -1) {
                this.downloadSongsInterrupted.splice(index, 1)
            }
        },
        //如果MV下载完毕 那就更新进去
        setCompleteDownloadMVItems(item: downloadItem) {
            this.completeDownloadMVItems.push(item)
            let index = downloadMVsInterrupted.findIndex(interrupted => interrupted.item.mvId === item.mvId)
            if (index !== -1) {
                this.downloadMVsInterrupted.splice(index, 1)
            }
        },
        //取消MV下载
        cancelDownloadMV(mvid: number) {
            let index = this.downloadMVs.findIndex(item => {
                return item.mvId === mvid
            })
            this.downloadMVs.splice(index, 1)
        },
        //更新 读取本地下载歌曲
        updateSong() {
            if (window.downloadAPI) {
                getCompleteDownloadSongItem()
            }

        },
        //更新 读取本地下载歌曲
        updateVoice() {
            if (window.downloadAPI) {
                getCompleteDownloadVoiceItem()
            }

        },
        //更新 读取本地下载歌曲
        updateMV() {
            if (window.downloadAPI) {
                getCompleteDownloadMVItem()
            }

        }
    }
})