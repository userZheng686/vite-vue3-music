import { getCollectMv } from "@/api/api_collect"
import { VideoSubListItem } from "@/interface/api/api_video"
import { setComment } from "@/localStorage/set"
import { useMvShare } from "@/utils/dialogShare"
import { ElMessage } from "element-plus"
import { menusEvent } from "vue3-menus"
import { routerInstance } from "../routerInstance"
import { handleDownloadMV, handleCopyLink, loginCallback } from "../utils"

//刷新页面
let refreshList: Function = () => { }

export function contextMenuCollectMVList(event: MouseEvent, item: VideoSubListItem) {
    let list = [
        {
            label: `查看评论`,
            icon: "<i class='iconfont icon-pinglun1'></i>",
            tip: "",
            click: () => {
                setComment(Number(item.vid), 'mv')
            },
        },
        {
            label: "播放",
            icon: "<i class='iconfont icon-24gl-playCircle'></i>",
            tip: "",
            click: () => {
                routerInstance.push({
                    path: '/mvDetail',
                    query: {
                        mvid: Number(item.vid)
                    }
                })
            },
            divided: true
        },
        {
            label: '分享....',
            icon: "<i class='iconfont icon-fenxiang'></i>",
            tip: "",
            click: () => {
                loginCallback(() => {
                    useMvShare(Number(item.vid), item.coverUrl, item.title, (status: { status: string }) => { console.log(status) })
                })
            },
        },
        {
            label: "下载MV",
            icon: "<i class='iconfont icon-xiazai1'></i>",
            tip: "",
            click: () => {
                loginCallback(() => {
                    handleDownloadMV(Number(item.vid))
                })

            },
        },
        {
            label: "复制链接",
            icon: "<i class='iconfont icon-fuzhilianjie'></i>",
            tip: "",
            click: () => {
                handleCopyLink('mv', Number(item.vid))
            },
            divided: true
        },
        {
            label: "删除视频",
            icon: "<i class='iconfont icon-shanchu'></i>",
            tip: "",
            click: () => {
                loginCallback(async () => {
                    try {
                        let res = await getCollectMv(Number(item.vid), 2)
                        ElMessage.success('删除成功')
                        refreshList(item.vid)
                    } catch (e: any) {
                        ElMessage.success('删除失败')
                    }
                })

            },
        },
    ]

    menusEvent(event, list, item);

}

export function refreshCallback(callback: Function) {
    refreshList = callback
}   
