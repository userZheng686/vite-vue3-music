//下载功能 支持浏览器和electron（客户端）
import { ElMessage } from 'element-plus';
import { downloadSong } from '@/utils/request'
import { getSongDownloadUrl } from "@/api/api_song";
//用户信息
import { useUserInformation } from '@/store/user'
//歌曲下载
import { useDownload } from '@/store/download'

//歌曲列表声明
import { SongDetailSongsItem } from "i/api/api_song.d";
//登录弹窗
import { usePopupStore } from './../store/popup';


let userInfo = useUserInformation()
let popup = usePopupStore()
let download = useDownload()



//开启下载队列 队列中只能实时下载一个
//拷贝一份当前在下载的歌曲 因为json序列化后丢失了响应式 所以浅拷贝一份 修改后页面也能侦听到
let downloadQueue: {
    [id: string]: {
        item: SongDetailSongsItem
    }
} = {}


//监听下载进程
//如果download里面的列表没有当前的歌曲id  那么就是刚刚下载的歌曲 这时候需要填充进去
//如果有的话 那么就更新下载状态
//监听主进程的下载事件 如果ok了 那就继续发送下载请求
if (window.ipcRenderer) {
    window.ipcRenderer.updateSongProgress(async (value: { type: number, item: SongDetailSongsItem }) => {
        download.setDownloadSongs(value.item)
        if (!downloadQueue[value.item.id]) {
            downloadQueue[value.item.id] = {
                item: value.item
            }
        } else {
            downloadQueue[value.item.id].item.progress = value.item.progress
        }
    })

    window.ipcRenderer.completeSongDownload(async (value: { type: number, item: SongDetailSongsItem }) => {
        downloadQueue[value.item.id].item.songUrl = value.item.songUrl;
        download.setDownloadSongs(value.item)
        download.setCompleteDownloadSongsIds(Number(value.item.id))
    })

    //取消歌曲下载
    window.ipcRenderer.cancelSongDownload(async (id: number) => {
        download.cancelDownloadSong(id)
        downloadQueue[id].item.progress = 0
        delete downloadQueue[id]
    })
}


//下载回调
let downloadProgressCallback = (progress: any, item: SongDetailSongsItem) => {
    // progress对象中的loaded表示已经下载的数量，total表示总数量，这里计算出百分比
    item.progress = Math.floor((progress.loaded / progress.total) * 100)
    if (item.progress === 100) {
        item.downloadStatus = 'complete'
        download.setCompleteDownloadSongsIds(Number(item.id))
    }
    download.setDownloadSongs(item)
}




//下载音乐
//如果id等于0 那就是本地的音乐 不要下载 
//如果不是云盘文件 那么判断权限 如果是vip歌曲就不能下载
//如果以上条件都不符合 那么就是可以下载的数据 首先将下载的数据填充到download里面
let downloadMusic = async (item: SongDetailSongsItem) => {
    if (!userInfo.user_profile.isLogin) {
        ElMessage.warning('请先登录 在完成后续操作')
        popup.isOpenLoginPopup = true
    }
    if (downloadQueue[item.id]) return;
    let { fee, id, name, from: { path } } = item
    //目前下载接受的总字节数（下载速度）
    item.downloadReceivedBytes = 0
    if (!id || typeof id === 'string') {
        return;
    }
    if (download.completeDownloadSongsIds.includes(id)) {
        return;
    }
    if (fee !== 0 && userInfo.user_profile.vipType === 0 && path !== 'musicDisk') {
        ElMessage.warning("这首歌只能vip下载");
        return;
    }
    downloadQueue[id] = { item }
    let index = download.downloadSongsInterrupted.findIndex(
        (item) => item.item.item.id === id
    );
    if (index !== -1) {
        //恢复之前下载的数据
        window.downloadAPI.resumeInterrupted(
            JSON.stringify(download.downloadSongsInterrupted[index])
        );
    } else {
        downloadMusicUrl(id, item)
    }
};

//下载音乐（队列）
let downloadMusicUrl = async (id: number, item: SongDetailSongsItem) => {
    try {
        let { data: { url, encodeType } } = await getSongDownloadUrl(id);
        //更改为https下载
        url = url.replace(/http:\//, 'https:/')

        //设置下载状态
        item.downloadStatus = 'begin'
        //url
        item.downloadUrl = url
        //type
        if (!item.type) {
            if (item.pc) {
                let downloadType = item.pc.fn.split(/\./g)
                item.type = downloadType[downloadType.length - 1]
            } else {
                let downloadType = url.split(/\./g)
                item.type = downloadType[downloadType.length - 1]
            }
        }



        //文件名 作者 - 文件名.格式
        let fileName = ''

        if (item.pc) {
            fileName += item.pc.ar
        } else if (item.ar?.length) {
            item.ar.forEach((items, index) => {
                if (index > 0) {
                    fileName += ' / ' + items.name
                } else {
                    fileName += items.name
                }
            })
        } else if (item.artists?.length) {
            item.artists.forEach((items, index) => {
                if (index > 0) {
                    fileName += ' / ' + items.name
                } else {
                    fileName += items.name
                }
            })
        }

        fileName += ' - ' + item.name + '.' + item.type
        //对特殊符号进行全角化
        fileName = fileName.replace(/\/|\\|<|>/g, function (str) {
            return String.fromCharCode(str.charCodeAt(0) + 65248);
        })
        item.fileName = fileName
        //下载歌曲
        let type = item.radio ? 2 : 1

        url += '?xymod=2&xyssl=1'

        if (window.downloadAPI) {
            window.downloadAPI.downloadSong(url, JSON.stringify({ type, item }))
        } else {
            downloadSong(url, item, downloadProgressCallback).then(res => {
                let url = window.URL.createObjectURL(new Blob([res.data]))
                let link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                link.setAttribute('download', fileName)
                document.body.appendChild(link)
                link.click()
                link.remove()
            });
        }
    } catch (e) {

    }
}



export {
    downloadMusic
}