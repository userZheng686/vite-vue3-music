import { Radio } from "i/api/api_radio";
import { SongDetailSongsItem } from "i/api/api_song";
import { setComment } from "@/localStorage/set";
import { useRadioProgramShare } from "@/utils/dialogShare";
import { downloadMusic } from "@/utils/download";
import { menusEvent } from "vue3-menus";
import { routerInstance } from "../routerInstance";
import { handleIsSubRadio, handleCollectDj, handleCopyLink, handleNextPlaySong, handlePlaySong, loginCallback } from "../utils";
import { ResouceCommentInfo } from "i/api/api_comment";
import { historyList } from "@/localStorage/init";


//播客的右键菜单
export async function contextMenuRecentlyPlayProgram(event: MouseEvent, item: SongDetailSongsItem) {
    event.preventDefault()
    let list = [
        {
            label: `查看评论`,
            icon: "<i class='iconfont icon-pinglun1'></i>",
            tip: "",
            click: () => {
                setComment(item.radio.lastProgramId, 'djProgram')
            },
            show: true
        },
        {
            label: "播放",
            icon: "<i class='iconfont icon-24gl-playCircle'></i>",
            tip: "",
            click: () => {
                handlePlaySong(item)
            },
            show: true,

        },
        {
            label: "下一首播放",
            icon: "<i class='iconfont icon-xiayishou-yuanshijituantubiao'></i>",
            tip: "",
            click: () => {
                handleNextPlaySong(item)
            },
            show: true,
            divided: true
        },
        {
            label: "分享....",
            icon: "<i class='iconfont icon-fenxiang'></i>",
            tip: "",
            click: () => {
                loginCallback(() => {
                    let img = item?.album?.picUrl
                    useRadioProgramShare(
                        item.radio.lastProgramId,
                        img,
                        item.name,
                        (res: { status: string }) => {
                            console.log('res', res)
                        }
                    )
                })
            },
            show: true
        },
        {
            label: "复制链接",
            icon: "<i class='iconfont icon-fuzhilianjie'></i>",
            tip: "",
            click: () => {
                handleCopyLink('dj', item.radio.lastProgramId)
            },
            show: true
        },
        {
            label: "下载",
            icon: "<i class='iconfont icon-xiazai1'></i>",
            tip: "",
            click: () => {
                loginCallback(() => {
                    downloadMusic(item)
                })
            },
            // show: row.songUrl ? false : true,
            show: true,
            divided: true
        },
        {
            label: "打开文件所在目录",
            icon: "<i class='iconfont icon-sixin'></i>",
            tip: "",
            click: () => {
                if (window.desktopMainAPI && item) {
                    window.desktopMainAPI.openPathFolder(item.songUrl)
                }
            },
            // show: row.songUrl ? true : false,
            show: false,
            divided: true
        },
        {
            label: "从列表中删除",
            icon: "<i class='iconfont icon-shanchu'></i>",
            tip: "",
            click: () => {
                let index = historyList.value.findIndex(items => items.id === item.id)
                if (index !== -1) {
                    historyList.value.splice(index, 1)
                }
            },
            show: true,
        },
    ]
    list = list.filter(item => item.show)
    menusEvent(event, list, item);

}