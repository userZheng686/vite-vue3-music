import { Radio } from "i/api/api_radio";
import { SongDetailSongsItem } from "i/api/api_song";
import { setComment } from "@/localStorage/set";
import { useRadioProgramShare } from "@/utils/dialogShare";
import { downloadMusic } from "@/utils/download";
import { menusEvent } from "vue3-menus";
import { routerInstance } from "../routerInstance";
import { handleCopyLink, handleNextPlaySong, handlePlaySong, loginCallback } from "../utils";


//播客的右键菜单
export async function contextMenuDjProgram(event: MouseEvent, item: {
    creativeId: number;
    mainTitle: string;
    imageurl: string;
    radio?: Radio;
    mainSong?: SongDetailSongsItem;
}) {
    event.preventDefault()
    let list = [
        {
            label: `查看评论`,
            icon: "<i class='iconfont icon-pinglun1'></i>",
            tip: "",
            click: () => {
                setComment(item.creativeId, 'djProgram')
            },
            show: true
        },
        {
            label: "播放",
            icon: "<i class='iconfont icon-24gl-playCircle'></i>",
            tip: "",
            click: () => {
                if (item.mainSong) {
                    handlePlaySong(item.mainSong)
                }
            },
            show: true,

        },
        {
            label: "下一首播放",
            icon: "<i class='iconfont icon-xiayishou-yuanshijituantubiao'></i>",
            tip: "",
            click: () => {
                if (item.mainSong) {
                    handleNextPlaySong(item.mainSong)
                }
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
                    useRadioProgramShare(
                        item.creativeId,
                        item.imageurl,
                        item.mainTitle,
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
                handleCopyLink('dj', item.creativeId)
            },
            show: true
        },
        {
            label: "下载",
            icon: "<i class='iconfont icon-xiazai1'></i>",
            tip: "",
            click: () => {
                loginCallback(() => {
                    if (item.mainSong) {
                        downloadMusic(item.mainSong)
                    }
                })

            },
            show: item.mainSong?.songUrl ? false : true,
        },
        {
            label: "打开文件所在目录",
            icon: "<i class='iconfont icon-sixin'></i>",
            tip: "",
            click: () => {
                if (window.desktopMainAPI && item.mainSong) {
                    window.desktopMainAPI.openPathFolder(item.mainSong.songUrl)
                }
            },
            show: item.mainSong?.songUrl ? true : false,
        },
    ]

    list = list.filter(item => item.show)
    menusEvent(event, list, item);
}