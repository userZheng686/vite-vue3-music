import { setCustomDownload, setDownloadSongs, setDownloadMVs, setDownloadVoices } from './store'
import { writeFileMusicMetadata } from './read'

interface param {
    item: any;
    type: number
}

//主要做两件事情
//设置下载完的数据放到客户端下载里面 这样页面下次取的时候就能取到了
//更新用户下载的歌曲id 将歌曲的id放进去
export function setStoreDownload(param: string) {
    //解构
    let paramOrigin: param = JSON.parse(param)
    setCustomDownload(paramOrigin.type, paramOrigin.item)
    //如果下载的是歌曲 那就把歌曲id填充进去
    //如果下载的是声音 那就把声音id填充进去
    //如果下载的是MV 那就把MVid填充进去
    if (paramOrigin.type === 1) {
        setDownloadSongs([paramOrigin.item.id])
        writeFileMusicMetadata(paramOrigin.item.songUrl, paramOrigin.item)
    } else if (paramOrigin.type === 2) {
        setDownloadVoices([paramOrigin.item.id])
    } else if (paramOrigin.type === 3) {
        setDownloadMVs([paramOrigin.item.mvId])
    }
}