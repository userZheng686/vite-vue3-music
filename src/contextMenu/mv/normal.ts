import { dislikePlaylist } from "@/api/api_playList"
import { RecommendMVItem } from "@/interface/api/api_video"
import { setComment } from "@/localStorage/set"
import { useMvShare } from "@/utils/dialogShare"
import { ElMessage } from "element-plus"
import { menusEvent } from "vue3-menus"
import { routerInstance } from "../routerInstance"
import { handleCollectMV, handleDownloadMV, handleCopyLink, getDownloadMVUrl, loginCallback } from "../utils"

export function contextMenuMVList(event: MouseEvent, item: RecommendMVItem, mvList: RecommendMVItem[], rubbish: boolean) {
    let localUrl = getDownloadMVUrl(item.id)
    let list = [
        {
            label: `查看评论`,
            icon: "<i class='iconfont icon-pinglun1'></i>",
            tip: "",
            click: () => {
                setComment(item.id, 'mv')
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
                        mvid: item.id
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
                    handleCollectMV(item.id)
                    item.subed = true
                })
            },
            show: item.subed ? false : true
        },
        {
            label: '分享....',
            icon: "<i class='iconfont icon-fenxiang'></i>",
            tip: "",
            click: () => {
                loginCallback(() => {
                    useMvShare(item.id, item.picUrl, item.name, (status: { status: string }) => { console.log(status) })
                })
                
            },
            show: true
        },
        {
            label: "复制链接",
            icon: "<i class='iconfont icon-fuzhilianjie'></i>",
            tip: "",
            click: () => {
                handleCopyLink('playlist', item.id)
            },
            show: true
        },
        {
            label: "下载MV",
            icon: "<i class='iconfont icon-xiazai1'></i>",
            tip: "",
            click: () => {
                loginCallback(() => {
                    handleDownloadMV(item.id)
                })
                
            },
            show: localUrl ? false : true,
            divided: rubbish ? true : false
        },
        {
            label: "打开文件所在目录",
            icon: "<i class='iconfont icon-sixin'></i>",
            tip: "",
            click: () => {
                if (window.desktopMainAPI) {
                    window.desktopMainAPI.openPathFolder(localUrl)
                }
            },
            show: localUrl ? true : false,
            divided: rubbish ? true : false
        },
        {
            label: "不感兴趣",
            icon: "<i class='iconfont icon-chaping'></i>",
            tip: "",
            click: async () => {
                try {
                    let filterIds = mvList.filter(items => items.id !== item.id).map(items => Number(items.id))
                    let res = await dislikePlaylist(item.id, 6, item.alg, filterIds)
                    console.log('res', res)
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
