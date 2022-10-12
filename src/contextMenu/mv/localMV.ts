import { downloadItem } from "i/view/videoDetail"
import { setComment } from "@/localStorage/set"
import { useMvShare } from "@/utils/dialogShare"
import { ElMessage } from "element-plus"
import { menusEvent } from "vue3-menus"
import { routerInstance } from "../routerInstance"
import { handleDownloadMV, handleCopyLink, loginCallback } from "../utils"

export function contextMenuLocalMVList(event: MouseEvent, item: downloadItem) {
    let list = [
        {
            label: `查看评论`,
            icon: "<i class='iconfont icon-pinglun1'></i>",
            tip: "",
            click: () => {
                setComment(item.mvId, 'mv')
            },
            show: true
        },
        {
            label: "播放",
            icon: "<i class='iconfont icon-24gl-playCircle'></i>",
            tip: "",
            click: () => {
                routerInstance.push({
                    path: '/mvDetail',
                    query: {
                        mvid: item.mvId
                    }
                })
            },
            show: true,
            divided: true
        },
        {
            label: '分享....',
            icon: "<i class='iconfont icon-fenxiang'></i>",
            tip: "",
            click: () => {
                loginCallback(() => {
                    useMvShare(item.mvId, item.cover, item.name, (status: { status: string }) => { console.log(status) })
                })
            },
            show: true
        },
        {
            label: "复制链接",
            icon: "<i class='iconfont icon-fuzhilianjie'></i>",
            tip: "",
            click: () => {
                handleCopyLink('playlist', item.mvId)
            },
            show: true
        },
        {
            label: "下载MV",
            icon: "<i class='iconfont icon-xiazai1'></i>",
            tip: "",
            click: () => {
                loginCallback(() => {
                    handleDownloadMV(item.mvId)
                })
                
            },
            show: item?.downloadStatus === 'complete' ? false : true,
        },
        {
            label: "打开文件所在目录",
            icon: "<i class='iconfont icon-sixin'></i>",
            tip: "",
            click: () => {
                if (window.desktopMainAPI) {
                    window.desktopMainAPI.openPathFolder(item.videoParam[0])
                }
            },
            show: item?.downloadStatus === 'complete' ? true : false,
        },
    ]
    list = list.filter(item => item.show)
    menusEvent(event, list, item);
}
