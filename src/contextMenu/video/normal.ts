import { CategoryVideoListItemData } from "i/api/api_video"
import { setComment } from "@/localStorage/set"
import { useMvShare, useVideoShare } from "@/utils/dialogShare"
import { ElMessage } from "element-plus"
import { menusEvent } from "vue3-menus"
import { routerInstance } from "../routerInstance"
import { handleCollectVideo, handleCopyLink, loginCallback } from "../utils"
import { dislikeVideo } from "@/api/api_video"

export function contextMenuVideoList(event: MouseEvent, item: CategoryVideoListItemData, rubbish: boolean, removeCallback?: Function) {
    let list = [
        {
            label: `查看评论`,
            icon: "<i class='iconfont icon-pinglun1'></i>",
            tip: "",
            click: () => {
                setComment(item.vid, 'video')
            },
            show: true
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
            show: true,
            divided: true
        },
        {
            label: '收藏',
            icon: "<i class='iconfont icon-shoucang1'></i>",
            tip: "",
            click: () => {
                loginCallback(() => {
                    handleCollectVideo(item.vid)
                    item.subscribed = true
                })

            },
            show: item.subscribed ? false : true
        },
        {
            label: '分享....',
            icon: "<i class='iconfont icon-fenxiang'></i>",
            tip: "",
            click: () => {
                loginCallback(() => {
                    if (item.type === 0) {
                        useMvShare(Number(item.vid), item.coverUrl, item.title, (status: { status: string }) => { console.log(status) })
                    } else {
                        useVideoShare(item.vid, item.coverUrl, item.title, (status: { status: string }) => { console.log(status) })
                    }
                })
            },
            show: true
        },
        {
            label: "复制链接",
            icon: "<i class='iconfont icon-fuzhilianjie'></i>",
            tip: "",
            click: () => {
                handleCopyLink('video', item.vid)
            },
            show: true,
            divided: rubbish ? true : false
        },
        {
            label: "不感兴趣",
            icon: "<i class='iconfont icon-chaping'></i>",
            tip: "",
            click: async () => {
                try {
                    let res = await dislikeVideo(item.vid, 1)
                    ElMessage.success('将不再推荐这类内容...')
                    removeCallback && removeCallback(item.vid)
                } catch (e: any) {
                    ElMessage.error(e?.msg || '今天没有更多推荐了')
                }
            },
            show: rubbish
        },
    ]
    list = list.filter(item => item.show)
    menusEvent(event, list, item);
}
