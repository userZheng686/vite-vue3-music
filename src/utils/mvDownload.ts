import { downloadItem } from 'i/view/videoDetail.d'
import type { Ref } from 'vue'

//mv下载
import { useDownload } from '@/store/download'
let download = useDownload()

//下载回调(web)
export function downloadProgressCallback(progress: any, item: downloadItem, currentDownloadProgress: Ref<number>) {
    // progress对象中的loaded表示已经下载的数量，total表示总数量，这里计算出百分比
    item.currentProgress = Math.floor((progress.loaded / progress.total) * 100)
    if (item.currentProgress === 100) {
        download.setDownloadMVs(item)
        download.setCompleteDownloadMVItems(item)
    }
    download.setDownloadMVs(item)
    currentDownloadProgress.value = item.currentProgress
}

//监听下载进程
//如果download里面的列表没有当前的MVid  那么就是刚刚下载的MV 这时候需要填充进去
//如果有的话 那么就更新下载状态
//如果下载完毕 就把数据添加进去
export function loadIpcRendererCb(currentDownloadProgress?: Ref<number>, currentIsDownload?: Ref<boolean>) {
    if (window.ipcRenderer) {
        window.ipcRenderer.updateMVProgress((value: { type: number, item: downloadItem }) => {
            download.setDownloadMVs(value.item)
            if (currentDownloadProgress) {
                currentDownloadProgress.value = value.item.currentProgress
            }
        })

        window.ipcRenderer.completeMVDownload((value: { type: number, item: downloadItem }) => {
            download.setDownloadMVs(value.item)
            download.setCompleteDownloadMVItems(value.item)
        })

        //取消MV下载
        window.ipcRenderer.cancelMVDownload(async (mvid: number) => {
            download.cancelDownloadMV(mvid)
            if (currentDownloadProgress && currentIsDownload) {
                currentDownloadProgress.value = 0
                currentIsDownload.value = false
            }
        })
    }

}

