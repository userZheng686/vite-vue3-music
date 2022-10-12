import { loadIpcRendererCb, downloadProgressCallback } from '@/utils/mvDownload'
import { downloadItem } from 'i/view/videoDetail.d'
import type { Ref } from 'vue'
//MV下载
import { useDownload } from '@/store/download'
import { downloadMV } from '@/utils/request'

let download = useDownload()


export default function useDownloadMV(url: string, item: downloadItem, progress: Ref<number>, isDownload: Ref<boolean>) {
    loadIpcRendererCb(progress, isDownload)
    let index = download.downloadMVsInterrupted.findIndex(
        (interrupted) => interrupted.item.item.mvId === item.mvId
    );
    if (index !== -1) {
        //恢复之前下载的数据
        window.downloadAPI.resumeInterrupted(
            JSON.stringify(download.downloadMVsInterrupted[index])
        );
    } else {
        if (window.downloadAPI) {
            window.downloadAPI.downloadMV(url.replace(/http:\//, 'https:/'), JSON.stringify({ type: 3, item }))
        } else {
            downloadMV(url.replace(/http:\//, 'https:/'), item, downloadProgressCallback, progress).then(res => {
                let url = window.URL.createObjectURL(new Blob([res.data]))
                let link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                link.setAttribute('download', item.fileName)
                document.body.appendChild(link)
                link.click()
                link.remove()
            });
        }

    }
}