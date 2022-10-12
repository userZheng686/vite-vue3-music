import { useSongMenuPopupStore } from "@/store/songMenuPopup";
import { SongDetailSongsItem } from "@/interface/api/api_song"
import { setShare } from "@/localStorage/set"
import { downloadMusic } from "@/utils/download"
import { ElMessage } from "element-plus"
import { menusEvent } from "vue3-menus"
import { handlePlaySong, handleNextPlaySong, handleCollectPlaylist, loginCallback } from "../utils"
import { delUserCloud } from "@/api/api_cloudDisk";

//弹窗显示
let songMenu = useSongMenuPopupStore();


//刷新页面
let refreshList: Function = () => { }

//歌曲右键菜单
export function contextMenuMusicDisk(event: MouseEvent, row: SongDetailSongsItem) {
    let list = [
        {
            label: "播放",
            icon: "<i class='iconfont icon-24gl-playCircle'></i>",
            tip: "",
            click: () => {
                handlePlaySong(row)
            },
            show: true,
        },
        {
            label: "下一首播放",
            icon: "<i class='iconfont icon-xiayishou-yuanshijituantubiao'></i>",
            tip: "",
            click: () => {
                handleNextPlaySong(row)
            },
            show: true,
            divided: true
        },
        {
            label: "收藏到歌单",
            icon: "<i class='iconfont icon-shoucang1'></i>",
            tip: "",
            click: () => {
                return false
            },
            children: [
                {
                    label: "创建新歌单",
                    icon: "<i class='iconfont icon-plus-circle'>",
                    click: () => {
                        loginCallback(() => {
                            songMenu.createSongMenuShow = true
                        })

                    }
                },
            ],
            show: true
        },
        {
            label: "分享....",
            icon: "<i class='iconfont icon-fenxiang'></i>",
            tip: "",
            click: () => {
                loginCallback(() => {
                    let ar = (row.ar || row.artists).map(item => item.name)
                    setShare({
                        id: Number(row.id),
                        type: row.radio ? 'radioProgram' : 'song',
                        currentSongImg: row?.al?.picUrl || row?.album?.picUrl,
                        title: row.name,
                        ar
                    })
                })

            },
            show: true
        },
        {
            label: "下载",
            icon: "<i class='iconfont icon-xiazai1'></i>",
            tip: "",
            click: () => {
                loginCallback(() => {
                    downloadMusic(row)
                })

            },
            show: row.songUrl ? false : true,
            divided: true
        },
        {
            label: "打开文件所在目录",
            icon: "<i class='iconfont icon-sixin'></i>",
            tip: "",
            click: () => {
                if (window.desktopMainAPI) {
                    window.desktopMainAPI.openPathFolder(row.songUrl)
                }
            },
            show: row.songUrl ? true : false,
            divided: true
        },
        {
            label: "删除",
            icon: "<i class='iconfont icon-shanchu'></i>",
            tip: "",
            click: async () => {
                loginCallback(async () => {
                    try {
                        let res = await delUserCloud(String(row.id))
                        ElMessage.success('删除成功')
                        refreshList(row.id)
                    } catch (e: any) {
                        ElMessage.error('删除失败')
                    }
                })

            },
            show: true,
        },
    ]
    list = list.filter(item => item.show)
    //收藏到歌单
    let index = list.findIndex(item => item.label === '收藏到歌单')
    if (index !== -1 && list[index].children) {
        handleCollectPlaylist(list[index].children, row)
    }
    menusEvent(event, list, row);
}



export function refreshCallback(callback: Function) {
    refreshList = callback;
}