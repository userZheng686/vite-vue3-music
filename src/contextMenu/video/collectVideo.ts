import { VideoSubListItem } from "i/api/api_video"
import { setComment } from "@/localStorage/set"
import { useVideoShare } from "@/utils/dialogShare"
import { ElMessage } from "element-plus"
import { menusEvent } from "vue3-menus"
import { routerInstance } from "../routerInstance"
import { handleCopyLink, loginCallback } from "../utils"
import { getCollectVideo } from "@/api/api_collect"

//刷新页面
let refreshList: Function = () => { }

export function contextMenuCollectVideoList(event: MouseEvent, item: VideoSubListItem) {
    let list = [
        {
            label: `查看评论`,
            icon: "<i class='iconfont icon-pinglun1'></i>",
            tip: "",
            click: () => {
                setComment(item.vid, 'video')
            },
        },
        {
            label: "播放",
            icon: "<i class='iconfont icon-24gl-playCircle'></i>",
            tip: "",
            click: () => {
                routerInstance.push({
                    path: '/videoDetail',
                    query: {
                        vid: item.vid
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
                    useVideoShare(item.vid, item.coverUrl, item.title, (status: { status: string }) => { console.log(status) })
                })
            },
        },
        {
            label: "复制链接",
            icon: "<i class='iconfont icon-fuzhilianjie'></i>",
            tip: "",
            click: () => {
                handleCopyLink('video', item.vid)
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
                        let res = await getCollectVideo(item.vid, 2)
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
